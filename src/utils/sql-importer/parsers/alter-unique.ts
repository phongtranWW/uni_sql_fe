import { z } from "zod";
import { stripIdentifier } from "../normalize";
import type { ImportWarning } from "../types";

// ─── Intermediate AST schema ──────────────────────────────────────────────────

const ParsedUniqueSchema = z.object({
  /**
   * The ref name extracted from the constraint name by stripping the `uq_`
   * prefix. Used by resolve-refs to detect one-to-one relationships.
   * For a constraint named `uq_my_ref`, refName = `my_ref`.
   * For a constraint not following this convention, refName = the full name.
   */
  refName: z.string(),
  table: z.string(),
  field: z.string(),
});

export type ParsedUnique = z.infer<typeof ParsedUniqueSchema>;

// ─── Public parser ────────────────────────────────────────────────────────────

/**
 * Parses the two ALTER TABLE UNIQUE forms emitted by the backend exporter
 * to mark one-to-one relationships:
 *
 * PostgreSQL:
 *   ALTER TABLE <table> ADD CONSTRAINT uq_<refName> UNIQUE (<field>)
 *
 * MySQL:
 *   ALTER TABLE <table> ADD UNIQUE uq_<refName> (<field>)
 */
export function parseAlterUnique(
  st: string,
  warnings: ImportWarning[],
): ParsedUnique | null {
  // PostgreSQL form: ADD CONSTRAINT <name> UNIQUE (<field>)
  const pgMatch = st.match(
    /^ALTER\s+TABLE\s+(\S+)\s+ADD\s+CONSTRAINT\s+(\S+)\s+UNIQUE\s*\(([^)]+)\)/i,
  );

  // MySQL form: ADD UNIQUE <name> (<field>)
  const myMatch = st.match(
    /^ALTER\s+TABLE\s+(\S+)\s+ADD\s+UNIQUE\s+(\S+)\s*\(([^)]+)\)/i,
  );

  const matched = pgMatch ?? myMatch;

  if (!matched) {
    warnings.push({
      code: "PARSE_ERROR",
      message: "Could not parse ALTER TABLE … ADD UNIQUE statement",
      statement: st.slice(0, 80),
    });
    return null;
  }

  const constraintName = stripIdentifier(matched[2]);
  const refName = constraintName.startsWith("uq_")
    ? constraintName.slice(3)
    : constraintName;

  const raw = {
    refName,
    table: stripIdentifier(matched[1]),
    field: stripIdentifier(matched[3]).trim(),
  };

  const result = ParsedUniqueSchema.safeParse(raw);
  if (!result.success) {
    warnings.push({
      code: "PARSE_ERROR",
      message: `ALTER UNIQUE parse failed: ${result.error.message}`,
      statement: st.slice(0, 80),
    });
    return null;
  }

  return result.data;
}
