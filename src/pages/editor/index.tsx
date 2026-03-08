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
import { toast } from "sonner";
import { selectMeta } from "@/features/project/selectors";
import { Spinner } from "@/components/ui/spinner";
import { getProject } from "@/features/project/thunks";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector(selectMeta);
  useShortcuts();
  useEffect(() => {
    if (id) dispatch(getProject(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error]);
  if (status === "loading") return <Spinner />;

  return (
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
  );
};

export default Editor;
