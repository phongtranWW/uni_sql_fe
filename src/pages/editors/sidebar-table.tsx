import { ChevronRightIcon, MoreHorizontal } from "lucide-react";
import type { Table } from "@/features/database/schemas/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import SidebarField from "./sidebar-field";
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

interface SidebarTableProps {
  table: Table;
}

const SidebarTable = ({ table }: SidebarTableProps) => {
  return (
    <Collapsible key={table.id}>
      <div className="group flex items-center justify-between rounded-none hover:bg-accent px-2">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 justify-start text-base transition-none"
          >
            <ChevronRightIcon className="mr-2 transition-transform group-data-[state=open]:rotate-90" />
            {table.name}
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
              <FieldLegend>Table Details</FieldLegend>
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
                    value={table.name}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="name">Alias</FieldLabel>
                    <Input
                      id="name"
                      autoComplete="off"
                      placeholder="Name"
                      value={table.alias || ""}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="type">Head Color</FieldLabel>
                    <label
                      htmlFor="headColor"
                      className="flex items-center gap-2 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 cursor-pointer hover:bg-accent transition-colors"
                    >
                      <input
                        id="headColor"
                        type="color"
                        className="w-5 h-5 rounded-sm cursor-pointer border-0 bg-transparent p-0 appearance-none"
                        value={table.headerColor || "#000000"}
                      />
                      <span className="text-sm text-muted-foreground">
                        {table.headerColor || "#000000"}
                      </span>
                    </label>
                  </Field>
                </div>
              </FieldGroup>
            </FieldSet>
          </DialogContent>
        </Dialog>
      </div>

      <CollapsibleContent className="ml-6">
        <div className="flex flex-col divide-y divide-border p-2">
          {table.fields.map((field) => (
            <SidebarField key={field.id} field={field} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarTable;
