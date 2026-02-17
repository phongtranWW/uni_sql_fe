import Sidebar from "./sidebar";
import Board from "./board";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export const Editors = () => {
  return (
    <div className="h-screen">
      <ResizablePanelGroup orientation="horizontal" className="h-full">
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
