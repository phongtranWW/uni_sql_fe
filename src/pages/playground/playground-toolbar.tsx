import { Play, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector } from "@/app/hook";
import {
  selectPlaygroundSelection,
  selectPlaygroundRunState,
} from "@/features/playground/selectors/playground.selector";
import type { UseSqlEngineResult } from "@/hooks/use-sql-engine";
import { usePlaygroundActions } from "./use-playground-actions";

interface PlaygroundToolbarProps {
  engine: UseSqlEngineResult;
  onOpenSeedDialog: () => void;
}

const PlaygroundToolbar = ({ engine, onOpenSeedDialog }: PlaygroundToolbarProps) => {
  const selection = useAppSelector(selectPlaygroundSelection);
  const runState = useAppSelector(selectPlaygroundRunState);
  const { runAll, runSelection, resetDb } = usePlaygroundActions(engine);

  const isReady = engine.status === "ready";
  const isRunning = runState.status === "running";
  const hasSelection = selection.trim().length > 0;

  const handleReset = () => {
    if (
      window.confirm(
        "Reset the database? All changes will be lost and the original schema will be re-applied.",
      )
    ) {
      resetDb();
    }
  };

  const handleRun = () => {
    if (hasSelection) {
      runSelection();
    } else {
      runAll();
    }
  };

  return (
    <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-2">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              onClick={handleRun}
              disabled={!isReady || isRunning}
              className="gap-1.5"
            >
              {isRunning ? (
                <Spinner className="size-3.5" />
              ) : (
                <Play className="size-3.5" />
              )}
              {hasSelection ? "Run Selection" : "Run"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {hasSelection ? "Ctrl+Shift+Enter" : "Ctrl+Enter"}
            </p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={!isReady || isRunning}
            >
              <RotateCcw className="size-3.5" />
              Reset
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Re-apply original schema</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenSeedDialog}
              disabled={!isReady || isRunning || engine.schema.length === 0}
            >
              <Sparkles className="size-3.5" />
              Seed
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Generate fake data</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {runState.status === "ok" && runState.results.length > 0 && (
          <span>
            {runState.results.length} statement
            {runState.results.length === 1 ? "" : "s"} ·{" "}
            {runState.results.reduce((acc, r) => acc + r.durationMs, 0)}ms
          </span>
        )}
        {runState.status === "error" && runState.error && (
          <span className="text-destructive">
            {runState.error.message}
          </span>
        )}
      </div>
    </div>
  );
};

export default PlaygroundToolbar;
