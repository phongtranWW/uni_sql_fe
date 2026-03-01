import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SidebarTabTable from "./sidebar-tab-table";
import SidebarTabRef from "./sidebar-tab-ref";
import { Link, Table } from "lucide-react";
import { Label } from "@/components/ui/label";

const Sidebar = () => {
  return (
    <div className="h-full flex flex-col px-2">
      <Tabs defaultValue="tables" className="flex-1 flex flex-col min-h-0">
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
        <TabsContent value="tables" className="flex-1 min-h-0">
          <SidebarTabTable />
        </TabsContent>
        <TabsContent value="references" className="flex-1 min-h-0">
          <SidebarTabRef />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
