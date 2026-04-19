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
import { projectValidateRules } from "../rules";

// ─── Base Schema (shared shape) ───────────────────────────────────────────────
export const ProjectBaseSchema = z.object({
  name: z.string().catch("New Project"),
  tables: z.array(TableBaseSchema).catch([]),
  refs: z.array(BaseRefSchema).catch([]),
  indexes: z.array(BaseIndexSchema).catch([]),
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
  for (const rule of projectValidateRules) {
    rule(project, ctx);
  }
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
