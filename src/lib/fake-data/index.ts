import type { SchemaTable } from "@/lib/sql-engine";
import { generateValueForColumn } from "./faker-mapper";
import { pgTypeToFieldType } from "./pg-type-map";
import { quoteIdentifier, toSqlLiteral } from "./value-formatter";
import { sortTablesByFk } from "./topological-sort";
import type {
  FakeDataConfig,
  FakeDataPlanEntry,
  FakeDataResult,
  FakeDataWarning,
  GenerationContext,
} from "./types";

export type {
  FakeDataConfig,
  FakeDataPlanEntry,
  FakeDataResult,
  FakeDataWarning,
  FakeDataWarningCode,
  SeedTableConfig,
} from "./types";

export const MAX_ROW_COUNT = 1000;

/**
 * Generate the INSERT script for a fake-data plan.
 *
 * High-level pipeline:
 *  1. Resolve which tables to include (selected + auto-included parents).
 *  2. Sort them by FK dependency (Kahn).
 *  3. For each table, build a column list excluding identity / default-only
 *     columns, then generate N rows with the faker mapper.
 *  4. Concatenate one INSERT-with-multi-VALUES per table.
 *  5. Wrap the whole thing in BEGIN / COMMIT so the run is atomic.
 *
 * The function is async only because it dynamically imports `@faker-js/faker`
 * (locale-en build) so the bundler can code-split it out of the main chunk.
 */
export async function generateInserts(
  schema: SchemaTable[],
  config: FakeDataConfig,
): Promise<FakeDataResult> {
  const warnings: FakeDataWarning[] = [];

  // Map<tableName, SchemaTable> for O(1) lookup.
  const byName = new Map<string, SchemaTable>();
  for (const t of schema) byName.set(t.name, t);

  // ── 1. Resolve included tables ──
  const explicit = new Map<string, number>();
  for (const t of config.tables) {
    if (!byName.has(t.table)) {
      warnings.push({
        code: "MISSING_TABLE",
        message: `Table "${t.table}" not found in current schema; skipped.`,
        table: t.table,
      });
      continue;
    }
    const clamped = Math.min(Math.max(1, t.rowCount), MAX_ROW_COUNT);
    if (clamped !== t.rowCount) {
      warnings.push({
        code: "TRUNCATED_ROW_COUNT",
        message: `Row count for "${t.table}" clamped to ${clamped} (max ${MAX_ROW_COUNT}).`,
        table: t.table,
      });
    }
    explicit.set(t.table, clamped);
  }

  if (config.autoIncludeFkParents) {
    addFkParents(explicit, byName, config.defaultRowCount);
  }

  // ── 2. Topological sort by FK ──
  const { ordered, cycles } = sortTablesByFk({
    tables: schema,
    selected: new Set(explicit.keys()),
  });

  for (const cycle of cycles) {
    warnings.push({
      code: "SKIPPED_CYCLE",
      message: `Table "${cycle}" depends on a non-nullable FK cycle; skipped.`,
      table: cycle,
    });
  }

  if (ordered.length === 0) {
    return { sql: "", plan: [], warnings };
  }

  // ── 3. Boot faker (en locale only — keeps bundle small) ──
  const { faker } = await import("@faker-js/faker/locale/en");
  if (config.seed !== undefined) {
    faker.seed(config.seed);
  } else {
    faker.seed();
  }

  // ── 4. Per-table generation ──
  const ctx: GenerationContext = {
    uniqueValues: new Map(),
    insertedPks: new Map(),
    warnings,
  };

  const plan: FakeDataPlanEntry[] = [];
  const statements: string[] = [];

  for (const tableName of ordered) {
    const table = byName.get(tableName)!;
    const rowCount = explicit.get(tableName)!;

    const generated = generateRowsForTable(faker, table, rowCount, ctx);
    if (!generated) continue; // skipped (e.g. missing parent rows)

    plan.push({
      table: tableName,
      rowCount: generated.rows.length,
      columns: generated.columns,
    });

    if (generated.rows.length === 0) continue;
    statements.push(buildInsertStatement(tableName, generated));
  }

  if (statements.length === 0) {
    return { sql: "", plan, warnings };
  }

  const sql = ["BEGIN;", ...statements, "COMMIT;"].join("\n\n");
  return { sql, plan, warnings };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

interface GeneratedRows {
  /** Column names that we explicitly write to (excludes identity/defaults). */
  columns: string[];
  /** Row tuples — already SQL-formatted literals. */
  rows: string[][];
}

function generateRowsForTable(
  faker: import("@faker-js/faker").Faker,
  table: import("@/lib/sql-engine").SchemaTable,
  rowCount: number,
  ctx: GenerationContext,
): GeneratedRows | null {
  // Decide which columns we'll write to.
  const writableCols = table.columns.filter((c) => {
    if (c.isIdentity) return false;          // identity must not receive a value
    if (c.hasDefault && c.nullable) return false; // let default kick in
    if (c.hasDefault && !c.nullable && c.fk === null && !c.isPrimaryKey) {
      // NOT NULL with default — also let DB fill it (e.g. CURRENT_TIMESTAMP).
      return false;
    }
    return true;
  });

  // Pre-compute (column, fieldType, warning) so we don't repeat the lookup
  // on every row.
  const columnMeta = writableCols.map((col) => {
    const map = pgTypeToFieldType(col.dataType);
    if (map.warning) {
      ctx.warnings.push({
        code: "UNSUPPORTED_TYPE",
        message: map.warning,
        table: table.name,
        column: col.name,
      });
    }
    return { col, fieldType: map.fieldType };
  });

  // Pre-flight: every NOT NULL FK must have parent PKs available, else we
  // cannot fill it.
  for (const { col } of columnMeta) {
    if (col.fk && !col.nullable) {
      const parentPks = ctx.insertedPks.get(col.fk.table);
      if (!parentPks || parentPks.length === 0) {
        ctx.warnings.push({
          code: "MISSING_PARENT_ROWS",
          message: `Cannot insert into "${table.name}": FK column "${col.name}" → "${col.fk.table}.${col.fk.column}" has no parent rows.`,
          table: table.name,
          column: col.name,
        });
        return null;
      }
    }
  }

  const pkColumn = table.columns.find((c) => c.isPrimaryKey && !c.isIdentity);
  const rows: string[][] = [];

  for (let i = 0; i < rowCount; i++) {
    const tuple: string[] = [];
    let pkValueForRow: unknown = null;

    for (const { col, fieldType } of columnMeta) {
      const uniqueKey = `${table.name}.${col.name}`;
      let seen = ctx.uniqueValues.get(uniqueKey);
      if (!seen) {
        seen = new Set();
        ctx.uniqueValues.set(uniqueKey, seen);
      }

      let value: unknown;

      if (col.fk) {
        const parents = ctx.insertedPks.get(col.fk.table) ?? [];
        if (parents.length === 0) {
          if (col.nullable) value = null;
          else {
            // Already pre-flighted; this branch is defensive.
            value = null;
          }
        } else {
          value = parents[Math.floor(faker.number.int({ min: 0, max: parents.length - 1 }))];
        }
      } else {
        value = generateValueForColumn(faker, col, fieldType, seen);
      }

      if ((col.isUnique || col.isPrimaryKey) && value !== null) {
        seen.add(value);
      }
      if (col === pkColumn) pkValueForRow = value;

      tuple.push(toSqlLiteral(value, fieldType));
    }

    rows.push(tuple);
    if (pkColumn && pkValueForRow !== null) {
      const list = ctx.insertedPks.get(table.name) ?? [];
      list.push(pkValueForRow);
      ctx.insertedPks.set(table.name, list);
    }
  }

  return {
    columns: columnMeta.map((c) => c.col.name),
    rows,
  };
}

function buildInsertStatement(tableName: string, gen: GeneratedRows): string {
  const cols = gen.columns.map(quoteIdentifier).join(", ");
  // Multi-row VALUES: emit one row per line for readability + smaller SQL.
  const valuesBlock = gen.rows
    .map((tuple) => `  (${tuple.join(", ")})`)
    .join(",\n");

  return `INSERT INTO ${quoteIdentifier(tableName)} (${cols})\nVALUES\n${valuesBlock};`;
}

/**
 * Walk the FK graph from each selected child and add any missing parent
 * tables with `defaultRowCount`. Done iteratively so a parent's parents are
 * also pulled in.
 */
function addFkParents(
  explicit: Map<string, number>,
  byName: Map<string, SchemaTable>,
  defaultRowCount: number,
): void {
  const queue = Array.from(explicit.keys());
  while (queue.length > 0) {
    const tableName = queue.shift()!;
    const table = byName.get(tableName);
    if (!table) continue;

    for (const c of table.columns) {
      if (!c.fk) continue;
      // Only auto-include parents for NOT NULL FKs; nullable FKs can be NULL.
      if (c.nullable) continue;
      if (explicit.has(c.fk.table)) continue;
      if (!byName.has(c.fk.table)) continue;

      explicit.set(c.fk.table, defaultRowCount);
      queue.push(c.fk.table);
    }
  }
}
