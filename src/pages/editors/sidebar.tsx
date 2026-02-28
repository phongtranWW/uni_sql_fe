import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SidebarTabTable from "./sidebar-tab-table";
import SidebarTabRef from "./sidebar-tab-ref";
import { Link, Table } from "lucide-react";
import { Label } from "@/components/ui/label";

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col px-2">
      <Tabs defaultValue="tables">
        <TabsList variant="line">
          <TabsTrigger value="tables">
            <Table />
            <Label>Tables</Label>
          </TabsTrigger>
          <TabsTrigger value="references">
            <Link />
            <Label>References</Label>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tables">
          <SidebarTabTable />
        </TabsContent>
        <TabsContent value="references">
          <SidebarTabRef />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
