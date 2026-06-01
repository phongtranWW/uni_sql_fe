import { Link2, Table as TableIcon } from "lucide-react";
import type { SchemaTable } from "@/lib/sql-engine";
import { MAX_ROW_COUNT } from "@/lib/fake-data/single-table-generator";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

interface SeedTableRowProps {
  table: SchemaTable;
  selected: boolean;
  rowCount: number;
  /** Names of tables this row references via FK. */
  fkParents: string[];
  onSelectedChange: (next: boolean) => void;
  onRowCountChange: (next: number) => void;
}

/**
 * Single row inside the seed dialog's table list.
 *
 * Pulled into its own file because the dialog is otherwise quite long, and
 * because this component is the natural place to add per-table extras later
 * (column overrides, faker formula picker, …).
 */
const PlaygroundSeedTableRow = ({
  table,
  selected,
  rowCount,
  fkParents,
  onSelectedChange,
  onRowCountChange,
}: SeedTableRowProps) => {
  const handleRowCountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = Number.parseInt(e.target.value, 10);
    if (Number.isNaN(raw)) return;
    const clamped = Math.min(Math.max(1, raw), MAX_ROW_COUNT);
    onRowCountChange(clamped);
  };

  return (
    <li className="flex items-center gap-3 rounded-md border border-border px-3 py-2 transition-colors hover:bg-muted/30">
      <Checkbox
        checked={selected}
        onCheckedChange={(c) => onSelectedChange(c === true)}
        aria-label={`Seed table ${table.name}`}
      />

      <TableIcon className="size-4 shrink-0 text-muted-foreground" />

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-mono text-sm">{table.name}</span>
        <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>
            {table.columns.length} col{table.columns.length === 1 ? "" : "s"}
          </span>
          {fkParents.length > 0 && (
            <span className="flex items-center gap-1">
              <Link2 className="size-3 text-cyan-500" />
              <span className="truncate">FK → {fkParents.join(", ")}</span>
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          min={1}
          max={MAX_ROW_COUNT}
          value={rowCount}
          onChange={handleRowCountInput}
          disabled={!selected}
          className="h-8 w-20 text-right text-sm"
          aria-label={`Row count for ${table.name}`}
        />
        <span className="text-xs text-muted-foreground">rows</span>
      </div>
    </li>
  );
};

export default PlaygroundSeedTableRow;
