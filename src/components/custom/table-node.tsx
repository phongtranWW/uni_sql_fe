import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { KeyRoundIcon, FingerprintIcon, BanIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Field } from "@/features/project/schemas/field-schema";

type TableNode = Node<
  {
    name: string;
    fields: Field[];
    alias: string | null;
    headerColor: string | null;
  },
  "table"
>;

function FieldConstraints({ field }: { field: Field }) {
  return (
    <div className="flex items-center gap-0.5 shrink-0">
      {field.pk && <KeyRoundIcon className="w-3.5 h-3.5 text-amber-500" />}
      {field.unique && !field.pk && (
        <FingerprintIcon className="w-3.5 h-3.5 text-green-400" />
      )}
      {field.not_null && <BanIcon className="w-3.5 h-3.5 text-red-400" />}
    </div>
  );
}

export default function TableNode({ data, selected }: NodeProps<TableNode>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md flex flex-col w-60 bg-card border shadow-md transition-all",
        selected ? "border-primary border-2 border-dashed" : "border-border",
      )}
    >
      {/* Header */}
      <div
        className="text-center py-2 px-3 text-sm font-semibold text-card-foreground"
        style={{ backgroundColor: data.headerColor || undefined }}
      >
        {data.name}
        {data.alias && (
          <span className="ml-1 text-xs font-normal opacity-60">
            ({data.alias})
          </span>
        )}
      </div>

      {/* Fields */}
      <div className="flex flex-col divide-y divide-border">
        {data.fields.map((field) => (
          <div
            key={field.name}
            className={cn(
              "relative px-3 py-1.5 hover:bg-muted/50 transition-colors",
              field.pk && "bg-amber-500/5",
            )}
          >
            <Handle
              position={Position.Left}
              type="source"
              id={field.name}
              className="absolute! w-full! h-full! top-0! left-0! rounded-none! transform-none! border-none! bg-transparent!"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <FieldConstraints field={field} />
                <span
                  className={cn(
                    "font-medium text-xs truncate",
                    field.pk && "text-amber-600 dark:text-amber-400",
                  )}
                >
                  {field.name}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-mono shrink-0">
                {field.type}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
