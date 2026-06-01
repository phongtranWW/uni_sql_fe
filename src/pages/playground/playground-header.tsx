import { ArrowLeft, Database, Play, RotateCcw, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSelector } from "@/app/hook";
import {
  selectPlaygroundSeed,
  selectPlaygroundSelection,
  selectPlaygroundRunState,
} from "@/features/playground/selectors/playground.selector";
import ThemeToggle from "@/components/custom/theme-toggle";
import type { UseSqlEngineResult } from "@/hooks/use-sql-engine";
import { usePlaygroundActions } from "./use-playground-actions";

interface PlaygroundHeaderProps {
  engine: UseSqlEngineResult;
  onOpenSeedDialog: () => void;
}

const PlaygroundHeader = ({
  engine,
  onOpenSeedDialog,
}: PlaygroundHeaderProps) => {
  const seed = useAppSelector(selectPlaygroundSeed);
  const selection = useAppSelector(selectPlaygroundSelection);
  const runState = useAppSelector(selectPlaygroundRunState);
  const navigate = useNavigate();
  const { runAll, runSelection, resetDb } = usePlaygroundActions(engine);

  if (!seed) return null;

  const isReady = engine.status === "ready";
  const isRunning = runState.status === "running";
  const hasSelection = selection.trim().length > 0;

  const goBack = () => {
    if (seed.projectId) {
      navigate(`/editor/projects/${seed.projectId}`);
    } else {
      navigate(-1);
    }
  };

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
    <header className="flex items-center gap-3 border-b bg-background px-3 py-2">
      <Button variant="ghost" size="sm" onClick={goBack} className="gap-1.5">
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="h-4 w-px bg-border" />

      <div className="flex items-center gap-2">
        <Database className="size-4 text-muted-foreground" />
        <span className="text-sm font-medium">SQL Playground</span>
        {seed.projectName && (
          <>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-muted-foreground">
              {seed.projectName}
            </span>
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
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

        <div className="h-4 w-px bg-border" />

        <ThemeToggle />
      </div>
    </header>
  );
};

export default PlaygroundHeader;
