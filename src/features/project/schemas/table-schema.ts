import { object, z } from "zod";
import {
  FieldBaseSchema,
  FieldSchema,
  FieldValidateSchema,
} from "./field-schema";
import { TABLE_HEADER_COLORS } from "@/constants/table-header-colors";
import { FIELD_TYPES } from "@/constants/field-types";
import { nanoidAlpabet } from "@/utils/nanoid-alpabet";
import { RESERVED_KEYWORDS } from "@/constants/reserved-keywords";

// ─── Base Schema (shared shape) ───────────────────────────────────────────────
export const TableBaseSchema = z.object({
  name: z.string().catch(() => `table_${nanoidAlpabet(3)}`),
  fields: z.array(FieldBaseSchema).catch([]),
  alias: z.string().nullable().catch(null),
});

// ─── State Schema (Redux) ─────────────────────────────────────────────────────
export const TableSchema = TableBaseSchema.extend({
  headerColor: z
    .string()
    .catch(
      () =>
        TABLE_HEADER_COLORS[
          Math.floor(Math.random() * TABLE_HEADER_COLORS.length)
        ],
    ),
  isSelected: z.boolean().catch(false),
  fields: z.array(FieldSchema).catch([]),
  position: object({
    x: z.number().catch(() => Math.floor(Math.random() * 100)),
    y: z.number().catch(() => Math.floor(Math.random() * 100)),
  }).catch({
    x: Math.floor(Math.random() * 100),
    y: Math.floor(Math.random() * 100),
  }),
});

export const TableCreateSchema = TableBaseSchema.extend({
  name: z.string().default(() => `table_${nanoidAlpabet(3)}`),
  fields: z.array(FieldSchema).default(() => [
    {
      name: "id",
      type: FIELD_TYPES[0],
      pk: true,
      unique: false,
      not_null: true,
      increment: true,
      default: null,
    },
  ]),
  headerColor: z
    .string()
    .default(
      () =>
        TABLE_HEADER_COLORS[
          Math.floor(Math.random() * TABLE_HEADER_COLORS.length)
        ],
    ),
  alias: z.string().nullable().default(null),
  isSelected: z.boolean().default(false),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .default({ x: 0, y: 100 }),
});
export const TableReplaceSchema = TableSchema;
export const TablePartSchema = TableSchema.pick({
  name: true,
  alias: true,
  headerColor: true,
  position: true,
})
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// ─── Validate Schema (strict validation) ─────────────────────────────────────
export const TableValidateSchema = TableBaseSchema.extend({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(63, "Name must be at most 63 characters.")
    .regex(
      /^[a-z_][a-z0-9_]*$/,
      "Name must start with a letter or underscore, and contain only lowercase letters, numbers, or underscores.",
    )
    .refine((name) => !RESERVED_KEYWORDS.includes(name.toLowerCase()), {
      message: "Name cannot be a reserved keyword.",
    }),
  fields: z.record(z.string(), FieldValidateSchema),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type Table = z.infer<typeof TableSchema>;
export type TableCreate = z.infer<typeof TableCreateSchema>;
export type TableReplace = z.infer<typeof TableReplaceSchema>;
export type TablePart = z.infer<typeof TablePartSchema>;
export type TableValidate = z.infer<typeof TableValidateSchema>;
