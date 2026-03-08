import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Field } from "@/features/project/schemas/field";
import { cn } from "@/lib/utils";
import { BanIcon, FingerprintIcon, KeyRoundIcon } from "lucide-react";
import SidebarFieldDetail from "./sidebar-field-detail";

interface SidebarFieldProps {
  tableName: string;
  field: Field;
}

const SidebarField = ({ tableName, field }: SidebarFieldProps) => {
  return (
    <div className="group flex items-center gap-2 px-2 py-1 hover:bg-accent transition-colors">
      <Tooltip>
        <TooltipTrigger>
          <KeyRoundIcon
            className={cn({ "text-amber-500": field.pk }, "size-3")}
          />
        </TooltipTrigger>
        <TooltipContent>Primary Key</TooltipContent>
      </Tooltip>
      <p className="flex-1 text-sm font-semibold truncate">{field.name}</p>
      <p className="flex-1 text-sm text-muted-foreground truncate">
        {field.type}
      </p>
      <div className="flex items-center gap-1 shrink-0">
        <Tooltip>
          <TooltipTrigger>
            <BanIcon
              className={cn({ "text-red-500": field.not_null }, "size-3")}
            />
          </TooltipTrigger>
          <TooltipContent>Not Null</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>
            <FingerprintIcon
              className={cn({ "text-green-500": field.unique }, "size-3")}
            />
          </TooltipTrigger>
          <TooltipContent>Unique</TooltipContent>
        </Tooltip>
      </div>
      <SidebarFieldDetail tableName={tableName} field={field} />
    </div>
  );
};

export default SidebarField;
