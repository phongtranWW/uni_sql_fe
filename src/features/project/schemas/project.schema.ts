import { z } from "zod";
import {
  TableBaseSchema,
  TableSchema,
  TableValidateSchema,
} from "./table-schema";
import { BaseRefSchema, RefSchema, RefValidateSchema } from "./ref.schema";
import {
  BaseIndexSchema,
  IndexSchema,
  IndexValidateSchema,
} from "./index.schema";
import { ResponsePaginationSchema } from "@/features/common/schemas/response-pagination";

// ─── Base Schema (shared shape) ───────────────────────────────────────────────
export const ProjectBaseSchema = z.object({
  name: z.string(),
  tables: z.array(TableBaseSchema),
  refs: z.array(BaseRefSchema),
  indexes: z.array(BaseIndexSchema),
});

// ─── State Schema (Redux) ─────────────────────────────────────────────────────
export const ProjectSchema = ProjectBaseSchema.extend({
  name: z.string(),
  tables: z.array(TableSchema).default([]),
  refs: z.array(RefSchema).default([]),
  indexes: z.array(IndexSchema).default([]),
});

// ─── Validate Schema (strict validation) ─────────────────────────────────────
export const ProjectValidateSchema = ProjectBaseSchema.extend({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(63, "Name must be at most 63 characters.")
    .regex(
      /^[A-Za-z][a-z0-9_]*$/,
      "Name must start with a letter or underscore, and contain only lowercase letters, numbers, or underscores.",
    ),
  tables: z
    .array(TableSchema)
    .transform((tables) =>
      Object.fromEntries(
        tables.map((t) => [
          t.name,
          {
            name: t.name,
            alias: t.alias,
            fields: Object.fromEntries(t.fields.map((f) => [f.name, f])),
          },
        ]),
      ),
    )
    .pipe(z.record(z.string(), TableValidateSchema)),
  refs: z
    .array(RefSchema)
    .transform((refs) =>
      Object.fromEntries(
        refs.map((r) => [
          r.name,
          {
            name: r.name,
            operator: r.operator,
            endpoints: {
              from: {
                tableName: r.endpoints[0].tableName,
                fieldName: r.endpoints[0].fieldName,
              },
              to: {
                tableName: r.endpoints[1].tableName,
                fieldName: r.endpoints[1].fieldName,
              },
            },
          },
        ]),
      ),
    )
    .pipe(z.record(z.string(), RefValidateSchema)),
  indexes: z
    .array(IndexSchema)
    .transform((indexes) =>
      Object.fromEntries(
        indexes.map((i) => [
          i.name,
          {
            name: i.name,
            tableName: i.tableName,
            fields: i.fields,
            unique: i.unique,
          },
        ]),
      ),
    )
    .pipe(z.record(z.string(), IndexValidateSchema)),
}).superRefine((project, ctx) => {
  // [REF - 01] Ensure all referenced tables exist
  Object.entries(project.refs).forEach(([refName, ref]) => {
    const { from, to } = ref.endpoints;
    if (!project.tables[from.tableName]) {
      ctx.addIssue({
        code: "custom",
        message: `Table "${from.tableName}" does not exist`,
        path: ["refs", refName, "endpoints", "from", "tableName"],
      });
    }
    if (!project.tables[to.tableName]) {
      ctx.addIssue({
        code: "custom",
        message: `Table "${to.tableName}" does not exist`,
        path: ["refs", refName, "endpoints", "to", "tableName"],
      });
    }
  });

  // [REF - 02] Ensure all referenced fields exist
  Object.entries(project.refs).forEach(([refName, ref]) => {
    const { from, to } = ref.endpoints;
    const fromField = project.tables[from.tableName]?.fields[from.fieldName];
    const toField = project.tables[to.tableName]?.fields[to.fieldName];
    if (!fromField || !toField) return;
    if (fromField.type !== toField.type) {
      ctx.addIssue({
        code: "custom",
        message: `Field types do not match: "${from.tableName}.${from.fieldName}" (${fromField.type}) and "${to.tableName}.${to.fieldName}" (${toField.type})`,
        path: ["refs", refName],
      });
    }
  });

  // [INDEX - 01] Ensure all referenced tables exist
  Object.entries(project.indexes).forEach(([indexName, index]) => {
    if (!project.tables[index.tableName]) {
      ctx.addIssue({
        code: "custom",
        message: `Table "${index.tableName}" does not exist`,
        path: ["indexes", indexName, "tableName"],
      });
    }
  });

  // [INDEX - 02] Ensure all referenced fields exist
  Object.entries(project.indexes).forEach(([indexName, index]) => {
    const table = project.tables[index.tableName];
    if (!table) return;
    index.fields.forEach((field, j) => {
      if (!table.fields[field]) {
        ctx.addIssue({
          code: "custom",
          message: `Field "${field}" does not exist in table "${index.tableName}"`,
          path: ["indexes", indexName, "fields", j],
        });
      }
    });
  });

  // [INDEX - 03] Ensure all fields are unique
  Object.entries(project.indexes).forEach(([indexName, index]) => {
    const seen = new Set<string>();
    index.fields.forEach((field, j) => {
      if (seen.has(field)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate field "${field}" in index "${indexName}"`,
          path: ["indexes", indexName, "fields", j],
        });
      }
      seen.add(field);
    });
  });

  // [INDEX - 04] Ensure all indexes are unique
  const seen = new Set<string>();
  Object.entries(project.indexes).forEach(([indexName, index]) => {
    const signature = `${index.tableName}::${[...index.fields].sort().join(",")}`;
    if (seen.has(signature)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate index on fields (${index.fields.join(", ")}) in table "${index.tableName}"`,
        path: ["indexes", indexName],
      });
    }
    seen.add(signature);
  });
});

// ─── Exports ─────────────────────────────────────────────────────────────────
export const ProjectSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;
export type ProjectSummaryPage = z.infer<
  ReturnType<typeof ResponsePaginationSchema<typeof ProjectSummarySchema>>
>;
