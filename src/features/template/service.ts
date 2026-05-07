import apiClient from "@/lib/api-client";
import { handleServiceError } from "@/lib/handle-service-error";
import {
  TemplateSchema,
  type Template,
  type TemplateSummaryPage,
  type GetTemplatesQueryParams,
} from "./schemas";
import { ResponsePaginationSchema } from "@/features/common/schemas/response-pagination";
import { TemplateSummarySchema } from "./schemas";

export const templateService = {
  async getTemplates(
    params?: GetTemplatesQueryParams,
  ): Promise<TemplateSummaryPage> {
    try {
      const { data } = await apiClient.get("/templates", { params });
      return ResponsePaginationSchema(TemplateSummarySchema).parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to load templates");
    }
  },

  async getTemplate(id: string): Promise<Template> {
    try {
      const { data } = await apiClient.get(`/templates/${id}`);
      return TemplateSchema.parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to load template");
    }
  },
};
