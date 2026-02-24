import { useAppSelector } from "@/app/hook";
import type { RootState } from "@/app/store";
import SidebarTable from "./sidebar-table";

const SidebarTabTable = () => {
  const tables = useAppSelector((state: RootState) => state.database.tables);

  return (
    <div className="flex flex-col gap-1">
      {tables.map((table) => (
        <SidebarTable key={table.name} table={table} />
      ))}
    </div>
  );
};

export default SidebarTabTable;
