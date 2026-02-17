import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Field as FieldShadcn,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Field } from "@/features/database/schemas/field";
import { MoreHorizontalIcon } from "lucide-react";

interface SidebarFieldProps {
  field: Field;
}

const SidebarField = ({ field }: SidebarFieldProps) => {
  return (
    <div className="flex items-center gap-2 py-2">
      <Input
        value={field.name}
        className="h-7 text-base rounded-xs px-1 py-2"
      />
      <Input
        value={field.type}
        className="h-7 text-base rounded-xs px-1 py-2"
      />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className="h-7 w-7 rounded-xs">
            <MoreHorizontalIcon />
          </Button>
        </DialogTrigger>

        <DialogContent>
          <FieldSet>
            <FieldLegend>Field Details</FieldLegend>
            <FieldDescription>
              All changes will be applied immediately.
            </FieldDescription>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <FieldShadcn>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    autoComplete="off"
                    placeholder="Name"
                    value={field.name}
                  />
                </FieldShadcn>
                <FieldShadcn>
                  <FieldLabel htmlFor="type">Type</FieldLabel>
                  <Input
                    id="type"
                    autoComplete="off"
                    placeholder="Name"
                    value={field.type}
                  />
                </FieldShadcn>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FieldShadcn orientation="horizontal">
                  <Checkbox id="pk" checked={field.pk} />
                  <FieldLabel htmlFor="pk" className="font-normal">
                    Primary Key
                  </FieldLabel>
                </FieldShadcn>
                <FieldShadcn orientation="horizontal">
                  <Checkbox id="increment" checked={field.increment} />
                  <FieldLabel htmlFor="increment" className="font-normal">
                    Auto Increment
                  </FieldLabel>
                </FieldShadcn>
                <FieldShadcn orientation="horizontal">
                  <Checkbox id="unique" checked={field.unique} />
                  <FieldLabel htmlFor="unique" className="font-normal">
                    Unique
                  </FieldLabel>
                </FieldShadcn>
                <FieldShadcn orientation="horizontal">
                  <Checkbox id="not_null" checked={field.not_null} />
                  <FieldLabel htmlFor="not_null" className="font-normal">
                    Not Null
                  </FieldLabel>
                </FieldShadcn>
              </div>
            </FieldGroup>
          </FieldSet>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SidebarField;
