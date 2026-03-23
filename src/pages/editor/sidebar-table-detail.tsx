import { useAppDispatch, useAppSelector } from "@/app/hook";
import ColorPicker from "@/components/custom/color-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TABLE_HEADER_COLORS } from "@/constants/table-header-colors";
import type {
  Table,
  TableUpdate,
} from "@/features/project/schemas/table-schema";
import { selectTables } from "@/features/project/selectors/project.selector";
import {
  tableDeleted,
  tableUpdated,
} from "@/features/project/slices/project.slice";
import { MoreHorizontal } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

interface SidebarTableDetailProps {
  table: Table;
}

const initialState = (table: Table): TableUpdate => ({
  name: table.name,
  alias: table.alias,
  headerColor: table.headerColor,
});

const SidebarTableDetail = ({ table }: SidebarTableDetailProps) => {
  const dispatch = useAppDispatch();
  const tables = useAppSelector(selectTables);
  const [open, setOpen] = useState(false);
  const [tableUpdate, setTableUpdate] = useState<TableUpdate>(() =>
    initialState(table),
  );

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (next) setTableUpdate(initialState(table));
      setOpen(next);
    },
    [table],
  );

  const handleSave = useCallback(() => {
    const nameChanged = table.name !== tableUpdate.name;
    const nameTaken = tables.some((t) => t.name === tableUpdate.name);

    if (nameChanged && nameTaken) {
      toast.error("Table name already exists.");
      return;
    }

    dispatch(tableUpdated({ name: table.name, tableUpdate }));
    toast.success("Table updated successfully.");
    handleOpenChange(false);
  }, [table.name, tableUpdate, tables, dispatch, handleOpenChange]);

  const handleDelete = useCallback(() => {
    dispatch(tableDeleted(table.name));
    toast.success("Table deleted successfully.");
    handleOpenChange(false);
  }, [table.name, dispatch, handleOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
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
              value={tableUpdate.name ?? ""}
              onChange={(e) =>
                setTableUpdate((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="alias">Alias</FieldLabel>
              <Input
                id="alias"
                autoComplete="off"
                placeholder="Alias"
                value={tableUpdate.alias ?? ""}
                onChange={(e) =>
                  setTableUpdate((prev) => ({ ...prev, alias: e.target.value }))
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="headerColor">Head Color</FieldLabel>
              <ColorPicker
                value={tableUpdate.headerColor ?? TABLE_HEADER_COLORS.AMBER}
                onChange={(color) =>
                  setTableUpdate((prev) => ({ ...prev, headerColor: color }))
                }
              />
            </Field>
          </div>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleSave}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SidebarTableDetail;
