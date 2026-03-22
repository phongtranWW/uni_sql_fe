import { z } from "zod";

export const FieldSchema = z.object({
  name: z.string(),
  type: z.string(),
  unique: z.boolean(),
  pk: z.boolean(),
  not_null: z.boolean(),
  increment: z.boolean(),
});

export type Field = z.infer<typeof FieldSchema>;
export type FieldCreate = Field;
export type FieldUpdate = Partial<FieldCreate>;
