import { useAppSelector } from "@/app/hook";
import type { RootState } from "@/app/store";
import SidebarRef from "./sidebar-ref";

const SidebarTabRef = () => {
  const refs = useAppSelector((state: RootState) => state.database.refs);
  return (
    <div className="flex flex-col gap-1">
      {refs.map((table) => (
        <SidebarRef key={table.id} reference={table} />
      ))}
    </div>
  );
};

export default SidebarTabRef;
