import { useCallback, useEffect, useRef, useState } from "react";
import {
  createEngine,
  isQueryError,
  type QueryError,
  type QueryResult,
  type SchemaTable,
  type SqlDialect,
  type SqlEngine,
} from "@/lib/sql-engine";

export type EngineStatus = "idle" | "initializing" | "ready" | "error";

export interface UseSqlEngineResult {
  status: EngineStatus;
  /** Populated when status === "error". */
  initError: string | null;
  /** Total time spent booting the engine (ms). */
  bootDurationMs: number | null;

  /** Snapshot of tables discovered in the DB; refreshes after each run/reset. */
  schema: SchemaTable[];
  schemaLoading: boolean;

  /** Run arbitrary SQL. Resolves with one entry per top-level statement. */
  run: (sql: string) => Promise<QueryResult[]>;
  /**
   * Run a multi-statement script as a single transaction-aware unit.
   * Used by the seed-data dialog so `BEGIN; ... COMMIT;` is atomic.
   */
  runScript: (
    sql: string,
  ) => Promise<{ success: boolean; affectedRows: number; durationMs: number }>;
  /** Tear down + re-init with the original seed. */
  reset: () => Promise<void>;
  /** Force-refresh the schema snapshot. Called automatically after run/reset. */
  refreshSchema: () => Promise<void>;
}

/**
 * Lifecycle wrapper around a SqlEngine.
 *
 * - Boots one engine on mount, tears it down on unmount.
 * - Exposes `run` / `reset` / `refreshSchema` with React-friendly state.
 * - Re-initialises if `dialect` or `seedSql` change identity (e.g. user
 *   navigates back to /playground with a different project).
 *
 * Errors thrown by `run` propagate to the caller so the UI can render them
 * inside the results panel — they are *not* stored in `initError`.
 */
export function useSqlEngine(
  dialect: SqlDialect,
  seedSql: string,
): UseSqlEngineResult {
  const engineRef = useRef<SqlEngine | null>(null);
  const [status, setStatus] = useState<EngineStatus>("idle");
  const [initError, setInitError] = useState<string | null>(null);
  const [bootDurationMs, setBootDurationMs] = useState<number | null>(null);
  const [schema, setSchema] = useState<SchemaTable[]>([]);
  const [schemaLoading, setSchemaLoading] = useState(false);

  // Boot / re-boot whenever the inputs change.
  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();

    setStatus("initializing");
    setInitError(null);
    setBootDurationMs(null);
    setSchema([]);

    const engine = createEngine(dialect);

    engine
      .init(seedSql)
      .then(async () => {
        if (cancelled) {
          await engine.close();
          return;
        }
        engineRef.current = engine;
        const tables = await engine.getSchema();
        if (cancelled) {
          await engine.close();
          return;
        }
        setSchema(tables);
        setBootDurationMs(Math.round(performance.now() - startedAt));
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : isQueryError(err)
              ? (err as QueryError).message
              : "Failed to initialise SQL engine";
        setInitError(message);
        setStatus("error");
      });

    return () => {
      cancelled = true;
      const current = engineRef.current;
      engineRef.current = null;
      if (current) {
        // Fire-and-forget — close errors are non-fatal.
        void current.close().catch(() => undefined);
      } else {
        // init() may still be in flight; close the local instance too.
        void engine.close().catch(() => undefined);
      }
    };
  }, [dialect, seedSql]);

  const refreshSchema = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;
    setSchemaLoading(true);
    try {
      const tables = await engine.getSchema();
      setSchema(tables);
    } finally {
      setSchemaLoading(false);
    }
  }, []);

  const run = useCallback(
    async (sql: string): Promise<QueryResult[]> => {
      const engine = engineRef.current;
      if (!engine) throw new Error("Engine is not ready yet");
      try {
        const results = await engine.execute(sql);
        // Schema may have changed (CREATE/ALTER/DROP); refresh in the
        // background — don't block the run promise.
        void refreshSchema();
        return results;
      } catch (err) {
        // Even on error, DDL statements before the failure may have applied.
        void refreshSchema();
        throw err;
      }
    },
    [refreshSchema],
  );

  const runScript = useCallback(
    async (sql: string) => {
      const engine = engineRef.current;
      if (!engine) throw new Error("Engine is not ready yet");
      try {
        const result = await engine.executeScript(sql);
        void refreshSchema();
        return result;
      } catch (err) {
        void refreshSchema();
        throw err;
      }
    },
    [refreshSchema],
  );

  const reset = useCallback(async () => {
    const engine = engineRef.current;
    if (!engine) return;
    setStatus("initializing");
    setInitError(null);
    try {
      await engine.reset(seedSql);
      await refreshSchema();
      setStatus("ready");
    } catch (err) {
      setInitError(err instanceof Error ? err.message : "Reset failed");
      setStatus("error");
    }
  }, [seedSql, refreshSchema]);

  return {
    status,
    initError,
    bootDurationMs,
    schema,
    schemaLoading,
    run,
    runScript,
    reset,
    refreshSchema,
  };
}
