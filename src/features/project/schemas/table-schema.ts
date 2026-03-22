import { z } from "zod";
import { FieldSchema } from "./field-schema";

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
  name: z.string(),
  fields: z.array(FieldSchema),
  headerColor: z.string(),
  isSelected: z.boolean(),
  alias: z.string().nullable(),
});

export type Table = z.infer<typeof TableSchema>;
export type TableCreate = Omit<Table, "fields">;
export type TableUpdate = Partial<
  Pick<Table, "name" | "alias" | "headerColor" | "isSelected">
>;
