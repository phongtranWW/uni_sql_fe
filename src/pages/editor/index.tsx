import Sidebar from "./sidebar";
import Board from "./board";
import { ResizablePanelGroup } from "@/components/ui/resizable";
import Header from "./header";
import useShortcuts from "@/hooks/use-shortcuts";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { getProject } from "@/features/project/thunks";
import {
  selectFetchStatus,
} from "@/features/project/selectors/project.selector";
import { projectSet } from "@/features/project/slices/project.slice";
import { ActionCreators } from "redux-undo";
import PanelIssues from "./panel-issues";
import useUnsavedChangesGuard from "../../hooks/use-unsaved-changes-guard";
import { ProjectSchema } from "@/features/project/schemas/project.schema";
import LoadingView from "@/components/custom/loading-view";
import ErrorView from "@/components/custom/error-view";
import IdleView from "@/components/custom/idle-view";

const MainView = () => {
  const fetchStatus = useAppSelector(selectFetchStatus);
  if (fetchStatus !== "succeeded") return null;
  return (
    <>
      <Header />
      <ResizablePanelGroup orientation="horizontal" className="flex-1">
        <Sidebar />
        <Board />
        <PanelIssues />
      </ResizablePanelGroup>
    </>
  );
};

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const fetchStatus = useAppSelector(selectFetchStatus);

  useShortcuts();
  useUnsavedChangesGuard();

  useEffect(() => {
    if (!id) return;
    const routerProject = (location.state as { project?: unknown } | null)?.project;
    if (routerProject) {
      const parsed = ProjectSchema.safeParse(routerProject);
      if (!parsed.success) return;
      dispatch(projectSet(parsed.data));
    } else {
      dispatch(getProject(id))
        .unwrap()
        .catch(() => {
          dispatch(
            projectSet({
              id,
              name: "New Project",
              tables: [],
              refs: [],
              indexes: [],
            }),
          );
        });
    }

    dispatch(ActionCreators.clearHistory());
  }, [id]);

  return (
    <div className="flex flex-col h-screen">
      {fetchStatus === "idle" && <IdleView />}
      {fetchStatus === "loading" && <LoadingView />}
      {fetchStatus === "failed" && <ErrorView />}
      {fetchStatus === "succeeded" && <MainView />}
    </div>
  );
};

export default Editor;