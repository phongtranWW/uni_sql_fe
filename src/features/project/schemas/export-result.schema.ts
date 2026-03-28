import { z } from "zod";

export const EXPORT_FORMAT = ["json", "postgresql", "mysql"] as const;

export const ExportResultSchema = z.object({
  format: z.enum(EXPORT_FORMAT),
  content: z.string(),
});

export type ExportResult = z.infer<typeof ExportResultSchema>;
