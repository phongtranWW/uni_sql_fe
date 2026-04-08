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
import { useEffect } from "react";
import { useParams } from "react-router";
import { getProject } from "@/features/project/thunks";
import {
  selectFetchStatus,
  selectProjectIsDirty,
} from "@/features/project/selectors/project.selector";
import { ActionCreators } from "redux-undo";
import LoadingScreen from "@/components/custom/loading-screen";
import IdleScreen from "@/components/custom/idle-screen";
import ErrorScreen from "@/components/custom/error-screen";
import PanelIssues from "./panel-issues";
import useUnsavedChangesGuard from "./use-unsaved-changes-guard";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const fetchStatus = useAppSelector(selectFetchStatus);
  const isDirty = useAppSelector(selectProjectIsDirty);
  const showIssues = useAppSelector((state) => state.editorSettings.show.issuePanel);
  const showSidebar = useAppSelector((state) => state.editorSettings.show.sidebar);
  useShortcuts();
  useUnsavedChangesGuard(isDirty);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      await dispatch(getProject(id));
      dispatch(ActionCreators.clearHistory());
    };
    fetchData();
  }, [id, dispatch]);

  if (fetchStatus === "idle") return <IdleScreen />;
  if (fetchStatus === "loading") return <LoadingScreen />;
  if (fetchStatus === "failed") return <ErrorScreen />;

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        {showSidebar && (
          <>
            <ResizablePanel defaultSize="25%" minSize="20%" maxSize="50%">
              <Sidebar />
            </ResizablePanel>
            <ResizableHandle />
          </>
        )}
        <ResizablePanel defaultSize={showIssues ? "55%" : "75%"}>
          <Board />
        </ResizablePanel>
        {showIssues && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%">
              <PanelIssues />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Editor;
