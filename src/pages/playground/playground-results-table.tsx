import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { QueryResult } from "@/lib/sql-engine";

interface Props {
  result: QueryResult;
}

const MAX_ROWS = 1000;
const NULL_LABEL = "NULL";
const PlaygroundResultsTable = ({ result }: Props) => {
  const visibleRows = useMemo(
    () => result.rows.slice(0, MAX_ROWS),
    [result.rows],
  );

  if (result.fields.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-2 py-1.5 text-sm">
        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
        <span className="font-medium text-emerald-700 dark:text-emerald-300">
          {result.command || "Success"}
        </span>
        {typeof result.rowCount === "number" && result.rowCount > 0 && (
          <span className="text-emerald-600/80 dark:text-emerald-400/80">
            {result.rowCount} row{result.rowCount === 1 ? "" : "s"} affected
          </span>
        )}
        <span className="ml-auto text-xs text-emerald-600/60 dark:text-emerald-400/60">
          {result.durationMs}ms
        </span>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <div className="flex items-center justify-between gap-2 border-b bg-muted/30 px-3 py-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-xs">
            {result.command || "RESULT"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {result.rows.length} row{result.rows.length === 1 ? "" : "s"}
            {result.rows.length > MAX_ROWS && ` (showing ${MAX_ROWS})`}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {result.durationMs}ms
        </span>
      </div>

      <div className="max-h-96 overflow-auto">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50 z-10">
              <TableRow>
                {result.fields.map((field, i) => (
                  <TableHead
                    key={`${field.name}-${i}`}
                    className="h-8 px-3 font-mono text-xs font-medium whitespace-nowrap"
                  >
                    {field.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={result.fields.length}
                    className="h-16 text-center text-xs text-muted-foreground"
                  >
                    No rows returned
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row, ri) => (
                  <TableRow key={ri} className="hover:bg-muted/30">
                    {result.fields.map((field, fi) => (
                      <TableCell
                        key={`${field.name}-${fi}`}
                        className="px-3 py-2 font-mono text-xs whitespace-nowrap"
                      >
                        {formatCell(row[field.name])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return NULL_LABEL;
  if (typeof value === "string") return value;
  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }
  if (value instanceof Date) return value.toISOString();
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export default PlaygroundResultsTable;
