import { z } from "zod";

export const BaseEndpointSchema = z.object({
  tableName: z.string().min(1, "Table name is required"),
  fieldName: z.string().min(1, "Field name is required"),
});

export const EndpointSchema = BaseEndpointSchema;

export const EndpointPartSchema = BaseEndpointSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided",
  },
);

export type Endpoint = z.infer<typeof EndpointSchema>;
export type EndpointPart = z.infer<typeof EndpointPartSchema>;
