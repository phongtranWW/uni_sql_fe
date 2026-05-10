import { splitStatements } from "@/utils/sql-importer/normalize";
import type {
  QueryError,
  QueryField,
  QueryResult,
  SchemaTable,
  SqlDialect,
  SqlEngine,
} from "../types";

// pglite is dynamically imported inside init() so its WASM payload (~3 MB)
// only ships in the chunk that actually visits /playground.
type PgliteModule = typeof import("@electric-sql/pglite");
type PGliteInstance = InstanceType<PgliteModule["PGlite"]>;

/**
 * SqlEngine backed by @electric-sql/pglite — a full PostgreSQL build compiled
 * to WebAssembly. Runs entirely in the browser, no server round-trips.
 *
 * Notes:
 * - We use an in-memory DB. Persistence to IndexedDB is a one-line change
 *   (`new PGlite("idb://playground-{projectId}")`) when we want it.
 * - Each statement is executed via `db.query()` (not `exec()`) so we keep
 *   field metadata for the result table.
 */
export class PgliteEngine implements SqlEngine {
  readonly dialect: SqlDialect = "postgresql";

  private db: PGliteInstance | null = null;
  private lastSeed: string | undefined;

  async init(seedSql?: string): Promise<void> {
    if (this.db) {
      throw new Error("PgliteEngine.init() called twice — use reset() instead");
    }
    const { PGlite } = await import("@electric-sql/pglite");
    this.db = await PGlite.create();
    this.lastSeed = seedSql;

    if (seedSql && seedSql.trim()) {
      // Use exec() for the seed: it accepts a multi-statement script in one
      // call and is more forgiving with backend-emitted DDL.
      await this.db.exec(seedSql);
    }
  }

  async execute(sql: string): Promise<QueryResult[]> {
    if (!this.db) throw new Error("Engine not initialised");

    const statements = splitStatements(sql).filter((s) => s.length > 0);
    const results: QueryResult[] = [];

    for (const statement of statements) {
      const startedAt = performance.now();
      try {
        const raw = await this.db.query<Record<string, unknown>>(statement);
        const durationMs = Math.round(performance.now() - startedAt);

        const fields: QueryField[] = (raw.fields ?? []).map((f) => ({
          name: f.name,
          dataTypeID: f.dataTypeID,
        }));

        results.push({
          statement,
          // pglite exposes raw command tag as `affectedRows` is missing on
          // non-DML; we fall back to a heuristic on the first keyword.
          command: extractCommand(statement),
          fields,
          rows: raw.rows ?? [],
          rowCount: raw.affectedRows ?? raw.rows?.length ?? 0,
          durationMs,
        });
      } catch (err) {
        throw normalisePgError(err, statement);
      }
    }

    return results;
  }

  async reset(seedSql?: string): Promise<void> {
    const nextSeed = seedSql ?? this.lastSeed;
    await this.close();
    await this.init(nextSeed);
  }

  async getSchema(): Promise<SchemaTable[]> {
    if (!this.db) throw new Error("Engine not initialised");

    // Pull tables + columns + PK info from information_schema in one query
    // to avoid N+1 round-trips. Limited to user schemas (skip pg_catalog,
    // information_schema themselves).
    const sql = `
      SELECT
        c.table_schema AS schema,
        c.table_name   AS table,
        c.column_name  AS column,
        c.data_type    AS data_type,
        c.is_nullable  AS is_nullable,
        EXISTS (
          SELECT 1
          FROM information_schema.table_constraints tc
          JOIN information_schema.key_column_usage kcu
            ON kcu.constraint_name = tc.constraint_name
           AND kcu.table_schema    = tc.table_schema
           AND kcu.table_name      = tc.table_name
          WHERE tc.constraint_type = 'PRIMARY KEY'
            AND tc.table_schema    = c.table_schema
            AND tc.table_name      = c.table_name
            AND kcu.column_name    = c.column_name
        ) AS is_pk
      FROM information_schema.columns c
      WHERE c.table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY c.table_schema, c.table_name, c.ordinal_position;
    `;

    interface Row {
      schema: string;
      table: string;
      column: string;
      data_type: string;
      is_nullable: string;
      is_pk: boolean;
    }

    const result = await this.db.query<Row>(sql);
    const tableMap = new Map<string, SchemaTable>();

    for (const row of result.rows) {
      const key = `${row.schema}.${row.table}`;
      let table = tableMap.get(key);
      if (!table) {
        table = { schema: row.schema, name: row.table, columns: [] };
        tableMap.set(key, table);
      }
      table.columns.push({
        name: row.column,
        dataType: row.data_type,
        nullable: row.is_nullable === "YES",
        isPrimaryKey: row.is_pk,
      });
    }

    return Array.from(tableMap.values());
  }

  async close(): Promise<void> {
    if (!this.db) return;
    try {
      await this.db.close();
    } finally {
      this.db = null;
    }
  }
}

/**
 * Best-effort first-keyword extraction. Avoids a full parser since the result
 * is purely cosmetic ("SELECT 12 rows · 3ms").
 */
function extractCommand(statement: string): string | undefined {
  const match = statement
    .replace(/^\s*\/\*[\s\S]*?\*\//, "")
    .trimStart()
    .match(/^[A-Za-z]+/);
  return match ? match[0].toUpperCase() : undefined;
}

/**
 * Convert a thrown pglite/postgres error into our normalised QueryError.
 * pglite re-uses the standard PG error shape: { message, code, position, hint }.
 */
function normalisePgError(err: unknown, statement: string): QueryError {
  if (err instanceof Error) {
    const e = err as Error & {
      code?: string;
      hint?: string;
      position?: number | string;
    };
    const positionRaw = e.position;
    const position =
      typeof positionRaw === "string"
        ? Number.parseInt(positionRaw, 10) || undefined
        : positionRaw;
    return {
      message: e.message,
      code: e.code,
      hint: e.hint,
      position,
      statement,
    };
  }
  return {
    message: typeof err === "string" ? err : "Unknown engine error",
    statement,
  };
}
