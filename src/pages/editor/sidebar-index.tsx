import { cn } from "@/lib/utils";
import { Fingerprint, Trash2Icon, Plus } from "lucide-react";
import { useAppDispatch } from "@/app/hook";
import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  indexPartial,
  indexRemoved,
} from "@/features/project/slices/project.slice";
import type { Index, IndexPart } from "@/features/project/schemas/index.schema";
import { IndexPartSchema } from "@/features/project/schemas/index.schema";
import type { Table } from "@/features/project/schemas/table-schema";

const SidebarIndex = ({ table, index }: { table: Table; index: Index }) => {
  const dispatch = useAppDispatch();

  const update = useCallback(
    (data: IndexPart) => {
      const result = IndexPartSchema.safeParse(data);
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      dispatch(
        indexPartial({
          indexName: index.name,
          data,
        }),
      );
    },
    [dispatch, index.name],
  );

  const handleDelete = () => {
    dispatch(indexRemoved(index.name));
  };

  const handleRemoveField = (fieldName: string) => {
    if (index.fields.length <= 1) {
      toast.error("An index must have at least one field");
      return;
    }
    update({ fields: index.fields.filter((f) => f !== fieldName) });
  };

  const handleAddField = (fieldName: string) => {
    if (!index.fields.includes(fieldName)) {
      update({ fields: [...index.fields, fieldName] });
    }
  };

  const availableFields = table.fields.filter(
    (f) => !index.fields.includes(f.name),
  );

  return (
    <div className="group flex flex-col gap-1.5 px-2 py-2 border-t border-border transition-colors bg-muted/10">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => update({ unique: !index.unique })}
          className="size-7 shrink-0"
        >
          <Fingerprint
            className={cn(
              "size-4",
              index.unique
                ? "text-violet-500"
                : "text-muted-foreground/40 hover:text-muted-foreground",
            )}
          />
        </Button>
        <Input
          className="flex-1 min-w-0 h-7 text-xs rounded-sm px-1.5 py-0 font-medium"
          defaultValue={index.name}
          onBlur={(e) => {
            const trimmed = e.target.value.trim();
            if (trimmed && trimmed !== index.name) {
              update({ name: trimmed });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
            }
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 size-7"
          onClick={handleDelete}
        >
          <Trash2Icon className="size-3.5" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 pl-8">
        {index.fields.map((fieldName) => (
          <Badge
            key={fieldName}
            variant="secondary"
            className="px-1.5 py-0 text-[10px] flex items-center gap-1 font-mono border-muted-foreground/20"
          >
            {fieldName}
            <button
              onClick={() => handleRemoveField(fieldName)}
              className="text-muted-foreground hover:text-foreground rounded-sm hover:-translate-y-[0.5px] transition-transform"
            >
              <Trash2Icon className="size-3" />
            </button>
          </Badge>
        ))}
        {availableFields.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-5 px-1.5 text-[10px]"
              >
                <Plus className="size-3 mr-0.5" />
                Field
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-32">
              {availableFields.map((f) => (
                <DropdownMenuItem
                  key={f.name}
                  onClick={() => handleAddField(f.name)}
                  className="text-xs font-mono"
                >
                  {f.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};
export default SidebarIndex;
