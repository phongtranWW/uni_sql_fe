import type { FieldType } from "@/constants/field-types";

/**
 * One entry in the per-table seed configuration.
 *
 * `table` is the unqualified table name (we always operate within the same
 * schema for the playground; pglite defaults to `public`).
 */
export interface SeedTableConfig {
  table: string;
  rowCount: number;
}

export interface FakeDataConfig {
  tables: SeedTableConfig[];
  /**
   * If true, any table that's referenced via FK from a selected child but
   * not explicitly listed will be automatically inserted with
   * `defaultRowCount` rows. Required to satisfy NOT NULL FK columns.
   */
  autoIncludeFkParents: boolean;
  defaultRowCount: number;
  /**
   * Optional faker seed for reproducible output. Pass a fresh value to
   * regenerate different data.
   */
  seed?: number;
}

export type FakeDataWarningCode =
  | "SKIPPED_CYCLE"
  | "MISSING_PARENT_ROWS"
  | "UNSUPPORTED_TYPE"
  | "TRUNCATED_ROW_COUNT"
  | "COMPOSITE_FK"
  | "MISSING_TABLE";

export interface FakeDataWarning {
  code: FakeDataWarningCode;
  message: string;
  table?: string;
  column?: string;
}

/**
 * Plan entry returned to the UI so the dialog can display "users — 10 rows
 * (4 cols)" style summaries even before the SQL is shown.
 */
export interface FakeDataPlanEntry {
  table: string;
  rowCount: number;
  /** Columns we will write to (i.e. excludes identity/default columns). */
  columns: string[];
}

export interface FakeDataResult {
  /** Multi-statement SQL wrapped in BEGIN; ... COMMIT;. Empty when nothing to do. */
  sql: string;
  plan: FakeDataPlanEntry[];
  warnings: FakeDataWarning[];
}

/**
 * Per-call mutable state used by generators to enforce uniqueness and to
 * remember which PKs were already inserted (for FK resolution).
 */
export interface GenerationContext {
  /** Map<`${table}.${column}`, Set<value>>. */
  uniqueValues: Map<string, Set<unknown>>;
  /** Map<table, list of inserted PK values, in insertion order>. */
  insertedPks: Map<string, unknown[]>;
  warnings: FakeDataWarning[];
}

/**
 * Result of mapping one column to its generator. Returned by `faker-mapper`
 * so callers can both pre-compute and execute. Splitting the mapping (sync,
 * pure) from execution makes testing and review cleaner.
 */
export interface ColumnGenerator {
  /** Produce one JS value (raw, before SQL formatting). */
  generate: () => unknown;
  /** Effective type used for SQL literal formatting. */
  fieldType: FieldType;
}
