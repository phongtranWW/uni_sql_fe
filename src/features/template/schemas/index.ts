import { z } from "zod";
import { ProjectSchema } from "@/features/project/schemas/project.schema";
import { ResponsePaginationSchema } from "@/features/common/schemas/response-pagination";

export const TemplateAuthorSchema = z.object({
  name: z.string(),
  avatar: z.string().nullable().optional(),
});

export const TemplateSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  image: z.string().nullable().optional(),
  projectId: z.string(),
  authorId: z.string(),
  author: TemplateAuthorSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const TemplateSchema = TemplateSummarySchema.extend({
  project: ProjectSchema.extend({
    id: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

export type TemplateSummary = z.infer<typeof TemplateSummarySchema>;
export type Template = z.infer<typeof TemplateSchema>;
export type TemplateSummaryPage = z.infer<
  ReturnType<typeof ResponsePaginationSchema<typeof TemplateSummarySchema>>
>;

export const GetTemplatesQueryParamsSchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type GetTemplatesQueryParams = z.infer<typeof GetTemplatesQueryParamsSchema>;
