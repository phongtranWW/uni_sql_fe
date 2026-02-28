import { ChevronRightIcon } from "lucide-react";
import type { Table } from "@/features/database/schemas/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import SidebarField from "./sidebar-field";
import SidebarTableDetail from "./sidebar-table-detail";

interface SidebarTableProps {
  table: Table;
}

const SidebarTable = ({ table }: SidebarTableProps) => {
  return (
    <Collapsible
      key={table.name}
      className="border-l-4"
      style={{
        borderLeftColor: table.headerColor || "#e5e7eb",
      }}
    >
      <div
        className="group flex items-center justify-between rounded-none hover:bg-accent px-2"
        style={{
          borderLeftColor: table.headerColor || "#e5e7eb",
        }}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start text-base transition-none"
          >
            <ChevronRightIcon className="mr-2 transition-transform group-data-[state=open]:rotate-90" />
            {table.name}
          </Button>
        </CollapsibleTrigger>

        <SidebarTableDetail key={table.name} table={table} />
      </div>

      <CollapsibleContent className="ml-6">
        <div className="flex flex-col divide-y divide-border p-2">
          {table.fields.map((field) => (
            <SidebarField key={field.name} field={field} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarTable;
