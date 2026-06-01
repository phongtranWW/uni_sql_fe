import { useCallback } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  selectPlaygroundBuffer,
  selectPlaygroundSelection,
} from "@/features/playground/selectors/playground.selector";
import {
  playgroundRunStarted,
  playgroundRunSucceeded,
  playgroundRunFailed,
  playgroundRunReset,
  playgroundHistoryAppended,
} from "@/features/playground/playground.slice";
import {
  isQueryError,
  type QueryError,
  type QueryResult,
} from "@/lib/sql-engine";
import type { UseSqlEngineResult } from "@/hooks/use-sql-engine";

export const usePlaygroundActions = (engine: UseSqlEngineResult) => {
  const dispatch = useAppDispatch();
  const buffer = useAppSelector(selectPlaygroundBuffer);
  const selection = useAppSelector(selectPlaygroundSelection);

  const recordHistory = useCallback(
    (sql: string, ok: boolean, summary: string) => {
      dispatch(
        playgroundHistoryAppended({
          id: nanoid(),
          sql,
          ranAt: new Date().toISOString(),
          ok,
          summary,
        }),
      );
    },
    [dispatch],
  );

  const executeBuffer = useCallback(
    async (sql: string) => {
      const trimmed = sql.trim();
      if (!trimmed) {
        toast.info("Nothing to run.");
        return;
      }
      if (engine.status !== "ready") {
        toast.error("Engine is not ready yet.");
        return;
      }

      dispatch(playgroundRunStarted());

      try {
        const results: QueryResult[] = await engine.run(trimmed);
        const totalMs = results.reduce((acc, r) => acc + r.durationMs, 0);
        const totalRows = results.reduce((acc, r) => acc + r.rows.length, 0);
        dispatch(playgroundRunSucceeded(results));
        recordHistory(
          trimmed,
          true,
          `${results.length} stmt · ${totalRows} row${totalRows === 1 ? "" : "s"} · ${totalMs}ms`,
        );
      } catch (err) {
        const error: QueryError = isQueryError(err)
          ? err
          : { message: err instanceof Error ? err.message : String(err) };
        dispatch(playgroundRunFailed(error));
        recordHistory(trimmed, false, error.message);
      }
    },
    [engine, dispatch, recordHistory],
  );

  const runAll = useCallback(() => {
    void executeBuffer(buffer);
  }, [buffer, executeBuffer]);

  const runSelection = useCallback(() => {
    if (!selection.trim()) {
      void executeBuffer(buffer);
      return;
    }
    void executeBuffer(selection);
  }, [buffer, selection, executeBuffer]);

  const resetDb = useCallback(() => {
    void engine.reset().then(() => {
      dispatch(playgroundRunReset());
      toast.success("Database reset to the original schema.");
    });
  }, [engine, dispatch]);

  return {
    runAll,
    runSelection,
    resetDb,
  };
};
