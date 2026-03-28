import { useAppDispatch } from "@/app/hook";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field as FieldShadcn,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import type { Field } from "@/features/project/schemas/field-schema";
import {
  fieldRemoved,
  fieldUpdated,
} from "@/features/project/slices/project.slice";
import { ArrowUp, Ban, Fingerprint } from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarFieldDetailProps {
  tableName: string;
  field: Field;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SidebarFieldDetail = ({
  field,
  tableName,
  open,
  onOpenChange,
}: SidebarFieldDetailProps) => {
  const dispatch = useAppDispatch();

  const [unique, setUnique] = useState(field.unique);
  const [notNull, setNotNull] = useState(field.not_null);
  const [increment, setIncrement] = useState(field.increment);

  // Sync local state when field props change
  useEffect(() => {
    setUnique(field.unique);
    setNotNull(field.not_null);
    setIncrement(field.increment);
  }, [field.unique, field.not_null, field.increment]);

  const handleSave = () => {
    dispatch(
      fieldUpdated({
        tableName,
        fieldName: field.name,
        fieldUpdate: { unique, not_null: notNull, increment },
      }),
    );
    onOpenChange(false);
  };

  const handleDelete = () => {
    dispatch(fieldRemoved({ tableName, fieldName: field.name }));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Field Settings —{" "}
            <span className="text-primary">{field.name}</span>
          </DialogTitle>
          <DialogDescription>
            Configure constraints for this field.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <div className="grid grid-cols-1 gap-3">
            {[
              {
                id: "increment",
                label: "Auto Increment",
                checked: increment,
                onChange: setIncrement,
                icon: <ArrowUp className="size-3.5 text-blue-500" />,
                description: "Automatically increase value for each new row",
              },
              {
                id: "unique",
                label: "Unique",
                checked: unique,
                onChange: setUnique,
                icon: <Fingerprint className="size-3.5 text-green-500" />,
                description: "Ensure all values in this column are distinct",
              },
              {
                id: "not_null",
                label: "Not Null",
                checked: notNull,
                onChange: setNotNull,
                icon: <Ban className="size-3.5 text-red-500" />,
                description: "Prevent null values in this column",
              },
            ].map(({ id, label, checked, onChange, icon, description }) => (
              <FieldShadcn
                key={id}
                orientation="horizontal"
                className="flex items-center gap-3 p-3 border rounded-md hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={(val) => onChange(Boolean(val))}
                />
                {icon}
                <div className="flex-1">
                  <FieldLabel htmlFor={id} className="font-medium cursor-pointer">
                    {label}
                  </FieldLabel>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </FieldShadcn>
            ))}
          </div>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete Field
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SidebarFieldDetail;
