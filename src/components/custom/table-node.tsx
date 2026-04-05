import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Badge } from "../ui/badge";
import { Key, Lock } from "lucide-react";
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

export default function TableNode({ data, selected }: NodeProps<TableNode>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm flex flex-col w-60 bg-card border shadow-sm transition-all",
        selected ? "border-primary border-2 border-dashed" : "border-border",
      )}
    >
      <div
        className="text-center py-2 text-sm font-semibold text-card-foreground"
        style={{ backgroundColor: data.headerColor || undefined }}
      >
        {data.name}
      </div>

      <div className="flex flex-col divide-y divide-border">
        {data.fields.map((field) => (
          <div
            key={field.name}
            className="relative px-4 py-2 hover:bg-muted/50 transition-colors"
          >
            <Handle
              position={Position.Left}
              type="source"
              id={field.name}
              className="absolute! w-full! h-full! top-0! left-0! rounded-none! transform-none! border-none! bg-transparent!"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="font-medium text-sm truncate">
                  {field.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {field.type}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {field.pk && (
                  <Badge variant="outline" className="h-5 px-1.5">
                    <Key className="w-3 h-3" />
                  </Badge>
                )}
                {field.unique && (
                  <Badge variant="outline" className="h-5 px-1.5">
                    <Lock className="w-3 h-3" />
                  </Badge>
                )}
                {field.not_null && (
                  <Badge variant="outline" className="h-5 px-1.5 text-xs">
                    N
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
