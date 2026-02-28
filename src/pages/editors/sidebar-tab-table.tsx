import { useAppDispatch, useAppSelector } from "@/app/hook";
import type { RootState } from "@/app/store";
import SidebarTable from "./sidebar-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { TableCreate } from "@/features/database/schemas/table";
import {
  generateTableHeaderColor,
  generateTableName,
} from "@/utils/generators/tables";
import {
  isTableAliasValid,
  isTableNameUnique,
  isTableNameValid,
} from "@/utils/rules/tables";
import { addTable } from "@/features/database/slice";
import { toast } from "sonner";

const SidebarTabTable = () => {
  const tables = useAppSelector((state: RootState) => state.database.tables);
  const dispatch = useAppDispatch();

  const handleCreateTable = () => {
    const tableCreate: TableCreate = {
      name: generateTableName(),
      headerColor: generateTableHeaderColor(),
    };

    try {
      isTableNameValid(tableCreate.name);
      isTableNameUnique(tables, tableCreate.name);
      isTableAliasValid(tableCreate.name);

      dispatch(addTable(tableCreate));

      toast.success("Table created successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input type="search" placeholder="Search" className="rounded-xs" />
        <Button
          variant="default"
          className="rounded-xs"
          onClick={handleCreateTable}
        >
          <Plus /> New
        </Button>
      </div>
      <div className="flex flex-col gap-1">
        {tables.map((table) => (
          <SidebarTable key={table.name} table={table} />
        ))}
      </div>
    </div>
  );
};

export default SidebarTabTable;
