import apiClient from "@/lib/api-client";
import {
  ProjectSchema,
  ProjectSummarySchema,
  type Project,
  type ProjectSummaryPage,
} from "../schemas/project.schema";
import { handleServiceError } from "@/lib/handle-service-error";
import {
  ExportResultSchema,
  type ExportResult,
} from "../schemas/export-result.schema";
import { ResponsePaginationSchema } from "@/features/common/schemas/response-pagination";

export interface ProjectGetManyParams {
  page: number;
  limit: number;
  sortBy: "name" | "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
  search?: string;
}

export interface ProjectExportParams {
  format: "json" | "postgres" | "mysql";
}

export const projectService = {
  async getOneBy(id: string): Promise<Project> {
    try {
      const { data } = await apiClient.get(`/projects/${id}`);
      return ProjectSchema.parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to load project");
    }
  },

  async getManyBy(params: ProjectGetManyParams): Promise<ProjectSummaryPage> {
    try {
      const { data } = await apiClient.get("/projects", { params });
      return ResponsePaginationSchema(ProjectSummarySchema).parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to load projects");
    }
  },

  async upsert(id: string, body: object): Promise<Project> {
    try {
      const { data } = await apiClient.put(`/projects/${id}`, body);
      return ProjectSchema.parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to upsert project");
    }
  },

  async export(id: string, params: ProjectExportParams): Promise<ExportResult> {
    try {
      const { data } = await apiClient.get(`/projects/${id}/export`, {
        params,
      });
      return ExportResultSchema.parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to export project");
    }
  },
};

export default projectService;
