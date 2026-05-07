import { ChevronRightIcon, Plus, MoreHorizontal } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import SidebarField from "./sidebar-field";
import SidebarTableDetail from "./sidebar-table-detail";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Table } from "@/features/project/schemas/table-schema";
import {
  fieldCreated,
  tablesSelected,
  indexCreated,
} from "@/features/project/slices/project.slice";
import { FieldCreateSchema } from "@/features/project/schemas/field-schema";
import { IndexCreateSchema } from "@/features/project/schemas/index.schema";
import { selectIndexes } from "@/features/project/selectors/project.selector";
import SidebarIndex from "./sidebar-index";

interface SidebarTableProps {
  table: Table;
}

const SidebarTable = ({ table }: SidebarTableProps) => {
  const dispatch = useAppDispatch();
  const [showDetail, setShowDetail] = useState(false);

  const handleAddField = useCallback(() => {
    const result = FieldCreateSchema.safeParse({});
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    dispatch(
      fieldCreated({
        tableName: table.name,
        data: result.data,
      }),
    );
  }, [dispatch, table.name]);

  const handleAddIndex = useCallback(() => {
    if (table.fields.length === 0) {
      toast.error("Cannot create an index without any fields in the table");
      return;
    }
    const result = IndexCreateSchema.safeParse({
      tableName: table.name,
      fields: [table.fields[0].name],
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    dispatch(indexCreated(result.data));
  }, [dispatch, table.name, table.fields]);

  const indexes = useAppSelector(selectIndexes).filter(
    (idx) => idx.tableName === table.name,
  );

  return (
    <>
      <Collapsible
        key={table.name}
        className="group border-l-4 transition-colors"
        style={{ borderLeftColor: table.headerColor }}
        open={table.isSelected}
        onOpenChange={(open) => {
          dispatch(tablesSelected({ name: [table.name], value: open }));
        }}
      >
        <div className="flex items-center justify-between hover:bg-accent px-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 justify-start font-medium"
            >
              <ChevronRightIcon className="mr-2 transition-transform group-data-[state=open]:rotate-90" />
              {table.name}
            </Button>
          </CollapsibleTrigger>

          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowDetail(true);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity size-7 shrink-0"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </div>

        <CollapsibleContent className="ml-4 flex flex-col gap-2">
          <div className="flex flex-col py-0.5 divide-y border-b mb-1">
            {table.fields.map((field) => (
              <SidebarField
                key={field.name}
                tableName={table.name}
                field={field}
              />
            ))}
          </div>

          {indexes.length > 0 && (
            <div className="flex flex-col border-b mb-1">
              {indexes.map((idx) => (
                <SidebarIndex key={idx.name} table={table} index={idx} />
              ))}
            </div>
          )}

          <div className="flex gap-2 px-2 pb-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={handleAddField}
            >
              <Plus className="mr-1 size-3" />
              Field
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={handleAddIndex}
            >
              <Plus className="mr-1 size-3" />
              Index
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <SidebarTableDetail
        table={table}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  );
};

export default SidebarTable;
