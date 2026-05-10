import Board from "@/pages/editor/board";
import Sidebar from "@/pages/editor/sidebar";
import PanelIssues from "@/pages/editor/panel-issues";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import SharedHeader from "./shared-header";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { useEffect } from "react";
import { useParams } from "react-router";
import { getSharedProject } from "@/features/project/thunks";
import { selectFetchStatus } from "@/features/project/selectors/project.selector";
import { ActionCreators } from "redux-undo";

const LoadingView = () => {
  const fetchStatus = useAppSelector(selectFetchStatus);
  if (fetchStatus !== "loading") return null;
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center gap-6">
      <div className="relative w-[100px] h-[100px]">
        <div
          className="absolute w-[30px] h-[30px] top-1/2 left-1/2 bg-blue-600 dark:bg-blue-500 animate-[up_2.4s_cubic-bezier(0,0,0.24,1.21)_infinite] shadow-sm"
          style={{ boxSizing: "border-box" }}
        />
        <div
          className="absolute w-[30px] h-[30px] bg-orange-500 dark:bg-orange-400 animate-[down_2.4s_cubic-bezier(0,0,0.24,1.21)_infinite] shadow-sm"
          style={{
            boxSizing: "border-box",
            top: "calc(50% - 30px)",
            left: "calc(50% - 30px)",
          }}
        />
        <style>{`
          @keyframes down {
            0%, 100% { transform: none; }
            25% { transform: translateX(100%); }
            50% { transform: translateX(100%) translateY(100%); }
            75% { transform: translateY(100%); }
          }
          @keyframes up {
            0%, 100% { transform: none; }
            25% { transform: translateX(-100%); }
            50% { transform: translateX(-100%) translateY(-100%); }
            75% { transform: translateY(-100%); }
          }
        `}</style>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Load data ...</p>
    </div>
  );
};

const IdleView = () => {
  const fetchStatus = useAppSelector(selectFetchStatus);
  if (fetchStatus !== "idle") return null;
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center gap-6">
      <div className="relative w-[100px] h-[100px]">
        <div
          className="absolute w-[30px] h-[30px] bg-blue-600 dark:bg-blue-500 shadow-sm"
          style={{
            boxSizing: "border-box",
            top: "50%",
            left: "50%",
            animation: "idle-float-1 3s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[30px] h-[30px] bg-orange-500 dark:bg-orange-400 shadow-sm"
          style={{
            boxSizing: "border-box",
            top: "calc(50% - 30px)",
            left: "calc(50% - 30px)",
            animation: "idle-float-2 3s ease-in-out infinite",
          }}
        />
        <style>{`
          @keyframes idle-float-1 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          @keyframes idle-float-2 {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(8px); }
          }
        `}</style>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Waiting ...</p>
    </div>
  );
};

const ErrorView = () => {
  const fetchStatus = useAppSelector(selectFetchStatus);
  if (fetchStatus !== "failed") return null;
  return (
    <div className="flex flex-col flex-1 h-full items-center justify-center gap-6">
      <div className="relative w-[100px] h-[100px]">
        <div
          className="absolute w-[30px] h-[30px] bg-blue-600 dark:bg-blue-500 shadow-sm"
          style={{
            boxSizing: "border-box",
            top: "55%",
            left: "40%",
            transform: "rotate(15deg)",
            animation: "error-flicker 4s infinite",
          }}
        />
        <div
          className="absolute w-[30px] h-[30px] bg-orange-500 dark:bg-orange-400 shadow-sm"
          style={{
            boxSizing: "border-box",
            top: "40%",
            left: "25%",
            transform: "rotate(-25deg)",
            animation: "error-flicker 4s infinite 0.5s",
          }}
        />
        <style>{`
          @keyframes error-flicker {
            0%, 92% { opacity: 1; }
            93% { opacity: 0.2; }
            94% { opacity: 1; }
            96% { opacity: 0.1; }
            98% { opacity: 1; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-destructive">Failed to load shared project</p>
        <p className="text-xs text-muted-foreground mt-1">
          The project may not exist or your access has expired.
        </p>
      </div>
    </div>
  );
};

const MainView = () => {
  const fetchStatus = useAppSelector(selectFetchStatus);
  if (fetchStatus !== "succeeded") return null;
  return (
    <>
      <SharedHeader />
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        <Sidebar />
        <Board />
        <PanelIssues />
      </ResizablePanelGroup>
    </>
  );
};

const SharedEditor = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) return;
    dispatch(getSharedProject(id));
    dispatch(ActionCreators.clearHistory());
  }, [id]);

  return (
    <div className="flex flex-col h-screen">
      <IdleView />
      <LoadingView />
      <ErrorView />
      <MainView />
    </div>
  );
};

export default SharedEditor;
