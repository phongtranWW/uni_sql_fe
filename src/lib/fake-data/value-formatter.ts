import type { FieldType } from "@/constants/field-types";

/**
 * Convert a JavaScript value into a PostgreSQL literal suitable for embedding
 * directly into an INSERT statement.
 *
 * Strings are single-quoted and `'` is doubled (`''`). Numbers/booleans use
 * the engine's default rendering. Dates that are still `Date` instances get
 * coerced via `toISOString()`; in practice the generators in `faker-mapper`
 * already pre-format date types as strings.
 *
 * NULL handling is centralised here so callers don't have to special-case it
 * for every field type.
 */
export function toSqlLiteral(value: unknown, fieldType: FieldType): string {
  if (value === null || value === undefined) return "NULL";

  switch (fieldType) {
    case "BOOLEAN":
      return value ? "TRUE" : "FALSE";

    case "INT":
    case "FLOAT":
    case "DOUBLE":
    case "DECIMAL":
      // Numbers are emitted as-is. faker.finance.amount returns a string,
      // which is also fine for PG (NUMERIC accepts string literals).
      if (typeof value === "string") return value;
      return String(value);

    case "UUID":
    case "CHAR":
    case "VARCHAR":
    case "TEXT":
    case "DATE":
    case "TIME":
    case "DATETIME":
    case "TIMESTAMP": {
      const s =
        value instanceof Date ? value.toISOString() : String(value);
      return `'${escapeSqlString(s)}'`;
    }
  }
}

/**
 * Quote an identifier (table or column name) for PostgreSQL.
 *
 * Always double-quoted so reserved words (`user`, `order`, …) and case-
 * sensitive names work. Embedded `"` is doubled per SQL spec.
 */
export function quoteIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

function escapeSqlString(s: string): string {
  return s.replace(/'/g, "''");
}
