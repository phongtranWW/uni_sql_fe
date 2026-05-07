import { RESERVED_KEYWORDS } from "@/constants/reserved-keywords";
import { nanoidAlpabet } from "@/utils/nanoid-alpabet";
import { z } from "zod";

// ─── Base Schema (shared shape) ───────────────────────────────────────────────
export const BaseEndpointSchema = z.object({
  tableName: z.string().catch(() => `table_${nanoidAlpabet(3)}`),
  fieldName: z.string().catch(() => `field_${nanoidAlpabet(3)}`),
});

// ─── State Schema (Redux) ─────────────────────────────────────────────────────
export const EndpointSchema = BaseEndpointSchema;

// ─── Validate Schema (strict validation) ─────────────────────────────────────
export const EndpointValidateSchema = BaseEndpointSchema.extend({
  tableName: z
    .string()
    .min(1, "Table name is required.")
    .refine((name) => !RESERVED_KEYWORDS.includes(name.toLowerCase()), {
      message: "Table name cannot be a reserved keyword.",
    }),
  fieldName: z
    .string()
    .min(1, "Field name is required.")
    .refine((name) => !RESERVED_KEYWORDS.includes(name.toLowerCase()), {
      message: "Field name cannot be a reserved keyword.",
    }),
});

export type Endpoint = z.infer<typeof EndpointSchema>;
export type EndpointValidate = z.infer<typeof EndpointValidateSchema>;
