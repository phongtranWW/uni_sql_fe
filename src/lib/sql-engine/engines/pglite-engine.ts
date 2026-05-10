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

  async executeScript(sql: string) {
    if (!this.db) throw new Error("Engine not initialised");
    const startedAt = performance.now();
    try {
      const results = await this.db.exec(sql);
      const durationMs = Math.round(performance.now() - startedAt);
      const affectedRows = results.reduce(
        (acc, r) => acc + (r.affectedRows ?? 0),
        0,
      );
      return { success: true, affectedRows, durationMs };
    } catch (err) {
      throw normalisePgError(err, sql.slice(0, 200));
    }
  }

  async getSchema(): Promise<SchemaTable[]> {
    if (!this.db) throw new Error("Engine not initialised");

    // Single round-trip query that fetches everything the seed-data feature
    // needs:
    //   - column basics (name, type, nullable, default, identity, max length)
    //   - whether the column belongs to the table's PRIMARY KEY
    //   - whether the column is covered by a single-column UNIQUE index
    //   - foreign key target (table + column) for single-column FKs
    //
    // Aggregated PK / UNIQUE / FK info is built via correlated subqueries so
    // we keep a flat row-per-column shape that's easy to parse.
    const sql = `
      WITH single_col_constraints AS (
        SELECT
          tc.table_schema,
          tc.table_name,
          tc.constraint_name,
          tc.constraint_type,
          MIN(kcu.column_name) AS column_name,
          COUNT(*)             AS col_count
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON kcu.constraint_name = tc.constraint_name
         AND kcu.table_schema    = tc.table_schema
         AND kcu.table_name      = tc.table_name
        GROUP BY tc.table_schema, tc.table_name, tc.constraint_name, tc.constraint_type
      ),
      fks AS (
        SELECT
          scc.table_schema,
          scc.table_name,
          scc.column_name,
          ccu.table_schema AS ref_schema,
          ccu.table_name   AS ref_table,
          ccu.column_name  AS ref_column
        FROM single_col_constraints scc
        JOIN information_schema.referential_constraints rc
          ON rc.constraint_name    = scc.constraint_name
         AND rc.constraint_schema  = scc.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name   = rc.unique_constraint_name
         AND ccu.constraint_schema = rc.unique_constraint_schema
        WHERE scc.constraint_type = 'FOREIGN KEY'
          AND scc.col_count = 1
      )
      SELECT
        c.table_schema           AS schema,
        c.table_name             AS table,
        c.column_name            AS column,
        c.data_type              AS data_type,
        c.is_nullable            AS is_nullable,
        c.column_default         AS column_default,
        c.is_identity            AS is_identity,
        c.character_maximum_length AS max_length,
        EXISTS (
          SELECT 1 FROM single_col_constraints scc
          WHERE scc.constraint_type = 'PRIMARY KEY'
            AND scc.table_schema    = c.table_schema
            AND scc.table_name      = c.table_name
            AND scc.column_name     = c.column_name
            AND scc.col_count       = 1
        ) AS is_pk,
        EXISTS (
          SELECT 1 FROM single_col_constraints scc
          WHERE scc.constraint_type = 'UNIQUE'
            AND scc.table_schema    = c.table_schema
            AND scc.table_name      = c.table_name
            AND scc.column_name     = c.column_name
            AND scc.col_count       = 1
        ) AS is_unique,
        (SELECT ref_table FROM fks
          WHERE fks.table_schema = c.table_schema
            AND fks.table_name   = c.table_name
            AND fks.column_name  = c.column_name
          LIMIT 1) AS fk_table,
        (SELECT ref_column FROM fks
          WHERE fks.table_schema = c.table_schema
            AND fks.table_name   = c.table_name
            AND fks.column_name  = c.column_name
          LIMIT 1) AS fk_column
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
      column_default: string | null;
      is_identity: string;
      max_length: number | null;
      is_pk: boolean;
      is_unique: boolean;
      fk_table: string | null;
      fk_column: string | null;
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
        isUnique: row.is_unique || row.is_pk,
        isIdentity: row.is_identity === "YES",
        hasDefault: row.column_default !== null,
        fk:
          row.fk_table && row.fk_column
            ? { table: row.fk_table, column: row.fk_column }
            : null,
        maxLength: row.max_length,
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
