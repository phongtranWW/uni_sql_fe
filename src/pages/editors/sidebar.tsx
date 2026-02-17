import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SidebarTabTable from "./sidebar-tab-table";

const Sidebar = () => {
  return (
    <ShadcnSidebar className="min-w-100">
      <Tabs defaultValue="tables">
        <SidebarHeader>
          <TabsList variant="line">
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
          </TabsList>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarContent>
            <TabsContent value="tables">
              <SidebarTabTable />
            </TabsContent>
            <TabsContent value="references">
              Change your password here.
            </TabsContent>
          </SidebarContent>
        </SidebarGroup>
      </Tabs>
    </ShadcnSidebar>
  );
};

export default Sidebar;
