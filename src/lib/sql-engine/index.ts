import { PgliteEngine } from "./engines/pglite-engine";
import type { SqlDialect, SqlEngine } from "./types";

export type {
  QueryError,
  QueryField,
  QueryResult,
  SchemaColumn,
  SchemaTable,
  SqlDialect,
  SqlEngine,
} from "./types";

export { isQueryError } from "./types";

/**
 * Returns true when the playground UI can offer a "Run" experience for the
 * given dialect. Used by the editor to decide whether to show "Test SQL".
 */
export function isPlaygroundSupported(dialect: SqlDialect): boolean {
  return dialect === "postgresql";
}

/**
 * Factory: instantiate an engine for the given dialect.
 *
 * Throws when the dialect has no engine yet — callers should first guard
 * with `isPlaygroundSupported()`.
 */
export function createEngine(dialect: SqlDialect): SqlEngine {
  switch (dialect) {
    case "postgresql":
      return new PgliteEngine();
    case "mysql":
    case "sqlite":
      throw new Error(`Playground engine for "${dialect}" not implemented yet`);
    default: {
      const _exhaustive: never = dialect;
      throw new Error(`Unknown SQL dialect: ${String(_exhaustive)}`);
    }
  }
}
