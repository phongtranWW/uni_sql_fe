import Sidebar from "./sidebar";
import Board from "./board";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Header from "./header";
import useShortcuts from "@/hooks/use-shortcuts";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { useCallback, useEffect } from "react";
import { useBlocker, useParams, Navigate } from "react-router";
import { getProject } from "@/features/project/thunks";
import {
  selectSaveStatus,
  selectFetchStatus,
  selectProject,
} from "@/features/project/selectors/project.selector";
import EditorLoading from "./editor-loading";
import EditorError from "./editor-error";
import EditorUnsavedAlert from "./editor-unsaved-alert";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const saveStatus = useAppSelector(selectSaveStatus);
  const fetchStatus = useAppSelector(selectFetchStatus);
  const project = useAppSelector(selectProject);
  const isDirty = saveStatus !== "saved";

  useShortcuts();

  const blocker = useBlocker(useCallback(() => isDirty, [isDirty]));

  useEffect(() => {
    if (id) dispatch(getProject(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  if (fetchStatus === "idle" || fetchStatus === "loading") {
    return <EditorLoading />;
  }

  if (fetchStatus === "failed") {
    return <EditorError />;
  }

  if (fetchStatus === "succeeded" && !project) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <ResizablePanelGroup orientation="horizontal" className="flex-1">
          <ResizablePanel defaultSize="25%" minSize="20%" maxSize="50%">
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="75%">
            <Board />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <EditorUnsavedAlert
        open={blocker.state === "blocked"}
        onStay={() => blocker.reset?.()}
        onProceed={() => blocker.proceed?.()}
      />
    </>
  );
};

export default Editor;
