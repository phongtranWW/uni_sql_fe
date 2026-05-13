import { AlertCircle, History, Table2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  playgroundHistoryCleared,
  playgroundBufferSet,
} from "@/features/playground/playground.slice";
import {
  selectPlaygroundHistory,
  selectPlaygroundRunState,
} from "@/features/playground/selectors/playground.selector";
import PlaygroundResultsTable from "./playground-results-table";

const PlaygroundResults = () => {
  const runState = useAppSelector(selectPlaygroundRunState);
  const history = useAppSelector(selectPlaygroundHistory);
  const dispatch = useAppDispatch();

  return (
    <Tabs defaultValue="results" className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <TabsList className="h-8">
          <TabsTrigger value="results" className="gap-1.5 text-xs">
            <Table2 className="size-3.5" />
            Results
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 text-xs">
            <History className="size-3.5" />
            History
          </TabsTrigger>
        </TabsList>

        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(playgroundHistoryCleared())}
            className="text-xs"
          >
            Clear history
          </Button>
        )}
      </div>

      {/* ── Results tab ── */}
      <TabsContent value="results" className="mt-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-3 p-3">
            {runState.status === "idle" && (
              <p className="text-sm text-muted-foreground">
                Press <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">Ctrl+Enter</kbd> to run your SQL
              </p>
            )}
            {runState.status === "running" && (
              <p className="text-sm text-muted-foreground">Executing query...</p>
            )}
            {runState.status === "error" && runState.error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertTitle className="text-sm">
                  {runState.error.code ? `[${runState.error.code}] ` : ""}
                  {runState.error.message}
                </AlertTitle>
                {runState.error.hint && (
                  <AlertDescription className="text-xs">
                    {runState.error.hint}
                  </AlertDescription>
                )}
                {runState.error.statement && (
                  <pre className="mt-2 max-h-32 overflow-auto rounded bg-background/60 p-2 font-mono text-xs">
                    {runState.error.position
                      ? annotatePosition(runState.error.statement, runState.error.position)
                      : runState.error.statement}
                  </pre>
                )}
              </Alert>
            )}
            {runState.status === "ok" && runState.results.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Query executed successfully (no results returned)
              </p>
            )}
            {runState.results.map((r, i) => (
              <PlaygroundResultsTable key={i} result={r} />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      {/* ── History tab ── */}
      <TabsContent value="history" className="mt-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {history.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">
              No query history yet
            </p>
          ) : (
            <ul className="divide-y">
              {history.map((h) => (
                <li
                  key={h.id}
                  className="cursor-pointer px-3 py-2.5 transition-colors hover:bg-muted/40"
                  onClick={() => dispatch(playgroundBufferSet(h.sql))}
                  title="Click to load this query"
                >
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span
                      className={
                        h.ok
                          ? "font-medium text-emerald-600 dark:text-emerald-400"
                          : "font-medium text-destructive"
                      }
                    >
                      {h.ok ? "Success" : "Error"}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(h.ranAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {h.summary && (
                    <p className="mt-1 text-xs text-muted-foreground">{h.summary}</p>
                  )}
                  <pre className="mt-1.5 line-clamp-2 font-mono text-xs text-foreground/80">
                    {h.sql}
                  </pre>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

/**
 * Insert a caret marker on a separate line under `position` so the user can
 * eyeball the offending token. position is 1-based byte offset.
 */
function annotatePosition(statement: string, position: number): string {
  const idx = Math.max(0, position - 1);
  const before = statement.slice(0, idx);
  const after = statement.slice(idx);
  const lastNewline = before.lastIndexOf("\n");
  const col = idx - (lastNewline + 1);
  return `${before}${after}\n${" ".repeat(col)}^`;
}

export default PlaygroundResults;
