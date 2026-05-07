import { z } from "zod";
import { TableSchema } from "@/features/project/schemas/table-schema";
import { RefSchema } from "@/features/project/schemas/ref.schema";
import { IndexSchema } from "@/features/project/schemas/index.schema";
import { normalizeSql, splitStatements } from "./normalize";
import { classifyStatement } from "./classify";
import { parseCreateTable } from "./parsers/create-table";
import { parseCreateIndex } from "./parsers/create-index";
import { parseAlterForeignKey } from "./parsers/alter-fk";
import { parseAlterUnique } from "./parsers/alter-unique";
import { resolveRefs } from "./resolve-refs";
import { mapSqlType } from "./type-map";
import type { SqlDialect, ImportWarning } from "./types";

export type { SqlDialect, ImportWarning };

// ─── Output schema ────────────────────────────────────────────────────────────

/**
 * The output shape produced by `importSqlToProject`.
 *
 * It reuses the existing Redux-level schemas (`TableSchema`, `RefSchema`,
 * `IndexSchema`) which all carry `.catch()` defaults for UI-only fields
 * (`headerColor`, `isSelected`, `position`, `alias`). Passing a raw object
 * without those fields is therefore safe — Zod fills them automatically.
 *
 * The shape intentionally omits `id` because the importer operates on the
 * *content* of a project; the current project's `id` is injected by the
 * dialog before dispatching `projectImported`.
 */
export const SqlImportOutputSchema = z.object({
  name: z.string().catch("Imported Project"),
  tables: z.array(TableSchema).catch([]),
  refs: z.array(RefSchema).catch([]),
  indexes: z.array(IndexSchema).catch([]),
});

export type SqlImportOutput = z.infer<typeof SqlImportOutputSchema>;

// ─── Main function ────────────────────────────────────────────────────────────

export interface ImportResult {
  output: SqlImportOutput;
  warnings: ImportWarning[];
}

/**
 * Parse a SQL file (PostgreSQL or MySQL, as exported by the backend) and
 * return an `SqlImportOutput` that can be merged with the current project id
 * and dispatched via `projectImported`.
 *
 * The parser is best-effort: unrecognised statements are skipped and a
 * warning is collected. It never throws.
 */
export function importSqlToProject(
  sql: string,
  dialect: SqlDialect,
  projectName = "Imported Project",
): ImportResult {
  const warnings: ImportWarning[] = [];

  const statements = splitStatements(normalizeSql(sql));

  const parsedTables = [];
  const parsedIndexes = [];
  const parsedFks = [];
  const parsedUniques = [];

  for (const st of statements) {
    const kind = classifyStatement(st);

    switch (kind) {
      case "CREATE_TABLE": {
        const r = parseCreateTable(st, warnings);
        if (r) parsedTables.push(r);
        break;
      }
      case "CREATE_INDEX": {
        const r = parseCreateIndex(st, warnings);
        if (r) parsedIndexes.push(r);
        break;
      }
      case "ALTER_FK": {
        const r = parseAlterForeignKey(st, warnings);
        if (r) parsedFks.push(r);
        break;
      }
      case "ALTER_UNIQUE": {
        const r = parseAlterUnique(st, warnings);
        if (r) parsedUniques.push(r);
        break;
      }
      case "CREATE_DATABASE":
        // Intentionally ignored — no payload needed.
        break;
      default:
        warnings.push({
          code: "UNKNOWN_STATEMENT",
          message: "Skipped unrecognised statement",
          statement: st.slice(0, 80),
        });
    }
  }

  const resolvedRefs = resolveRefs(parsedFks, parsedUniques);

  // Build a raw object using only semantically meaningful fields.
  // TableSchema / RefSchema / IndexSchema .catch() defaults fill in the rest
  // (headerColor, isSelected, position, alias …) automatically.
  const rawProject = {
    name: projectName,

    tables: parsedTables.map((t) => ({
      name: t.name,
      alias: null,
      fields: t.fields.map((f) => {
        const { fieldType, warning } = mapSqlType(f.rawType, dialect);
        if (warning) {
          warnings.push({
            code: "UNSUPPORTED_TYPE",
            message: warning,
            statement: f.rawType,
          });
        }
        return {
          name: f.name,
          type: fieldType,
          pk: f.pk,
          not_null: f.not_null,
          unique: f.unique,
          increment: f.increment,
          default: f.default,
        };
      }),
    })),

    refs: resolvedRefs.map((r) => ({
      name: r.name,
      operator: r.operator,
      endpoints: [r.from, r.to],
    })),

    indexes: parsedIndexes,
  };

  // SqlImportOutputSchema.parse() applies .catch() defaults for all missing
  // UI fields; it never throws given those fallbacks.
  const output = SqlImportOutputSchema.parse(rawProject);

  return { output, warnings };
}
