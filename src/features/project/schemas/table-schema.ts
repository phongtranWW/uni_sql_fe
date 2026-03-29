import { z } from "zod";
import { FieldSchema } from "./field-schema";
import { TABLE_HEADER_COLORS } from "@/constants/table-header-colors";
import { FIELD_TYPES } from "@/constants/field-types";
import { nanoidAlpabet } from "@/utils/nanoid-alpabet";

const BaseTableSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(63, "Name must be at most 63 characters.")
    .regex(
      /^[a-z_][a-z0-9_]*$/,
      "Name must start with a letter or underscore, and contain only lowercase letters, numbers, or underscores.",
    ),
  fields: z.array(FieldSchema).refine(
    (fields) => {
      const names = fields.map((f) => f.name);
      return new Set(names).size === names.length;
    },
    {
      message: "Field names must be unique",
      path: ["fields"],
    },
  ),
  headerColor: z.string(),
  alias: z.string().nullable(),
  isSelected: z.boolean(),
});
export const TableSchema = BaseTableSchema;
export const TableCreateSchema = BaseTableSchema.extend({
  name: z.string().default(() => `table_${nanoidAlpabet(3)}`),
  fields: z.array(FieldSchema).default(() => [
    {
      name: "id",
      type: FIELD_TYPES[0],
      pk: true,
      unique: false,
      not_null: true,
      increment: true,
    },
  ]),
  headerColor: z.string().default(TABLE_HEADER_COLORS.SLATE),
  alias: z.string().nullable().default(null),
  isSelected: z.boolean().default(false),
});
export const TableReplaceSchema = BaseTableSchema;
export const TablePartSchema = BaseTableSchema.pick({
  name: true,
  alias: true,
  headerColor: true,
})
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
export type Table = z.infer<typeof TableSchema>;
export type TableCreate = z.infer<typeof TableCreateSchema>;
export type TableReplace = z.infer<typeof TableReplaceSchema>;
export type TablePart = z.infer<typeof TablePartSchema>;
