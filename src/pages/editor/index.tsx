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
import { loadDatabase } from "@/features/database/slice";
import { useParams } from "react-router";
import { toast } from "sonner";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.database.present.status);
  const error = useAppSelector((state) => state.database.present.error);

  useShortcuts();

  useEffect(() => {
    if (id) dispatch(loadDatabase(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error]);

  if (status === "loading") return <div>Loading...</div>;
  if (status !== "succeeded") return null;

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
