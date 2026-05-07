import { RESERVED_KEYWORDS } from "@/constants/reserved-keywords";
import { nanoidAlpabet } from "@/utils/nanoid-alpabet";
import { z } from "zod";

// ─── Base Schema (shared shape) ───────────────────────────────────────────────
export const BaseIndexSchema = z.object({
  name: z.string().catch(() => `idx_${nanoidAlpabet(3)}`),
  tableName: z.string().catch(() => `table_${nanoidAlpabet(3)}`),
  fields: z.array(z.string()).catch([]),
  unique: z.boolean().catch(false),
});

// ─── State Schema (Redux, light validation) ───────────────────────────────────
export const IndexSchema = BaseIndexSchema;
export const IndexCreateSchema = BaseIndexSchema.extend({
  name: z.string().default(() => `idx_${nanoidAlpabet(3)}`),
  unique: z.boolean().default(false),
});
export const IndexReplaceSchema = IndexCreateSchema;
export const IndexPartSchema = IndexCreateSchema.pick({
  name: true,
  fields: true,
  unique: true,
})
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// ─── Validate Schema (strict validation) ─────────────────────────────────────
export const IndexValidateSchema = BaseIndexSchema.extend({
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
  tableName: z.string().min(1, "Table name is required."),
  fields: z.array(z.string()).min(1, "Fields are required."),
});

export type Index = z.infer<typeof IndexSchema>;
export type IndexCreate = z.infer<typeof IndexCreateSchema>;
export type IndexReplace = z.infer<typeof IndexReplaceSchema>;
export type IndexPart = z.infer<typeof IndexPartSchema>;
