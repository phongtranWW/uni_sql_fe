import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { QueryResult } from "@/lib/sql-engine";

interface Props {
  result: QueryResult;
}

const MAX_ROWS = 500; // Render cap; full row count still shown in the footer.
const NULL_LABEL = "NULL";

/**
 * Renders one statement's rows as an HTML table.
 *
 * For non-DML statements (CREATE TABLE, INSERT without RETURNING, …) pglite
 * still returns a Results object — usually with no fields and no rows. We
 * fall back to a friendly "OK" badge in that case.
 */
const PlaygroundResultsTable = ({ result }: Props) => {
  const visibleRows = useMemo(
    () => result.rows.slice(0, MAX_ROWS),
    [result.rows],
  );

  if (result.fields.length === 0) {
    return (
      <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
        <span className="font-medium">OK</span>
        {result.command && <span className="ml-2 font-mono">{result.command}</span>}
        {typeof result.rowCount === "number" && result.rowCount > 0 && (
          <span className="ml-2">{result.rowCount} row{result.rowCount === 1 ? "" : "s"} affected</span>
        )}
        <span className="ml-2 text-emerald-600/70 dark:text-emerald-400/70">
          · {result.durationMs}ms
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
        <span>
          <span className="font-mono text-foreground">{result.command ?? "RESULT"}</span>
          {" · "}
          {result.rows.length} row{result.rows.length === 1 ? "" : "s"}
          {result.rows.length > MAX_ROWS && ` (showing ${MAX_ROWS})`}
        </span>
        <span>{result.durationMs}ms</span>
      </div>

      <div className="max-h-72 overflow-auto">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              {result.fields.map((field, i) => (
                <TableHead key={`${field.name}-${i}`} className="font-mono text-xs">
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
                  className="text-center text-xs italic text-muted-foreground"
                >
                  (no rows)
                </TableCell>
              </TableRow>
            ) : (
              visibleRows.map((row, ri) => (
                <TableRow key={ri}>
                  {result.fields.map((field, fi) => (
                    <TableCell key={`${field.name}-${fi}`} className="font-mono text-xs">
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
  );
};

function formatCell(value: unknown): string {
  if (value === null || value === undefined) return NULL_LABEL;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
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
