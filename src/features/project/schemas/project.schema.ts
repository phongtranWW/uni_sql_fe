import { z } from "zod";
import { TableSchema } from "./table-schema";
import { RefSchema } from "./ref.schema";
import { ResponsePaginationSchema } from "@/features/common/schemas/response-pagination";

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  tables: z.array(TableSchema),
  refs: z.array(RefSchema),
});

export const ProjectSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;
export type ProjectSummaryPage = z.infer<
  ReturnType<typeof ResponsePaginationSchema<typeof ProjectSummarySchema>>
>;
