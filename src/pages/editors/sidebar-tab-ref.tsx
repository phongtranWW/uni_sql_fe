import { useAppSelector } from "@/app/hook";
import type { RootState } from "@/app/store";
import SidebarRef from "./sidebar-ref";
import { Input } from "@/components/ui/input";

const SidebarTabRef = () => {
  const refs = useAppSelector((state: RootState) => state.database.refs);
  return (
    <div className="flex flex-col gap-2">
      <Input type="search" placeholder="Search" className="rounded-xs" />
      <div className="flex flex-col divide-y divide-border">
        {refs.map((ref) => (
          <SidebarRef key={ref.name} reference={ref} />
        ))}
      </div>
    </div>
  );
};

export default SidebarTabRef;
