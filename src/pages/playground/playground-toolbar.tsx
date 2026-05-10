import { Play, RotateCcw, Sparkles, SquarePlay } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Kbd } from "@/components/ui/kbd";
import { usePlayground } from "./playground-context";

interface PlaygroundToolbarProps {
  onOpenSeedDialog: () => void;
}

const PlaygroundToolbar = ({ onOpenSeedDialog }: PlaygroundToolbarProps) => {
  const { runState, runAll, runSelection, resetDb, selection, engine } =
    usePlayground();

  const isReady = engine.status === "ready";
  const isRunning = runState.status === "running";
  const hasSelection = selection.trim().length > 0;

  const handleReset = () => {
    if (
      window.confirm(
        "Reset the database? All changes you made in this session will be lost; the original schema will be re-applied.",
      )
    ) {
      resetDb();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/20 px-3 py-2">
      <Button
        size="sm"
        onClick={runAll}
        disabled={!isReady || isRunning}
        title="Run the entire buffer"
      >
        {isRunning ? <Spinner className="size-3.5" /> : <Play className="size-3.5" />}
        Run
        <Kbd className="ml-1 hidden sm:inline-flex">Ctrl</Kbd>
        <Kbd className="hidden sm:inline-flex">Enter</Kbd>
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={runSelection}
        disabled={!isReady || isRunning || !hasSelection}
        title="Run only the highlighted text"
      >
        <SquarePlay className="size-3.5" />
        Run selection
        <Kbd className="ml-1 hidden sm:inline-flex">Ctrl</Kbd>
        <Kbd className="hidden sm:inline-flex">Shift</Kbd>
        <Kbd className="hidden sm:inline-flex">Enter</Kbd>
      </Button>

      <div className="mx-1 h-5 w-px bg-border" aria-hidden />

      <Button
        size="sm"
        variant="outline"
        onClick={handleReset}
        disabled={!isReady || isRunning}
        title="Re-apply the original seed and discard everything else"
      >
        <RotateCcw className="size-3.5" />
        Reset DB
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={onOpenSeedDialog}
        disabled={!isReady || isRunning || engine.schema.length === 0}
        title="Generate fake INSERT statements with faker"
      >
        <Sparkles className="size-3.5" />
        Seed data
      </Button>

      <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
        {runState.status === "ok" && runState.results.length > 0 && (
          <span>
            {runState.results.length} statement
            {runState.results.length === 1 ? "" : "s"} ·{" "}
            {runState.results.reduce((acc, r) => acc + r.durationMs, 0)}ms
          </span>
        )}
        {runState.status === "error" && runState.error && (
          <span className="text-destructive">Error: {runState.error.message}</span>
        )}
      </div>
    </div>
  );
};

export default PlaygroundToolbar;
