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
import { selectFetchStatus } from "@/features/project/selectors/project.selector";
import { ActionCreators } from "redux-undo";
import LoadingScreen from "@/components/custom/loading-screen";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const fetchStatus = useAppSelector(selectFetchStatus);
  useShortcuts();

  useEffect(() => {
    if (id) {
      dispatch(getProject(id)).then(() => {
        dispatch(ActionCreators.clearHistory());
      });
    }
  }, [id, dispatch]);

  if (fetchStatus === "idle" || fetchStatus === "loading") {
    return <LoadingScreen content="Loading project..." />;
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

      {/* <EditorUnsavedAlert
        open={blocker.state === "blocked"}
        onStay={() => blocker.reset?.()}
        onProceed={() => blocker.proceed?.()}
      /> */}
    </>
  );
};

export default Editor;
