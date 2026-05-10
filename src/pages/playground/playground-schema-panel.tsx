import { useState } from "react";
import { ChevronRight, Database, KeyRound, Table as TableIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { SchemaTable } from "@/lib/sql-engine";
import { usePlayground } from "./playground-context";

const PlaygroundSchemaPanel = () => {
  const { engine } = usePlayground();
  const { schema, schemaLoading, status } = engine;

  return (
    <aside className="flex h-full flex-col bg-muted/10">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Database className="size-3.5" />
        <span>Schema</span>
        {schemaLoading && <Spinner className="size-3" />}
        <span className="ml-auto text-[10px] normal-case">
          {schema.length} table{schema.length === 1 ? "" : "s"}
        </span>
      </div>

      <ScrollArea className="flex-1">
        {status !== "ready" ? (
          <p className="p-3 text-xs italic text-muted-foreground">
            Schema appears once the engine is ready.
          </p>
        ) : schema.length === 0 ? (
          <p className="p-3 text-xs italic text-muted-foreground">
            No user tables yet.
          </p>
        ) : (
          <ul>
            {schema.map((t) => (
              <SchemaTableNode key={`${t.schema}.${t.name}`} table={t} />
            ))}
          </ul>
        )}
      </ScrollArea>
    </aside>
  );
};

interface SchemaTableNodeProps {
  table: SchemaTable;
}

const SchemaTableNode = ({ table }: SchemaTableNodeProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <li className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-1.5 px-3 py-1.5 text-left text-xs transition-colors hover:bg-muted/40"
      >
        <ChevronRight
          className={cn(
            "size-3 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-90",
          )}
        />
        <TableIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="font-mono">{table.name}</span>
        <span className="ml-auto text-[10px] text-muted-foreground">
          {table.columns.length}
        </span>
      </button>
      {expanded && (
        <ul className="border-t border-border/60 bg-muted/10 px-3 py-1">
          {table.columns.map((col) => (
            <li
              key={col.name}
              className="flex items-center gap-1.5 py-0.5 text-[11px] font-mono"
            >
              {col.isPrimaryKey ? (
                <KeyRound className="size-3 shrink-0 text-amber-500" />
              ) : (
                <span className="size-3 shrink-0" aria-hidden />
              )}
              <span>{col.name}</span>
              <span className="text-muted-foreground">{col.dataType}</span>
              {!col.nullable && (
                <span className="ml-auto text-[10px] text-muted-foreground">
                  NN
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default PlaygroundSchemaPanel;
