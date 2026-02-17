import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Ref } from "@/features/database/schemas/ref";
import { ChevronRightIcon, MoreHorizontal } from "lucide-react";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface SidebarRefProps {
  reference: Ref;
}

const SidebarRef = ({ reference }: SidebarRefProps) => {
  return (
    <Collapsible key={reference.id}>
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

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal />
            </Button>
          </DialogTrigger>

          <DialogContent>
            <FieldSet>
              <FieldLegend>Reference Details</FieldLegend>
              <FieldDescription>
                All changes will be applied immediately.
              </FieldDescription>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Name"
                    value={reference.name}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
          </DialogContent>
        </Dialog>
      </div>
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
