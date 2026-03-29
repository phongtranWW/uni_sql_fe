import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TABLE_HEADER_COLORS } from "@/constants/table-header-colors";
import {
  TablePartSchema,
  type Table,
  type TablePart,
} from "@/features/project/schemas/table-schema";
import { selectTables } from "@/features/project/selectors/project.selector";
import {
  tableDeleted,
  tablePartial,
} from "@/features/project/slices/project.slice";
import { cn } from "@/lib/utils";
import { Palette, Tag, Trash2, Type } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

// ─── Sub-components ───────────────────────────────────────────────────────────

const TableName = ({
  value,
  onBlur,
}: {
  value: string;
  onBlur: (name: string) => void;
}) => {
  const [name, setName] = useState(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Type className="size-4 text-muted-foreground" />
        <Label htmlFor="name">Table Name</Label>
      </div>
      <p className="text-xs text-muted-foreground">
        The primary identifier for this table.
      </p>
      <Input
        id="name"
        value={name}
        autoComplete="off"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      />
    </div>
  );
};

const TableAlias = ({
  value,
  onBlur,
}: {
  value: string;
  onBlur: (alias: string) => void;
}) => {
  const [alias, setAlias] = useState(value);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tag className="size-4 text-muted-foreground" />
        <Label htmlFor="alias">Alias</Label>
      </div>
      <p className="text-xs text-muted-foreground">Optional display name.</p>
      <Input
        id="alias"
        value={alias}
        autoComplete="off"
        placeholder="Alias"
        onChange={(e) => setAlias(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      />
    </div>
  );
};

const TableHeaderColorPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Palette className="size-4 text-muted-foreground" />
      <Label>Header Color</Label>
    </div>
    <p className="text-xs text-muted-foreground">Theme color for the table.</p>
    <div className="flex justify-between w-full gap-2">
      {Object.entries(TABLE_HEADER_COLORS).map(([key, color]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "h-8 flex-1 rounded-md border-2 transition-all hover:scale-105",
            value === color
              ? "border-white ring-2 ring-offset-1 ring-gray-400 scale-105"
              : "border-transparent",
          )}
          style={{ backgroundColor: color }}
          title={key}
        />
      ))}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

interface SidebarTableDetailProps {
  table: Table;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SidebarTableDetail = ({
  table,
  open,
  onOpenChange,
}: SidebarTableDetailProps) => {
  const dispatch = useAppDispatch();
  const tables = useAppSelector(selectTables);
  const handleTablePartial = useCallback(
    (data: TablePart) => {
      const result = TablePartSchema.safeParse(data);
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      dispatch(tablePartial({ tableName: table.name, data }));
    },
    [dispatch, table.name],
  );

  const handleDelete = useCallback(() => {
    dispatch(tableDeleted(table.name));
    onOpenChange(false);
  }, [dispatch, table.name, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Table
            <Badge variant="outline">{table.name}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <TableName
            value={table.name}
            onBlur={(name) => {
              if (name === table.name) return;
              if (tables.find((t) => t.name === name)) {
                toast.error("Table name already exists.");
                return;
              }
              handleTablePartial({ name });
            }}
          />
          <TableAlias
            value={table.alias ?? ""}
            onBlur={(alias) => handleTablePartial({ alias })}
          />
          <TableHeaderColorPicker
            value={table.headerColor ?? TABLE_HEADER_COLORS.AMBER}
            onChange={(color) => handleTablePartial({ headerColor: color })}
          />
        </div>

        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4 mr-2" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SidebarTableDetail;
