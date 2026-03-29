import { z } from "zod";
import { EndpointSchema } from "./endpoint.schema";

export const REF_OPERATOR = {
  ONE_TO_ONE: "-",
  ONE_TO_MANY: ">",
  MANY_TO_ONE: "<",
} as const;

export type RefOperator = (typeof REF_OPERATOR)[keyof typeof REF_OPERATOR];

const BaseRefSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(63, "Name must be at most 63 characters")
    .regex(/^[a-z_][a-z0-9_]*$/, "Invalid ref name format"),

  isSelected: z.boolean(),
  endpoints: z
    .array(EndpointSchema)
    .length(2, "Ref must have exactly 2 endpoints"),

  operator: z.enum(REF_OPERATOR),
});
export const RefSchema = BaseRefSchema;
export const RefCreateSchema = BaseRefSchema.extend({
  isSelected: z.boolean().default(false),
  operator: z.enum(REF_OPERATOR).default(REF_OPERATOR.ONE_TO_ONE),
});
export const RefReplaceSchema = BaseRefSchema;
export const RefPartSchema = BaseRefSchema.pick({
  name: true,
  isSelected: true,
  operator: true,
  endpoints: true,
})
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
export type Ref = z.infer<typeof RefSchema>;
export type RefCreate = z.infer<typeof RefCreateSchema>;
export type RefReplace = z.infer<typeof RefReplaceSchema>;
export type RefPart = z.infer<typeof RefPartSchema>;
