/**
 * Engine-agnostic SQL execution layer.
 *
 * The interface deliberately stays small so additional dialects (SQLite via
 * sql.js, MySQL via a backend proxy, …) can be added later without changing
 * the playground UI.
 */

export type SqlDialect = "postgresql" | "mysql" | "sqlite";

/**
 * Metadata for one column returned by a query.
 *
 * `dataTypeID` is the PostgreSQL OID when available — it lets the UI render
 * sensible values (e.g. boolean → "true"/"false") in the future.
 */
export interface QueryField {
  name: string;
  dataTypeID?: number;
  dataTypeName?: string;
}

/**
 * Result of one top-level statement.
 *
 * The execute() method returns one entry per statement so the UI can render
 * a tab/section for each, even when the user runs a script with multiple
 * SELECTs interleaved with DDL.
 */
export interface QueryResult {
  /** Statement text that produced this result (truncated for display). */
  statement: string;
  /** Command tag from the server, e.g. "SELECT", "INSERT", "CREATE TABLE". */
  command?: string;
  fields: QueryField[];
  rows: Record<string, unknown>[];
  rowCount: number;
  durationMs: number;
  /** NOTICE / RAISE / informational messages, if any. */
  notices?: string[];
}

/**
 * Normalised error shape so the UI doesn't have to know which engine threw.
 */
export interface QueryError {
  message: string;
  /** 1-based char offset into the failing statement, when known. */
  position?: number;
  code?: string;
  hint?: string;
  /** Statement that failed (truncated). */
  statement?: string;
}

/**
 * One column inside a table, as exposed by `getSchema()`.
 */
export interface SchemaColumn {
  name: string;
  dataType: string;
  nullable: boolean;
  isPrimaryKey: boolean;
}

/**
 * One table in the in-browser DB, as exposed by `getSchema()`.
 */
export interface SchemaTable {
  schema: string;
  name: string;
  columns: SchemaColumn[];
}

/**
 * Lifecycle + execution contract every engine must implement.
 *
 * Engines are single-use: they hold an internal DB instance and must be
 * `close()`d when the consumer is done. `init()` may be called only once;
 * use `reset()` to wipe state and re-seed.
 */
export interface SqlEngine {
  readonly dialect: SqlDialect;

  /**
   * Boot the underlying DB and, if provided, execute `seedSql` so the
   * playground starts with the user's schema already loaded.
   */
  init(seedSql?: string): Promise<void>;

  /**
   * Execute one or more semicolon-separated statements.
   *
   * Implementations split on top-level `;` (respecting strings/parens) and
   * return one QueryResult per statement. A failure aborts the rest of the
   * batch and is rejected with a `QueryError`.
   */
  execute(sql: string): Promise<QueryResult[]>;

  /**
   * Tear down the current DB and re-`init()` with the given (or last) seed.
   */
  reset(seedSql?: string): Promise<void>;

  /**
   * Introspect the current schema. Useful for the schema sidebar and for
   * autocomplete hints in the future.
   */
  getSchema(): Promise<SchemaTable[]>;

  /**
   * Release the underlying DB. Idempotent.
   */
  close(): Promise<void>;
}

export const isQueryError = (e: unknown): e is QueryError => {
  return (
    typeof e === "object" &&
    e !== null &&
    "message" in e &&
    typeof (e as { message: unknown }).message === "string"
  );
};
