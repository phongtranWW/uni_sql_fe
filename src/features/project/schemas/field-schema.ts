import { z } from "zod";
const BaseFieldSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name must be at most 50 characters.")
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Name must start with a letter or underscore, and contain only letters, numbers, or underscores.",
    }),
  type: z.string(),
  unique: z.boolean(),
  pk: z.boolean(),
  not_null: z.boolean(),
  increment: z.boolean(),
});

export const FieldSchema = BaseFieldSchema;
export const FieldCreateSchema = BaseFieldSchema;
export const FieldReplaceSchema = BaseFieldSchema;
export const FieldPartSchema = BaseFieldSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided",
  },
);
export type Field = z.infer<typeof FieldSchema>;
export type FieldCreate = z.infer<typeof FieldCreateSchema>;
export type FieldReplace = z.infer<typeof FieldReplaceSchema>;
export type FieldPart = z.infer<typeof FieldPartSchema>;
