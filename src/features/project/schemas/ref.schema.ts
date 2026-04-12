import { z } from "zod";
import {
  BaseEndpointSchema,
  EndpointSchema,
  EndpointValidateSchema,
} from "./endpoint.schema";

export const REF_OPERATOR = {
  ONE_TO_ONE: "-",
  ONE_TO_MANY: ">",
  MANY_TO_ONE: "<",
} as const;

export type RefOperator = (typeof REF_OPERATOR)[keyof typeof REF_OPERATOR];

// ─── Base Schema (shared shape) ───────────────────────────────────────────────
export const BaseRefSchema = z.object({
  name: z.string(),
  endpoints: z.array(BaseEndpointSchema),
  operator: z.string(),
});

// ─── State Schema (Redux) ─────────────────────────────────────────────────────
export const RefSchema = BaseRefSchema.extend({
  isSelected: z.boolean(),
  endpoints: z.array(EndpointSchema),
});
export const RefCreateSchema = BaseRefSchema.extend({
  isSelected: z.boolean().default(false),
  operator: z.string().default(REF_OPERATOR.ONE_TO_ONE),
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
  operator: z.enum([
    REF_OPERATOR.ONE_TO_ONE,
    REF_OPERATOR.ONE_TO_MANY,
    REF_OPERATOR.MANY_TO_ONE,
  ]),
});

export type Ref = z.infer<typeof RefSchema>;
export type RefCreate = z.infer<typeof RefCreateSchema>;
export type RefReplace = z.infer<typeof RefReplaceSchema>;
export type RefPart = z.infer<typeof RefPartSchema>;
export type RefValidate = z.infer<typeof RefValidateSchema>;
