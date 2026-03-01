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
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Field } from "@/features/database/schemas/field";
import { cn } from "@/lib/utils";
import {
  BanIcon,
  FingerprintIcon,
  KeyRoundIcon,
  MoreHorizontalIcon,
} from "lucide-react";

interface SidebarFieldProps {
  field: Field;
}

const SidebarField = ({ field }: SidebarFieldProps) => {
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

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          >
            <MoreHorizontalIcon className="size-3.5" />
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
                    placeholder="Type"
                    value={field.type}
                  />
                </FieldShadcn>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "pk", label: "Primary Key", checked: field.pk },
                  {
                    id: "increment",
                    label: "Auto Increment",
                    checked: field.increment,
                  },
                  { id: "unique", label: "Unique", checked: field.unique },
                  {
                    id: "not_null",
                    label: "Not Null",
                    checked: field.not_null,
                  },
                ].map(({ id, label, checked }) => (
                  <FieldShadcn key={id} orientation="horizontal">
                    <Checkbox id={id} checked={checked} />
                    <FieldLabel htmlFor={id} className="font-normal">
                      {label}
                    </FieldLabel>
                  </FieldShadcn>
                ))}
              </div>
            </FieldGroup>
          </FieldSet>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SidebarField;
