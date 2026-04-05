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
import IdleScreen from "@/components/custom/idle-screen";
import ErrorScreen from "@/components/custom/error-screen";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const fetchStatus = useAppSelector(selectFetchStatus);
  useShortcuts();

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
    </>
  );
};

export default Editor;
