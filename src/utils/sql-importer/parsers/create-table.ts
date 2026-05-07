import { z } from "zod";
import { stripIdentifier, splitTopLevelCommas } from "../normalize";
import type { ImportWarning } from "../types";

// ─── Intermediate AST schemas ─────────────────────────────────────────────────

const ParsedFieldSchema = z.object({
  name: z.string(),
  rawType: z.string(),
  pk: z.boolean(),
  not_null: z.boolean(),
  unique: z.boolean(),
  increment: z.boolean(),
  default: z.string().nullable(),
});

const ParsedTableSchema = z.object({
  name: z.string(),
  fields: z.array(ParsedFieldSchema),
});

export type ParsedField = z.infer<typeof ParsedFieldSchema>;
export type ParsedTable = z.infer<typeof ParsedTableSchema>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Keywords that mark the start of a constraint clause in a field definition.
 * Everything before the first match is the raw SQL type.
 */
const CONSTRAINT_BOUNDARY_RE =
  /\b(PRIMARY|NOT|UNIQUE|DEFAULT|AUTO_INCREMENT|GENERATED|REFERENCES|CHECK)\b/i;

/**
 * Table-level clause starters — lines beginning with these are NOT field
 * definitions and should be skipped.
 */
const TABLE_LEVEL_RE =
  /^\s*(PRIMARY\s+KEY|UNIQUE\s*[\(]|CONSTRAINT\s|KEY\s|INDEX\s|FOREIGN\s+KEY)/i;

/**
 * Extract the table name and the raw body between the outer parentheses of a
 * CREATE TABLE statement.
 */
function extractTableParts(
  st: string,
): { tableName: string; body: string } | null {
  const firstParen = st.indexOf("(");
  if (firstParen === -1) return null;

  const nameMatch = st
    .slice(0, firstParen)
    .match(/CREATE\s+TABLE\s+(\S+)/i);
  if (!nameMatch?.[1]) return null;

  // Find the closing paren that matches the first opening paren.
  let depth = 0;
  let bodyEnd = -1;
  for (let i = firstParen; i < st.length; i++) {
    if (st[i] === "(") depth++;
    else if (st[i] === ")") {
      depth--;
      if (depth === 0) {
        bodyEnd = i;
        break;
      }
    }
  }
  if (bodyEnd === -1) return null;

  return {
    tableName: stripIdentifier(nameMatch[1]),
    body: st.slice(firstParen + 1, bodyEnd),
  };
}

/**
 * Given the part of a field line AFTER the field name, split it into:
 * - `rawType`: the SQL type expression (everything before the first constraint keyword)
 * - `rest`: the constraint clause string
 */
function extractRawType(afterName: string): { rawType: string; rest: string } {
  const match = afterName.match(CONSTRAINT_BOUNDARY_RE);
  if (match?.index !== undefined) {
    return {
      rawType: afterName.slice(0, match.index).trim(),
      rest: afterName.slice(match.index),
    };
  }
  return { rawType: afterName.trim(), rest: "" };
}

/**
 * Extract the DEFAULT value literal from the constraint clause.
 * Handles:
 *  - Quoted strings: DEFAULT 'hello' or DEFAULT 'it''s'
 *  - Bare values:    DEFAULT 42, DEFAULT CURRENT_TIMESTAMP, DEFAULT NOW()
 */
function extractDefault(rest: string): string | null {
  // Match DEFAULT followed by a quoted string or a bare token (may include parentheses)
  const match = rest.match(
    /\bDEFAULT\s+('(?:''|[^'])*'|\S+(?:\([^)]*\))?)/i,
  );
  return match?.[1] ?? null;
}

// ─── Public parser ────────────────────────────────────────────────────────────

export function parseCreateTable(
  st: string,
  warnings: ImportWarning[],
): ParsedTable | null {
  const parts = extractTableParts(st);
  if (!parts) {
    warnings.push({
      code: "PARSE_ERROR",
      message: "Could not extract table name or body from CREATE TABLE",
      statement: st.slice(0, 80),
    });
    return null;
  }

  const { tableName, body } = parts;
  const lines = splitTopLevelCommas(body);
  const fields: ParsedField[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Skip table-level constraints (PRIMARY KEY (...), UNIQUE (...), etc.)
    if (TABLE_LEVEL_RE.test(trimmed)) {
      if (/^\s*PRIMARY\s+KEY/i.test(trimmed)) {
        warnings.push({
          code: "COMPOSITE_PK",
          message: `Table "${tableName}" has a table-level PRIMARY KEY constraint — field-level pk flags are preserved where detected`,
          statement: trimmed.slice(0, 80),
        });
      }
      continue;
    }

    // First token = field name
    const spaceIdx = trimmed.search(/\s/);
    if (spaceIdx === -1) continue; // bare token with no type — skip

    const rawName = trimmed.slice(0, spaceIdx);
    const afterName = trimmed.slice(spaceIdx + 1).trim();

    const { rawType, rest } = extractRawType(afterName);

    if (!rawType) continue; // Could not determine type — skip silently

    const upperRest = rest.toUpperCase();

    // Detect inline REFERENCES (FK defined inline, not via ALTER TABLE)
    if (/\bREFERENCES\b/.test(upperRest)) {
      warnings.push({
        code: "INLINE_REFERENCES",
        message: `Field "${rawName}" in table "${tableName}" has inline REFERENCES — it has been ignored; add it as a ref manually`,
        statement: trimmed.slice(0, 80),
      });
    }

    const raw = {
      name: stripIdentifier(rawName),
      rawType,
      pk: /\bPRIMARY\s+KEY\b/.test(upperRest),
      not_null: /\bNOT\s+NULL\b/.test(upperRest),
      // UNIQUE is redundant when PK — backend skips it, but we tolerate it
      unique: /\bUNIQUE\b/.test(upperRest),
      increment:
        /\bAUTO_INCREMENT\b/.test(upperRest) ||
        /\bGENERATED\s+ALWAYS\s+AS\s+IDENTITY\b/.test(upperRest),
      default: extractDefault(rest),
    };

    const result = ParsedFieldSchema.safeParse(raw);
    if (!result.success) {
      warnings.push({
        code: "PARSE_ERROR",
        message: `Field "${rawName}" in table "${tableName}" could not be parsed: ${result.error.message}`,
        statement: trimmed.slice(0, 80),
      });
      continue;
    }

    fields.push(result.data);
  }

  const tableResult = ParsedTableSchema.safeParse({ name: tableName, fields });
  if (!tableResult.success) {
    warnings.push({
      code: "PARSE_ERROR",
      message: `Table "${tableName}" failed schema validation: ${tableResult.error.message}`,
      statement: st.slice(0, 80),
    });
    return null;
  }

  return tableResult.data;
}
