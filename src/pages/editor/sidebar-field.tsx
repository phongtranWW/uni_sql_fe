import { cn } from "@/lib/utils";
import { KeyRoundIcon, SettingsIcon } from "lucide-react";
import { useAppDispatch } from "@/app/hook";
import { useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FIELD_TYPES } from "@/constants/field-types";
import SidebarFieldDetail from "./sidebar-field-detail";
import {
  FieldPartSchema,
  type Field,
  type FieldPart,
} from "@/features/project/schemas/field-schema";
import { toast } from "sonner";
import { fieldPartial } from "@/features/project/slices/project.slice";

const PkToggle = ({ pk, onToggle }: { pk: boolean; onToggle: () => void }) => (
  <Button variant="outline" size="icon" onClick={onToggle} className="size-7">
    <KeyRoundIcon
      className={cn(
        pk
          ? "text-amber-500"
          : "text-muted-foreground/40 hover:text-muted-foreground",
      )}
    />
  </Button>
);

const FieldNameInput = ({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (v: string) => void;
  onBlur: (v: string) => void;
}) => (
  <Input
    className="flex-1 min-w-0 h-7 text-xs rounded-sm px-1.5 py-0"
    defaultValue={value}
    onChange={(e) => onChange(e.target.value)}
    onBlur={(e) => onBlur(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        onBlur((e.target as HTMLInputElement).value);
      }
    }}
  />
);

const TypeSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger
      size="sm"
      className="flex-1 min-w-0 h-7! text-xs rounded-sm px-1.5 py-0"
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent position="popper" align="end">
      {FIELD_TYPES.map((type) => (
        <SelectItem key={type} value={type} className="text-xs">
          {type}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const FieldSettingsButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    size="icon"
    className="shrink-0 size-7"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    <SettingsIcon />
  </Button>
);

interface SidebarFieldProps {
  tableName: string;
  field: Field;
}

const SidebarField = ({ tableName, field }: SidebarFieldProps) => {
  const dispatch = useAppDispatch();
  const [showDetail, setShowDetail] = useState(false);

  const update = useCallback(
    (data: FieldPart) => {
      const result = FieldPartSchema.safeParse(data);
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      dispatch(
        fieldPartial({
          tableName,
          fieldName: field.name,
          data,
        }),
      );
    },
    [dispatch, tableName, field.name],
  );

  return (
    <>
      <div className="group flex items-center gap-1 px-2 py-1 transition-colors">
        <PkToggle pk={field.pk} onToggle={() => update({ pk: !field.pk })} />
        <FieldNameInput
          value={field.name}
          onChange={() => {}}
          onBlur={(name) => {
            const trimmed = name.trim();
            if (trimmed && trimmed !== field.name) {
              update({ name: trimmed });
            }
          }}
        />
        <TypeSelect value={field.type} onChange={(type) => update({ type })} />
        <FieldSettingsButton onClick={() => setShowDetail(true)} />
      </div>
      <SidebarFieldDetail
        tableName={tableName}
        field={field}
        open={showDetail}
        onOpenChange={setShowDetail}
      />
    </>
  );
};

export default SidebarField;
