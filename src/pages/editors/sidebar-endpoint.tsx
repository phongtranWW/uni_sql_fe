import type { Endpoint } from "@/features/database/schemas/endpoint";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/app/hook";
import type { RootState } from "@/app/store";
import { Label } from "@/components/ui/label";

interface SidebarEndpointProps {
  label: string;
  endpoint: Endpoint;
}

const SidebarEndpoint = ({ label, endpoint }: SidebarEndpointProps) => {
  const table = useAppSelector((state: RootState) =>
    state.database.tables.find((t) => t.id === endpoint.tableId),
  );
  const field = table?.fields.find((f) => f.id === endpoint.fieldId);

  return (
    <div className="flex items-center gap-2 py-2">
      <Label>{label}</Label>
      <Input
        value={table?.name}
        className="h-7 text-base rounded-xs px-1 py-2"
      />
      (
      <Input
        value={field?.name}
        className="h-7 text-base rounded-xs px-1 py-2"
      />
      )
    </div>
  );
};

export default SidebarEndpoint;
