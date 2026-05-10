export type StatementKind =
  | "CREATE_TABLE"
  | "CREATE_INDEX"
  | "CREATE_DATABASE"
  | "ALTER_FK"
  | "ALTER_UNIQUE"
  | "UNKNOWN";

export function classifyStatement(st: string): StatementKind {
  const upper = st.toUpperCase();

  if (/^CREATE\s+TABLE\b/.test(upper)) return "CREATE_TABLE";
  if (/^CREATE\s+(UNIQUE\s+)?INDEX\b/.test(upper)) return "CREATE_INDEX";
  if (/^CREATE\s+DATABASE\b/.test(upper)) return "CREATE_DATABASE";

  if (/^ALTER\s+TABLE\b/.test(upper)) {
    if (/\bFOREIGN\s+KEY\b/.test(upper)) return "ALTER_FK";

    if (/\bUNIQUE\b/.test(upper)) return "ALTER_UNIQUE";

    return "UNKNOWN";
  }

  return "UNKNOWN";
}
