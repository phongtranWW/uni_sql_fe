import { z } from "zod";
import { REF_OPERATOR, type RefOperator } from "@/constants/ref-operator";
import {
  BaseEndpointSchema,
  EndpointSchema,
  EndpointValidateSchema,
} from "./endpoint.schema";
import { nanoidAlpabet } from "@/utils/nanoid-alpabet";

export type { RefOperator };

// ─── Base Schema (shared shape) ───────────────────────────────────────────────
export const BaseRefSchema = z.object({
  name: z.string().catch(() => `ref_${nanoidAlpabet(3)}`),
  endpoints: z.array(BaseEndpointSchema).catch([]),
  operator: z.string().catch(REF_OPERATOR[0]),
});

// ─── State Schema (Redux) ─────────────────────────────────────────────────────
export const RefSchema = BaseRefSchema.extend({
  isSelected: z.boolean().catch(false),
  endpoints: z.array(EndpointSchema).catch([]),
});
export const RefCreateSchema = BaseRefSchema.extend({
  isSelected: z.boolean().default(false),
  operator: z.string().default(REF_OPERATOR[0]),
});
export const RefReplaceSchema = RefSchema;
export const RefPartSchema = RefSchema.pick({
  name: true,
  isSelected: true,
  operator: true,
  endpoints: true,
})
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// ─── Validate Schema (strict validation) ─────────────────────────────────────
export const RefValidateSchema = BaseRefSchema.extend({
  name: z
    .string()
    .min(1, "Name is required.")
    .max(63, "Name must be at most 63 characters.")
    .regex(
      /^[a-z_][a-z0-9_]*$/,
      "Name must start with a letter or underscore, and contain only lowercase letters, numbers, or underscores.",
    ),
  endpoints: z.object({
    from: EndpointValidateSchema,
    to: EndpointValidateSchema,
  }),
  operator: z.enum(REF_OPERATOR),
});

export type Ref = z.infer<typeof RefSchema>;
export type RefCreate = z.infer<typeof RefCreateSchema>;
export type RefReplace = z.infer<typeof RefReplaceSchema>;
export type RefPart = z.infer<typeof RefPartSchema>;
export type RefValidate = z.infer<typeof RefValidateSchema>;
