import { FIELD_TYPES } from "@/constants/field-types";
import { nanoidAlpabet } from "@/utils/nanoid-alpabet";
import { z } from "zod";

// ─── Base Schema (shared shape) ───────────────────────────────────────────────
export const FieldBaseSchema = z.object({
  name: z.string(),
  type: z.string(),
  unique: z.boolean(),
  pk: z.boolean(),
  not_null: z.boolean(),
  increment: z.boolean(),
});

// ─── State Schema (Redux, light validation) ───────────────────────────────────
export const FieldSchema = FieldBaseSchema;
export const FieldCreateSchema = FieldBaseSchema.extend({
  name: z.string().default(() => `field_${nanoidAlpabet(3)}`),
  type: z.string().default(FIELD_TYPES[0]),
  unique: z.boolean().default(false),
  pk: z.boolean().default(false),
  not_null: z.boolean().default(false),
  increment: z.boolean().default(false),
});
export const FieldReplaceSchema = FieldSchema;
export const FieldPartSchema = FieldSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided" },
);

// ─── Validate Schema (strict validation) ─────────────────────────────────────
export const FieldValidateSchema = FieldBaseSchema.extend({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(50, "Name must be at most 50 characters.")
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
      message:
        "Name must start with a letter or underscore, and contain only letters, numbers, or underscores.",
    }),
  type: z.enum(FIELD_TYPES),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type Field = z.infer<typeof FieldSchema>;
export type FieldCreate = z.infer<typeof FieldCreateSchema>;
export type FieldReplace = z.infer<typeof FieldReplaceSchema>;
export type FieldPart = z.infer<typeof FieldPartSchema>;
export type FieldValidate = z.infer<typeof FieldValidateSchema>;
