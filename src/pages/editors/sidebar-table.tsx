import { ChevronRightIcon } from "lucide-react";
import type { Table } from "@/features/database/schemas/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import SidebarField from "./sidebar-field";

interface SidebarTableProps {
  table: Table;
}

const SidebarTable = ({ table }: SidebarTableProps) => {
  return (
    <Collapsible key={table.id}>
      <CollapsibleTrigger asChild className="rounded-xs">
        <Button
          variant="ghost"
          size="sm"
          className="text-base group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none"
        >
          <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
          {table.name}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-6">
        <div className="flex flex-col divide-y divide-border p-2">
          {table.fields.map((field) => (
            <SidebarField key={field.id} field={field} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarTable;
