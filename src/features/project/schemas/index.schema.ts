import { nanoidAlpabet } from "@/utils/nanoid-alpabet";
import { z } from "zod";

export const BaseIndexSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(63, "Name must be at most 63 characters.")
    .regex(
      /^[a-z_][a-z0-9_]*$/,
      "Name must start with a letter or underscore, and contain only lowercase letters, numbers, or underscores.",
    ),
  tableName: z.string().min(1, "Table name is required"),
  fields: z
    .array(z.string().min(1, "Field name is required"))
    .min(1, "At least one field is required")
    .refine((fields) => new Set(fields).size === fields.length, {
      message: "Fields must be unique",
      path: ["fields"],
    }),
  unique: z.boolean(),
});
export const IndexSchema = BaseIndexSchema;
export const IndexCreateSchema = BaseIndexSchema.extend({
  name: z.string().default(() => `idx_${nanoidAlpabet(3)}`),
  unique: z.boolean().default(false),
});
export const IndexReplaceSchema = BaseIndexSchema;
export const IndexPartSchema = BaseIndexSchema.pick({
  name: true,
  fields: true,
  unique: true,
})
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type Index = z.infer<typeof IndexSchema>;
export type IndexCreate = z.infer<typeof IndexCreateSchema>;
export type IndexReplace = z.infer<typeof IndexReplaceSchema>;
export type IndexPart = z.infer<typeof IndexPartSchema>;
