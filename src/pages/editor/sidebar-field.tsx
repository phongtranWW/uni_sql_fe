import type { Field } from "@/features/project/schemas/field-schema";
import { cn } from "@/lib/utils";
import { KeyRoundIcon, SettingsIcon } from "lucide-react";
import { useAppDispatch } from "@/app/hook";
import {
  fieldUpdated,
} from "@/features/project/slices/project.slice";
import { useCallback, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FIELD_TYPES } from "@/constants/field-types";
import SidebarFieldDetail from "./sidebar-field-detail";

interface SidebarFieldProps {
  tableName: string;
  field: Field;
}

const SidebarField = ({ tableName, field }: SidebarFieldProps) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = useCallback(
    (newName: string) => {
      if (newName.trim() && newName !== field.name) {
        dispatch(
          fieldUpdated({
            tableName,
            fieldName: field.name,
            fieldUpdate: { name: newName.trim() },
          }),
        );
      }
    },
    [dispatch, tableName, field.name],
  );

  const handleTypeChange = useCallback(
    (newType: string) => {
      dispatch(
        fieldUpdated({
          tableName,
          fieldName: field.name,
          fieldUpdate: { type: newType },
        }),
      );
    },
    [dispatch, tableName, field.name],
  );

  const handlePkToggle = useCallback(() => {
    dispatch(
      fieldUpdated({
        tableName,
        fieldName: field.name,
        fieldUpdate: { pk: !field.pk },
      }),
    );
  }, [dispatch, tableName, field.name, field.pk]);

  return (
    <>
      <div className="group flex items-center gap-1 px-2 py-1 transition-colors">
        {/* PK toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={handlePkToggle}
              className="shrink-0 h-7 w-7 flex items-center justify-center rounded-sm border border-transparent hover:border-border transition-colors"
            >
              <KeyRoundIcon
                className={cn(
                  "size-3.5 transition-colors",
                  field.pk
                    ? "text-amber-500"
                    : "text-muted-foreground/40 hover:text-muted-foreground",
                )}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {field.pk ? "Remove Primary Key" : "Set as Primary Key"}
          </TooltipContent>
        </Tooltip>

        {/* Inline editable name */}
        {isEditing ? (
          <Input
            ref={inputRef}
            className="flex-1 basis-0 min-w-0 h-7 text-xs font-semibold border border-ring shadow-none rounded-sm px-1.5 py-0"
            defaultValue={field.name}
            autoFocus
            onBlur={(e) => {
              handleNameChange(e.target.value);
              setIsEditing(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNameChange(e.currentTarget.value);
                setIsEditing(false);
              }
              if (e.key === "Escape") {
                setIsEditing(false);
              }
            }}
          />
        ) : (
          <span
            className="flex-1 basis-0 min-w-0 h-7 flex items-center text-xs font-semibold truncate cursor-text px-1.5 rounded-sm border border-transparent hover:border-border"
            onClick={() => setIsEditing(true)}
            title="Click to rename"
          >
            {field.name}
          </span>
        )}

        {/* Type select */}
        <Select value={field.type.toUpperCase()} onValueChange={handleTypeChange}>
          <SelectTrigger
            size="sm"
            className="flex-1 basis-0 h-7 min-w-0 text-xs shadow-none bg-transparent rounded-sm border border-transparent hover:border-border px-1.5 gap-1"
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

        {/* Detail settings button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setShowDetail(true);
              }}
            >
              <SettingsIcon className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Field Settings</TooltipContent>
        </Tooltip>
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
