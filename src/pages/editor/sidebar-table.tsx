import { ChevronRightIcon, Plus } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import SidebarField from "./sidebar-field";
import SidebarTableDetail from "./sidebar-table-detail";
import { useAppDispatch } from "@/app/hook";
import { generateFieldName } from "@/utils/generators/field";
import { toast } from "sonner";
import type { Table } from "@/features/project/schemas/table-schema";
import {
  fieldAdded,
  tablesSelected,
} from "@/features/project/slices/project.slice";

interface SidebarTableProps {
  table: Table;
}

const SidebarTable = ({ table }: SidebarTableProps) => {
  const dispatch = useAppDispatch();
  const handleAddField = () => {
    dispatch(
      fieldAdded({
        tableName: table.name,
        fieldCreate: {
          name: generateFieldName(),
          type: "INT",
          pk: false,
          unique: false,
          not_null: false,
          increment: false,
        },
      }),
    );
    toast.success("Field created successfully");
  };

  return (
    <Collapsible
      key={table.name}
      className="group border-l-4 transition-colors"
      style={{ borderLeftColor: table.headerColor }}
      open={table.isSelected}
      onOpenChange={(open) => {
        dispatch(tablesSelected({ name: [table.name], value: open }));
      }}
    >
      <div className="flex items-center justify-between hover:bg-accent px-2 rounded-none">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start font-medium transition-none"
          >
            <ChevronRightIcon className="mr-2 transition-transform group-data-[state=open]:rotate-90" />
            {table.name}
          </Button>
        </CollapsibleTrigger>
        <SidebarTableDetail key={table.name} table={table} />
      </div>

      <CollapsibleContent className="ml-4 flex flex-col gap-2">
        <div className="flex flex-col py-1 divide-y divide-border">
          {table.fields.map((field) => (
            <SidebarField
              key={field.name}
              tableName={table.name}
              field={field}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleAddField}
        >
          <Plus /> Add Field
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarTable;
