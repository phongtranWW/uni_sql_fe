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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field as FieldShadcn,
  FieldLabel,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Field } from "@/features/project/schemas/field-schema";
import {
  fieldRemoved,
  fieldUpdated,
} from "@/features/project/slices/project.slice";
import {
  ArrowUp,
  Ban,
  Fingerprint,
  KeyRound,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";

interface SidebarFieldDetailProps {
  tableName: string;
  field: Field;
}

const SidebarFieldDetail = ({ field, tableName }: SidebarFieldDetailProps) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState(field.name);
  const [type, setType] = useState(field.type);
  const [pk, setPk] = useState(field.pk);
  const [unique, setUnique] = useState(field.unique);
  const [notNull, setNotNull] = useState(field.not_null);
  const [increment, setIncrement] = useState(field.increment);

  const handleSave = () => {
    dispatch(
      fieldUpdated({
        tableName,
        fieldName: field.name,
        fieldUpdate: { name, type, pk, unique, not_null: notNull, increment },
      }),
    );
  };

  const handleDelete = () => {
    dispatch(fieldRemoved({ tableName, fieldName: field.name }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="size-3.5" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Field Info</DialogTitle>
          <DialogDescription>
            You can update the name, type and constraints of the field.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <FieldShadcn>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                autoComplete="off"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FieldShadcn>
            <FieldShadcn>
              <FieldLabel htmlFor="type">Type</FieldLabel>
              <Input
                id="type"
                autoComplete="off"
                placeholder="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </FieldShadcn>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                id: "pk",
                label: "Primary Key",
                checked: pk,
                onChange: setPk,
                icon: <KeyRound className="size-3.5 text-amber-500" />,
              },
              {
                id: "increment",
                label: "Auto Increment",
                checked: increment,
                onChange: setIncrement,
                icon: <ArrowUp className="size-3.5 text-blue-500" />,
              },
              {
                id: "unique",
                label: "Unique",
                checked: unique,
                onChange: setUnique,
                icon: <Fingerprint className="size-3.5 text-green-500" />,
              },
              {
                id: "not_null",
                label: "Not Null",
                checked: notNull,
                onChange: setNotNull,
                icon: <Ban className="size-3.5 text-red-500" />,
              },
            ].map(({ id, label, checked, onChange, icon }) => (
              <FieldShadcn key={id} orientation="horizontal">
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={(val) => onChange(Boolean(val))}
                />
                {icon}
                <FieldLabel htmlFor={id} className="font-normal">
                  {label}
                </FieldLabel>
              </FieldShadcn>
            ))}
          </div>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SidebarFieldDetail;
