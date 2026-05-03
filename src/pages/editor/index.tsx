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
import { useParams, useLocation } from "react-router";
import { getProject } from "@/features/project/thunks";
import {
  selectFetchStatus,
  selectProjectIsDirty,
} from "@/features/project/selectors/project.selector";
import { projectImported } from "@/features/project/slices/project.slice";
import { ActionCreators } from "redux-undo";
import LoadingScreen from "@/components/custom/loading-screen";
import IdleScreen from "@/components/custom/idle-screen";
import ErrorScreen from "@/components/custom/error-screen";
import PanelIssues from "./panel-issues";
import useUnsavedChangesGuard from "../../hooks/use-unsaved-changes-guard";
import { selectProfile } from "@/features/auth/selectors";
import { ProjectSchema } from "@/features/project/schemas/project.schema";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const fetchStatus = useAppSelector(selectFetchStatus);
  const isDirty = useAppSelector(selectProjectIsDirty);
  const profile = useAppSelector(selectProfile);
  const isLoggedIn = !!profile;

  const showIssues = useAppSelector(
    (state) => state.editorSettings.show.issuePanel,
  );
  const showSidebar = useAppSelector(
    (state) => state.editorSettings.show.sidebar,
  );
  useShortcuts();
  useUnsavedChangesGuard(isDirty);

  useEffect(() => {
    if (!id) return;

    if (isLoggedIn) {
      // Authenticated: fetch project from backend as usual
      const fetchData = async () => {
        await dispatch(getProject(id));
        dispatch(ActionCreators.clearHistory());
      };
      fetchData();
    } else {
      // Guest: load project data from react-router location state (passed from template dialog),
      // or initialize an empty project if no state was provided
      const routerProject = (location.state as { project?: unknown } | null)
        ?.project;

      const parsed = ProjectSchema.safeParse(
        routerProject ?? { name: "New Project", tables: [], refs: [], indexes: [] },
      );

      const projectData = parsed.success
        ? parsed.data
        : { name: "New Project", tables: [], refs: [], indexes: [] };

      dispatch(projectImported(projectData));
      dispatch(ActionCreators.clearHistory());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isLoggedIn]);

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
