import { useAppDispatch, useAppSelector } from "@/app/hook";
import SidebarTable from "./sidebar-table";
import { Button } from "@/components/ui/button";
import { Plus, SearchIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { selectTables } from "@/features/project/selectors/project.selector";
import { tableCreated } from "@/features/project/slices/project.slice";
import { TableCreateSchema } from "@/features/project/schemas/table-schema";
import { toast } from "sonner";

const SidebarTabTable = () => {
  const tables = useAppSelector(selectTables);
  const [keyword, setKeyword] = useState("");
  const dispatch = useAppDispatch();

  const handleCreateTable = useCallback(() => {
    const result = TableCreateSchema.safeParse({});
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    dispatch(tableCreated(result.data));
  }, [dispatch]);

  const filteredTables = tables.filter((t) =>
    t.name?.toLowerCase().includes(keyword.trim().toLowerCase()),
  );
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <InputGroup className="rounded-xs">
          <InputGroupInput
            id="search"
            type="search"
            placeholder="Search table..."
            onChange={(e) => setKeyword(e.target.value)}
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
