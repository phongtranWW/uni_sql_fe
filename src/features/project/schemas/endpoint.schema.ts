import { z } from "zod";
export const EndpointSchema = z.object({
  tableName: z.string(),
  fieldName: z.string(),
});

export type Endpoint = z.infer<typeof EndpointSchema>;
