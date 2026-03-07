import { useAppDispatch, useAppSelector } from "@/app/hook";
import ColorPicker from "@/components/custom/color-picker";
import { Button } from "@/components/ui/button";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Table, TableHeaderColor } from "@/features/project/schemas/table";
import { selectDatabaseTables } from "@/features/project/selectors";
import { removeTable, updateTable } from "@/features/project/slices/database";
import { isTableNameUnique, isTableNameValid } from "@/utils/rules/tables";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SidebarTableDetailProps {
  table: Table;
}

const SidebarTableDetail = ({ table }: SidebarTableDetailProps) => {
  const tables = useAppSelector(selectDatabaseTables);
  const dispatch = useAppDispatch();

  const [name, setName] = useState<string>(table.name);
  const [alias, setAlias] = useState<string>(table.alias || "");
  const [headerColor, setHeaderColor] = useState<TableHeaderColor>(
    table.headerColor,
  );

  const handleSave = () => {
    try {
      if (name !== table.name) {
        isTableNameValid(name);
        isTableNameUnique(tables, name);
      }

      dispatch(
        updateTable({
          name: table.name,
          tableUpdate: {
            name,
            headerColor,
            alias: alias || undefined,
          },
        }),
      );

      toast.success("Table updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const handleDelete = () => {
    dispatch(removeTable(table.name));
    toast.success("Table deleted successfully");
  };

  return (
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
        <DialogHeader>
          <DialogTitle>Table Info</DialogTitle>
          <DialogDescription>
            You can update the name, head color and alias of the table.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              autoComplete="off"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="name">Alias</FieldLabel>
              <Input
                id="name"
                autoComplete="off"
                placeholder="Name"
                value={alias || ""}
                onChange={(e) => setAlias(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="type">Head Color</FieldLabel>
              <ColorPicker value={headerColor} onChange={setHeaderColor} />
            </Field>
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

export default SidebarTableDetail;
