import Sidebar from "./sidebar";
import Board from "./board";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Header from "./header";

export const Editors = () => {
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
