import { z } from "zod";
import { FieldSchema } from "./field-schema";

const nameIdentifierSchema = z
  .string()
  .min(1, "Name is required.")
  .max(63, "Name must be at most 63 characters.")
  .regex(
    /^[a-z_][a-z0-9_]*$/,
    "Name must start with a letter or underscore, and contain only lowercase letters, numbers, or underscores.",
  );

export const TABLE_HEADER_COLORS = {
  SLATE: "#64748B",
  BLUE: "#3B82F6",
  SKY: "#0EA5E9",
  EMERALD: "#10B981",
  TEAL: "#14B8A6",
  AMBER: "#F59E0B",
  ORANGE: "#F97316",
  ROSE: "#F43F5E",
  VIOLET: "#8B5CF6",
  FUCHSIA: "#D946EF",
} as const;

export const TableSchema = z.object({
  name: nameIdentifierSchema,
  fields: z.array(FieldSchema),
  headerColor: z.string(),
  isSelected: z.boolean(),
  alias: z.string().nullable(),
});

export const TableUpdateSchema = TableSchema.pick({
  name: true,
  alias: true,
  headerColor: true,
  isSelected: true,
}).partial();

export type Table = z.infer<typeof TableSchema>;
export type TableCreate = Omit<Table, "fields">;
export type TableUpdate = z.infer<typeof TableUpdateSchema>;
