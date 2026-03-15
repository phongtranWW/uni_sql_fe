import { useAppDispatch } from "@/app/hook";
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
import type { Table, TableUpdate } from "@/features/project/schemas/table";
import { removeTable } from "@/features/project/slices/database";
import { updateTable } from "@/features/project/thunks";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SidebarTableDetailProps {
  table: Table;
}

const SidebarTableDetail = ({ table }: SidebarTableDetailProps) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [tableUpdate, setTableUpdate] = useState<TableUpdate>({
    name: table.name,
    alias: table.alias,
    headerColor: table.headerColor,
  });

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setTableUpdate({
        name: table.name,
        alias: table.alias,
        headerColor: table.headerColor,
      });
    }
    setOpen(next);
  };

  const handleSave = () => {
    const result = dispatch(updateTable({ name: table.name, tableUpdate }));
    if (!isRejectedWithValue(result)) {
      toast.success("Table updated successfully");
      setOpen(false);
    }
  };

  const handleDelete = () => {
    dispatch(removeTable(table.name));
    setOpen(false);
  };

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
              value={tableUpdate.name || ""}
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
                value={tableUpdate.alias || ""}
                onChange={(e) =>
                  setTableUpdate((prev) => ({ ...prev, alias: e.target.value }))
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="headerColor">Head Color</FieldLabel>
              <ColorPicker
                value={tableUpdate.headerColor || TABLE_HEADER_COLORS.AMBER}
                onChange={(color) =>
                  setTableUpdate((prev) => ({ ...prev, headerColor: color }))
                }
              />
            </Field>
          </div>
        </FieldGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
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
