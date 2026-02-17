import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./sidebar";
import Board from "./board";

export const Editors = () => {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Board />
      </SidebarInset>
    </SidebarProvider>
  );
};
