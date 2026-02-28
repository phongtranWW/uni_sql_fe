import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import type { Ref } from "@/features/database/schemas/ref";
import { ChevronRightIcon } from "lucide-react";
import SidebarRefDetail from "./sidebar-ref-detail";

interface SidebarRefProps {
  reference: Ref;
}

const SidebarRef = ({ reference }: SidebarRefProps) => {
  return (
    <Collapsible key={reference.name}>
      <div className="group flex items-center justify-between rounded-none hover:bg-accent px-2">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start text-base transition-none"
          >
            <ChevronRightIcon className="mr-2 transition-transform group-data-[state=open]:rotate-90" />
            {reference.name}
          </Button>
        </CollapsibleTrigger>
        <SidebarRefDetail reference={reference} />
      </div>
    </Collapsible>
  );
};

export default SidebarRef;
