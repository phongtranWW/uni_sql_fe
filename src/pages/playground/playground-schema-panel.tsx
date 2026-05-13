import { useState } from "react";
import {
  ChevronRight,
  KeyRound,
  Link2,
  Search,
  Table as TableIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SchemaTable } from "@/lib/sql-engine";
import type { UseSqlEngineResult } from "@/hooks/use-sql-engine";

interface PlaygroundSchemaPanelProps {
  engine: UseSqlEngineResult;
}

const PlaygroundSchemaPanel = ({ engine }: PlaygroundSchemaPanelProps) => {
  const { schema, status } = engine;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSchema = schema.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <aside className="flex h-full flex-col bg-muted/10">
      {status === "ready" && schema.length > 0 && (
        <div className="border-b px-3 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        {status !== "ready" ? (
          <p className="p-3 text-xs italic text-muted-foreground">
            Schema appears once the engine is ready.
          </p>
        ) : schema.length === 0 ? (
          <p className="p-3 text-xs italic text-muted-foreground">
            No user tables yet.
          </p>
        ) : filteredSchema.length === 0 ? (
          <p className="p-3 text-xs italic text-muted-foreground">
            No tables match "{searchQuery}".
          </p>
        ) : (
          <ul>
            {filteredSchema.map((t) => (
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
    <li className="border-b border-border/40 last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/40"
      >
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            expanded && "rotate-90",
          )}
        />
        <TableIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate font-mono text-xs">{table.name}</span>
        <span className="text-xs text-muted-foreground">
          {table.columns.length}
        </span>
      </button>
      {expanded && (
        <ul className="border-t border-border/40 bg-muted/20 py-1">
          {table.columns.map((col) => (
            <li
              key={col.name}
              className="flex items-center gap-2 px-3 py-1 text-xs font-mono hover:bg-muted/40"
              title={
                col.fk
                  ? `FK → ${col.fk.table}.${col.fk.column}`
                  : col.isPrimaryKey
                    ? "Primary key"
                    : undefined
              }
            >
              {col.isPrimaryKey ? (
                <KeyRound className="size-3.5 shrink-0 text-amber-500" />
              ) : col.fk ? (
                <Link2 className="size-3.5 shrink-0 text-cyan-500" />
              ) : (
                <span className="size-3.5 shrink-0" aria-hidden />
              )}
              <span className="flex-1 truncate">{col.name}</span>
              <span className="text-muted-foreground">{col.dataType}</span>
              {!col.nullable && (
                <span className="text-[10px] text-muted-foreground">NN</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default PlaygroundSchemaPanel;
