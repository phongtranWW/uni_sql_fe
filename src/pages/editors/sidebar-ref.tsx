import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Ref } from "@/features/database/schemas/ref";
import { ChevronRightIcon } from "lucide-react";
import SidebarEndpoint from "./sidebar-endpoint";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SidebarRefProps {
  reference: Ref;
}

const SidebarRef = ({ reference }: SidebarRefProps) => {
  return (
    <Collapsible key={reference.id}>
      <CollapsibleTrigger asChild className="rounded-xs">
        <Button
          variant="ghost"
          size="sm"
          className="text-base group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none"
        >
          <ChevronRightIcon className="transition-transform group-data-[state=open]:rotate-90" />
          {reference.name}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="ml-6">
        <div className="flex flex-col divide-y divide-border p-2">
          <SidebarEndpoint label="Primary:" endpoint={reference.endpoints[0]} />
          <SidebarEndpoint label="Foreign:" endpoint={reference.endpoints[1]} />
          <div className="flex items-center gap-2 py-2">
            <Label>Cardinality:</Label>
            <Select>
              <SelectTrigger className="h-7! flex-1 text-base rounded-xs px-1 py-2">
                <SelectValue placeholder="Cardinality" className="text-base" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="light" className="text-base">
                    One to one
                  </SelectItem>
                  <SelectItem value="dark" className="text-base">
                    One to many
                  </SelectItem>
                  <SelectItem value="system" className="text-base">
                    Many to one
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarRef;
