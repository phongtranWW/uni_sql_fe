export type StatementKind =
  | "CREATE_TABLE"
  | "CREATE_INDEX"
  | "CREATE_DATABASE"
  | "ALTER_FK"
  | "ALTER_UNIQUE"
  | "UNKNOWN";

/**
 * Classify a single normalized SQL statement (no trailing semicolon).
 * All comparisons are case-insensitive.
 */
export function classifyStatement(st: string): StatementKind {
  const upper = st.toUpperCase();

  if (/^CREATE\s+TABLE\b/.test(upper)) return "CREATE_TABLE";
  if (/^CREATE\s+(UNIQUE\s+)?INDEX\b/.test(upper)) return "CREATE_INDEX";
  if (/^CREATE\s+DATABASE\b/.test(upper)) return "CREATE_DATABASE";

  if (/^ALTER\s+TABLE\b/.test(upper)) {
    // FOREIGN KEY must be checked before UNIQUE because a FK constraint
    // line never contains UNIQUE, but let's be explicit anyway.
    if (/\bFOREIGN\s+KEY\b/.test(upper)) return "ALTER_FK";

    // Postgres: ADD CONSTRAINT <name> UNIQUE (...)
    // MySQL:    ADD UNIQUE <name> (...)
    if (/\bUNIQUE\b/.test(upper)) return "ALTER_UNIQUE";

    return "UNKNOWN";
  }

  return "UNKNOWN";
}
