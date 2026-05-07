import { z } from "zod";
import { stripIdentifier } from "../normalize";
import type { ImportWarning } from "../types";

// ─── Intermediate AST schema ──────────────────────────────────────────────────

const ParsedIndexSchema = z.object({
  name: z.string(),
  tableName: z.string(),
  fields: z.array(z.string()).min(1),
  unique: z.boolean(),
});

export type ParsedIndex = z.infer<typeof ParsedIndexSchema>;

// ─── Public parser ────────────────────────────────────────────────────────────

/**
 * Parses:
 *   CREATE [UNIQUE] INDEX <name> ON <table> (<field1>, <field2>, ...)
 */
export function parseCreateIndex(
  st: string,
  warnings: ImportWarning[],
): ParsedIndex | null {
  const match = st.match(
    /^CREATE\s+(UNIQUE\s+)?INDEX\s+(\S+)\s+ON\s+(\S+)\s*\(([^)]+)\)/i,
  );

  if (!match) {
    warnings.push({
      code: "PARSE_ERROR",
      message: "Could not parse CREATE INDEX statement",
      statement: st.slice(0, 80),
    });
    return null;
  }

  const raw = {
    unique: Boolean(match[1]),
    name: stripIdentifier(match[2]),
    tableName: stripIdentifier(match[3]),
    fields: match[4].split(",").map((f) => stripIdentifier(f)),
  };

  const result = ParsedIndexSchema.safeParse(raw);
  if (!result.success) {
    warnings.push({
      code: "PARSE_ERROR",
      message: `CREATE INDEX parse failed: ${result.error.message}`,
      statement: st.slice(0, 80),
    });
    return null;
  }

  return result.data;
}
