import { useAppDispatch, useAppSelector } from "@/app/hook";
import SidebarTable from "./sidebar-table";
import { Button } from "@/components/ui/button";
import { Plus, SearchIcon } from "lucide-react";
import type { TableCreate } from "@/features/project/schemas/table";
import {
  generateTableHeaderColor,
  generateTableName,
} from "@/utils/generators/tables";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { selectDatabaseTables } from "@/features/project/selectors";
import { createTable } from "@/features/project/thunks";

const SidebarTabTable = () => {
  const tables = useAppSelector(selectDatabaseTables);
  const [key, setKey] = useState("");
  const dispatch = useAppDispatch();

  const handleCreateTable = () => {
    const tableCreate: TableCreate = {
      name: generateTableName(),
      headerColor: generateTableHeaderColor(),
      alias: null,
    };
    dispatch(createTable(tableCreate));
  };

  const filteredTables = tables.filter((t) =>
    t.name?.toLowerCase().includes(key.trim().toLowerCase()),
  );

  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <InputGroup className="rounded-xs">
          <InputGroupInput
            id="search"
            type="search"
            placeholder="Search table..."
            onChange={(e) => setKey(e.target.value)}
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
        <Button className="rounded-xs" onClick={handleCreateTable}>
          <Plus /> New
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-1">
          {filteredTables.map((table) => (
            <SidebarTable key={table.name} table={table} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SidebarTabTable;
