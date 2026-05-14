import { faker } from "@faker-js/faker";
import type { SchemaColumn, SchemaTable } from "@/lib/sql-engine";
import type { ColumnConfig } from "./faker-options";
import { generateWithFakerOption } from "./faker-options";

export const MAX_ROW_COUNT = 1000;

interface SingleTableResult {
  sql: string;
  rowCount: number;
}

/**
 * Generate INSERT statements for a single table with per-column configuration.
 */
export function generateSingleTableInserts(
  table: SchemaTable,
  rowCount: number,
  columnConfigs: Map<string, ColumnConfig>,
  seed: number,
): SingleTableResult {
  faker.seed(seed);

  const rows: Record<string, unknown>[] = [];

  // Only include columns that are selected (exist in columnConfigs)
  const columnsToInsert = table.columns.filter(
    col => (!col.isPrimaryKey || !col.autoIncrement) && columnConfigs.has(col.name)
  );

  for (let i = 0; i < rowCount; i++) {
    const row: Record<string, unknown> = {};

    for (const col of columnsToInsert) {
      const config = columnConfigs.get(col.name)!;

      if (config.mode === "default") {
        row[col.name] = config.defaultValue ?? null;
      } else if (config.mode === "faker" && config.fakerId) {
        try {
          row[col.name] = generateWithFakerOption(
            col.dataType,
            config.fakerId,
          );
        } catch {
          row[col.name] = null;
        }
      } else {
        row[col.name] = null;
      }
    }

    rows.push(row);
  }

  const sql = buildInsertStatement(table.name, columnsToInsert, rows);

  return {
    sql,
    rowCount,
  };
}

function buildInsertStatement(
  tableName: string,
  columns: SchemaColumn[],
  rows: Record<string, unknown>[],
): string {
  if (rows.length === 0) return "";

  const columnNames = columns.map(c => c.name);
  const header = `INSERT INTO "${tableName}" (${columnNames.map(n => `"${n}"`).join(", ")})`;

  const valueRows = rows.map(row => {
    const values = columnNames.map(colName => {
      const value = row[colName];
      return formatValue(value);
    });
    return `  (${values.join(", ")})`;
  });

  return `${header}\nVALUES\n${valueRows.join(",\n")};`;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "string") {
    return `'${value.replace(/'/g, "''")}'`;
  }

  if (typeof value === "boolean") {
    return value ? "TRUE" : "FALSE";
  }

  if (typeof value === "number") {
    return value.toString();
  }

  if (typeof value === "object") {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }

  return String(value);
}
