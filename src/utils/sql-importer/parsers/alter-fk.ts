import { z } from "zod";
import { stripIdentifier } from "../normalize";
import type { ImportWarning } from "../types";

// ─── Intermediate AST schema ──────────────────────────────────────────────────

const ParsedFkSchema = z.object({
  name: z.string(),
  fromTable: z.string(),
  fromField: z.string(),
  toTable: z.string(),
  toField: z.string(),
});

export type ParsedFk = z.infer<typeof ParsedFkSchema>;

// ─── Public parser ────────────────────────────────────────────────────────────

/**
 * Parses (both PostgreSQL and MySQL):
 *   ALTER TABLE <table> ADD CONSTRAINT <name> FOREIGN KEY (<field>) REFERENCES <refTable>(<refField>)
 */
export function parseAlterForeignKey(
  st: string,
  warnings: ImportWarning[],
): ParsedFk | null {
  const match = st.match(
    /^ALTER\s+TABLE\s+(\S+)\s+ADD\s+CONSTRAINT\s+(\S+)\s+FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s+(\S+)\s*\(([^)]+)\)/i,
  );

  if (!match) {
    warnings.push({
      code: "PARSE_ERROR",
      message: "Could not parse ALTER TABLE … FOREIGN KEY statement",
      statement: st.slice(0, 80),
    });
    return null;
  }

  const raw = {
    name: stripIdentifier(match[2]),
    fromTable: stripIdentifier(match[1]),
    fromField: stripIdentifier(match[3]),
    toTable: stripIdentifier(match[4]),
    toField: stripIdentifier(match[5]),
  };

  const result = ParsedFkSchema.safeParse(raw);
  if (!result.success) {
    warnings.push({
      code: "PARSE_ERROR",
      message: `ALTER FK parse failed: ${result.error.message}`,
      statement: st.slice(0, 80),
    });
    return null;
  }

  return result.data;
}
