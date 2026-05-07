import { cn } from "@/lib/utils";
import { KeyRoundIcon, SettingsIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { useCallback, useRef, useState } from "react";
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
} from "@/features/project/schemas/field-schema";
import { toast } from "sonner";
import { fieldPartial } from "@/features/project/slices/project.slice";
import { selectTableFields } from "@/features/project/selectors/project.selector";

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
  onBlur,
}: {
  value: string;
  onBlur: (v: string, reset: () => void) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const reset = useCallback(() => {
    if (ref.current) ref.current.value = value;
  }, [value]);
  return (
    <Input
      ref={ref}
      className="flex-1 min-w-0 h-7 text-xs rounded-sm px-1.5 py-0"
      defaultValue={value}
      onBlur={(e) => onBlur(e.target.value, reset)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onBlur((e.target as HTMLInputElement).value, reset);
          ref.current?.blur();
        }
      }}
    />
  );
};

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
  const fields = useAppSelector(selectTableFields(tableName));
  const [showDetail, setShowDetail] = useState(false);

  const handleUpdateName = useCallback(
    (name: string, reset: () => void) => {
      if (name === field.name) {
        reset();
        return;
      }

      const result = FieldPartSchema.safeParse({ name });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        reset();
        return;
      }

      if (fields.some((f) => f.name === result.data.name)) {
        toast.error("Field name must be unique");
        reset();
        return;
      }

      dispatch(
        fieldPartial({ tableName, fieldName: field.name, data: result.data }),
      );
    },
    [dispatch, tableName, field.name, fields],
  );

  const handleChangeType = useCallback(
    (type: string) => {
      const result = FieldPartSchema.safeParse({ type });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      dispatch(
        fieldPartial({ tableName, fieldName: field.name, data: result.data }),
      );
    },
    [dispatch, tableName, field.name],
  );

  const handleTogglePk = useCallback(() => {
    const result = FieldPartSchema.safeParse({ pk: !field.pk });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    dispatch(
      fieldPartial({ tableName, fieldName: field.name, data: result.data }),
    );
  }, [dispatch, tableName, field.name, field.pk]);

  return (
    <>
      <div className="group flex items-center gap-1 px-2 py-1 transition-colors">
        <PkToggle pk={field.pk} onToggle={handleTogglePk} />
        <FieldNameInput value={field.name} onBlur={handleUpdateName} />
        <TypeSelect value={field.type} onChange={handleChangeType} />
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
