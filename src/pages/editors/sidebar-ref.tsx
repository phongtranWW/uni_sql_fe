import { REF_OPERATOR, type Ref } from "@/features/database/schemas/ref";
import { ArrowLeft, ArrowRight, SeparatorVertical } from "lucide-react";
import SidebarRefDetail from "./sidebar-ref-detail";

const ICONS = {
  [REF_OPERATOR.ONE_TO_ONE]: SeparatorVertical,
  [REF_OPERATOR.ONE_TO_MANY]: ArrowLeft,
  [REF_OPERATOR.MANY_TO_ONE]: ArrowRight,
};

interface SidebarRefProps {
  reference: Ref;
}

const SidebarRef = ({ reference }: SidebarRefProps) => {
  const Icon = ICONS[reference.operator];

  return (
    <div className="group flex items-center justify-between gap-2 px-2 py-1 hover:bg-accent transition-colors">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium truncate">{reference.name}</span>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="truncate">{reference.endpoints[0].tableName}</span>
          <Icon className="size-3 shrink-0" />
          <span className="truncate">{reference.endpoints[1].tableName}</span>
        </div>
      </div>
      <SidebarRefDetail reference={reference} />
    </div>
  );
};

export default SidebarRef;
