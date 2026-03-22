import { z } from "zod";
import { EndpointSchema } from "./endpoint.schema";

export const REF_OPERATOR = {
  ONE_TO_ONE: "-",
  ONE_TO_MANY: ">",
  MANY_TO_ONE: "<",
} as const;

export type RefOperator = (typeof REF_OPERATOR)[keyof typeof REF_OPERATOR];

export const RefSchema = z.object({
  name: z.string(),
  isSelected: z.boolean(),
  endpoints: z.array(EndpointSchema),
  operator: z.enum(REF_OPERATOR),
});

export type Ref = z.infer<typeof RefSchema>;
export type RefCreate = Ref;
export type RefUpdate = Partial<Ref>;
