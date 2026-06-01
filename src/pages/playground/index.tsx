import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  selectPlaygroundSeed,
  selectPlaygroundEngineStatus,
  selectPlaygroundEngineError,
} from "@/features/playground/selectors/playground.selector";
import {
  playgroundEngineStatusSet,
  playgroundEngineErrorSet,
} from "@/features/playground/playground.slice";
import { useSqlEngine } from "@/hooks/use-sql-engine";
import LoadingView from "@/components/custom/loading-view";
import ErrorView from "@/components/custom/error-view";
import IdleView from "@/components/custom/idle-view";
import PlaygroundEmptyState from "./playground-empty-state";
import PlaygroundHeader from "./playground-header";
import PlaygroundSeedDialog from "./playground-seed-dialog";
import PlaygroundWorkspaceLayout from "./playground-workspace-layout";

const Playground = () => {
  const seed = useAppSelector(selectPlaygroundSeed);

  if (!seed) {
    return <PlaygroundEmptyState />;
  }

  return <PlaygroundWorkspace key={seed.createdAt} />;
};

const PlaygroundWorkspace = () => {
  const dispatch = useAppDispatch();
  const seed = useAppSelector(selectPlaygroundSeed)!;
  const engineStatus = useAppSelector(selectPlaygroundEngineStatus);
  const engineError = useAppSelector(selectPlaygroundEngineError);

  const engine = useSqlEngine(seed.dialect, seed.sql);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);

  useEffect(() => {
    if (engine.status === "initializing") {
      dispatch(playgroundEngineStatusSet("initializing"));
    } else if (engine.status === "ready") {
      dispatch(playgroundEngineStatusSet("ready"));
    } else if (engine.status === "error") {
      dispatch(playgroundEngineErrorSet(engine.initError ?? "Unknown error"));
    }
  }, [engine.status, engine.initError, dispatch]);

  return (
    <div className="flex h-screen flex-col bg-background">
      <PlaygroundHeader engine={engine} onOpenSeedDialog={() => setSeedDialogOpen(true)} />
      {engineStatus === "idle" && <IdleView />}
      {engineStatus === "initializing" && <LoadingView />}
      {engineStatus === "error" && (
        <ErrorView message={engineError ?? undefined} />
      )}
      {engineStatus === "ready" && (
        <PlaygroundWorkspaceLayout engine={engine} />
      )}

      <PlaygroundSeedDialog
        open={seedDialogOpen}
        onOpenChange={setSeedDialogOpen}
        engine={engine}
      />
    </div>
  );
};

export default Playground;
