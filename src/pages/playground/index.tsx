import { useCallback, useMemo, useState } from "react";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { selectPlaygroundSeed } from "@/features/playground/selectors/playground.selector";
import { playgroundHistoryAppended } from "@/features/playground/playground.slice";
import { useSqlEngine } from "@/hooks/use-sql-engine";
import { isQueryError, type QueryError, type QueryResult } from "@/lib/sql-engine";
import {
  PlaygroundContext,
  type PlaygroundContextValue,
  type RunState,
} from "./playground-context";
import PlaygroundEditor from "./playground-editor";
import PlaygroundEmptyState from "./playground-empty-state";
import PlaygroundHeader from "./playground-header";
import PlaygroundResults from "./playground-results";
import PlaygroundSchemaPanel from "./playground-schema-panel";
import PlaygroundToolbar from "./playground-toolbar";

const DEFAULT_BUFFER = `-- Try a query against your schema, e.g.:
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
`;

const Playground = () => {
  const seed = useAppSelector(selectPlaygroundSeed);

  if (!seed) {
    return <PlaygroundEmptyState />;
  }

  // Re-mount the inner workspace whenever the seed identity changes so the
  // engine boots from scratch with the new schema.
  return <PlaygroundWorkspace key={seed.createdAt} />;
};

/**
 * The actual workspace. Lives inside its own component so the engine hook
 * runs only when there *is* a seed.
 */
const PlaygroundWorkspace = () => {
  const seed = useAppSelector(selectPlaygroundSeed)!;
  const dispatch = useAppDispatch();

  const engine = useSqlEngine(seed.dialect, seed.sql);

  const [buffer, setBuffer] = useState<string>(DEFAULT_BUFFER);
  const [selection, setSelection] = useState<string>("");
  const [runState, setRunState] = useState<RunState>({
    status: "idle",
    results: [],
    error: null,
    finishedAt: null,
  });

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

      setRunState({ status: "running", results: [], error: null, finishedAt: null });

      try {
        const results: QueryResult[] = await engine.run(trimmed);
        const totalMs = results.reduce((acc, r) => acc + r.durationMs, 0);
        const totalRows = results.reduce((acc, r) => acc + r.rows.length, 0);
        setRunState({
          status: "ok",
          results,
          error: null,
          finishedAt: new Date().toISOString(),
        });
        recordHistory(
          trimmed,
          true,
          `${results.length} stmt · ${totalRows} row${totalRows === 1 ? "" : "s"} · ${totalMs}ms`,
        );
      } catch (err) {
        const error: QueryError = isQueryError(err)
          ? err
          : { message: err instanceof Error ? err.message : String(err) };
        setRunState({
          status: "error",
          results: [],
          error,
          finishedAt: new Date().toISOString(),
        });
        recordHistory(trimmed, false, error.message);
      }
    },
    [engine, recordHistory],
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
      setRunState({ status: "idle", results: [], error: null, finishedAt: null });
      toast.success("Database reset to the original schema.");
    });
  }, [engine]);

  const ctx = useMemo<PlaygroundContextValue>(
    () => ({
      seed,
      engine,
      buffer,
      setBuffer,
      selection,
      setSelection,
      runState,
      runAll,
      runSelection,
      resetDb,
    }),
    [seed, engine, buffer, selection, runState, runAll, runSelection, resetDb],
  );

  return (
    <PlaygroundContext.Provider value={ctx}>
      <div className="flex h-screen flex-col bg-background">
        <PlaygroundHeader />

        {engine.status === "error" ? (
          <BootError message={engine.initError ?? "Unknown error"} />
        ) : (
          <ResizablePanelGroup
            orientation="horizontal"
            className="flex-1 overflow-hidden"
          >
            <ResizablePanel
              defaultSize={20}
              minSize={14}
              maxSize={35}
              collapsible
            >
              <PlaygroundSchemaPanel />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={80} minSize={40}>
              <ResizablePanelGroup orientation="vertical">
                <ResizablePanel defaultSize={45} minSize={20}>
                  <div className="flex h-full flex-col">
                    <PlaygroundToolbar />
                    <div className="flex-1 overflow-hidden">
                      <PlaygroundEditor />
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                <ResizablePanel defaultSize={55} minSize={20}>
                  <PlaygroundResults />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </div>
    </PlaygroundContext.Provider>
  );
};

interface BootErrorProps {
  message: string;
}

const BootError = ({ message }: BootErrorProps) => (
  <div className="flex flex-1 items-center justify-center p-6">
    <div className="max-w-md space-y-3 rounded-md border border-destructive/40 bg-destructive/5 p-4 text-sm">
      <p className="font-medium text-destructive">Failed to start the engine</p>
      <pre className="overflow-auto rounded bg-background/60 p-2 font-mono text-xs whitespace-pre-wrap">
        {message}
      </pre>
      <p className="text-muted-foreground">
        Try going back to the editor and re-exporting the project. If the issue
        persists, the SQL may contain a statement pglite doesn't support yet.
      </p>
    </div>
  </div>
);

export default Playground;
