import { AlertTriangle, History, MessageSquare, Table2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  playgroundHistoryCleared,
} from "@/features/playground/playground.slice";
import { selectPlaygroundHistory } from "@/features/playground/selectors/playground.selector";
import { usePlayground } from "./playground-context";
import PlaygroundResultsTable from "./playground-results-table";

const PlaygroundResults = () => {
  const { runState, setBuffer } = usePlayground();
  const history = useAppSelector(selectPlaygroundHistory);
  const dispatch = useAppDispatch();

  return (
    <Tabs defaultValue="results" className="flex h-full flex-col">
      <TabsList className="mx-3 mt-2 self-start">
        <TabsTrigger value="results">
          <Table2 className="size-3.5" /> Results
        </TabsTrigger>
        <TabsTrigger value="messages">
          <MessageSquare className="size-3.5" /> Messages
        </TabsTrigger>
        <TabsTrigger value="history">
          <History className="size-3.5" /> History
        </TabsTrigger>
      </TabsList>

      {/* ── Results tab ── */}
      <TabsContent value="results" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-3 p-3">
            {runState.status === "idle" && (
              <p className="text-sm italic text-muted-foreground">
                Hit <span className="font-mono not-italic">Ctrl+Enter</span> to run the SQL above.
              </p>
            )}
            {runState.status === "running" && (
              <p className="text-sm italic text-muted-foreground">Running…</p>
            )}
            {runState.status === "error" && runState.error && (
              <ErrorBanner
                message={runState.error.message}
                hint={runState.error.hint}
                code={runState.error.code}
                position={runState.error.position}
                statement={runState.error.statement}
              />
            )}
            {runState.status === "ok" && runState.results.length === 0 && (
              <p className="text-sm italic text-muted-foreground">
                Statement executed but produced no results.
              </p>
            )}
            {runState.results.map((r, i) => (
              <PlaygroundResultsTable key={i} result={r} />
            ))}
          </div>
        </ScrollArea>
      </TabsContent>

      {/* ── Messages tab ── */}
      <TabsContent value="messages" className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <pre className="p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {buildMessages(runState)}
          </pre>
        </ScrollArea>
      </TabsContent>

      {/* ── History tab ── */}
      <TabsContent value="history" className="flex-1 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-3 py-1.5 text-xs text-muted-foreground">
          <span>{history.length} entr{history.length === 1 ? "y" : "ies"}</span>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => dispatch(playgroundHistoryCleared())}
            >
              Clear
            </Button>
          )}
        </div>
        <ScrollArea className="h-full">
          <ul className="divide-y divide-border">
            {history.length === 0 ? (
              <li className="p-3 text-sm italic text-muted-foreground">
                No queries yet.
              </li>
            ) : (
              history.map((h) => (
                <li
                  key={h.id}
                  className="cursor-pointer px-3 py-2 text-xs transition-colors hover:bg-muted/40"
                  onClick={() => setBuffer(h.sql)}
                  title="Click to load this query into the editor"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={
                        h.ok
                          ? "font-medium text-emerald-700 dark:text-emerald-300"
                          : "font-medium text-destructive"
                      }
                    >
                      {h.ok ? "OK" : "Error"}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(h.ranAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {h.summary && (
                    <p className="mt-0.5 text-muted-foreground">{h.summary}</p>
                  )}
                  <pre className="mt-1 line-clamp-2 font-mono text-xs whitespace-pre-wrap">
                    {h.sql}
                  </pre>
                </li>
              ))
            )}
          </ul>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

interface ErrorBannerProps {
  message: string;
  hint?: string;
  code?: string;
  position?: number;
  statement?: string;
}

const ErrorBanner = ({ message, hint, code, position, statement }: ErrorBannerProps) => (
  <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
    <div className="flex items-center gap-2 font-medium text-destructive">
      <AlertTriangle className="size-4" />
      {code ? `[${code}] ` : ""}
      {message}
    </div>
    {hint && (
      <p className="mt-1 text-xs text-destructive/80">Hint: {hint}</p>
    )}
    {statement && (
      <pre className="mt-2 max-h-32 overflow-auto rounded-sm bg-background/60 p-2 font-mono text-xs whitespace-pre-wrap">
        {position
          ? annotatePosition(statement, position)
          : statement}
      </pre>
    )}
  </div>
);

/**
 * Insert a caret marker on a separate line under `position` so the user can
 * eyeball the offending token. position is 1-based byte offset.
 */
function annotatePosition(statement: string, position: number): string {
  const idx = Math.max(0, position - 1);
  const before = statement.slice(0, idx);
  const after = statement.slice(idx);
  // Caret is placed on the next line for readability; surrounding spaces
  // intentionally mimic the failing token's column.
  const lastNewline = before.lastIndexOf("\n");
  const col = idx - (lastNewline + 1);
  return `${before}${after}\n${" ".repeat(col)}^`;
}

function buildMessages(runState: ReturnType<typeof usePlayground>["runState"]): string {
  if (runState.status === "idle") return "(no queries run yet)";
  if (runState.status === "running") return "Running…";
  if (runState.status === "error" && runState.error) {
    return [
      `[ERROR]${runState.error.code ? ` ${runState.error.code}` : ""} ${runState.error.message}`,
      runState.error.hint ? `Hint: ${runState.error.hint}` : null,
      runState.error.statement ? `\nStatement:\n${runState.error.statement}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  }
  return runState.results
    .map((r, i) => {
      const tag = r.command ?? "OK";
      return `[#${i + 1}] ${tag} · ${r.rows.length} row${
        r.rows.length === 1 ? "" : "s"
      } · ${r.durationMs}ms`;
    })
    .join("\n");
}

export default PlaygroundResults;
