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
import { ShareListSchema, type ShareList } from "../schemas/share.schema";

export interface ProjectGetManyParams {
  page: number;
  limit: number;
  sortBy: "name" | "createdAt" | "updatedAt";
  sortOrder: "asc" | "desc";
  search?: string;
}

export interface ProjectExportParams {
  format: "json" | "postgresql" | "mysql";
}

export interface ShareUpdateParams {
  userIds: string[];
  expiresAt?: string;
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

  async getSharedWithMe(params: ProjectGetManyParams): Promise<ProjectSummaryPage> {
    try {
      const { data } = await apiClient.get("/projects/shared-with-me", { params });
      return ResponsePaginationSchema(ProjectSummarySchema).parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to load shared projects");
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

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/projects/${id}`);
    } catch (error) {
      handleServiceError(error, "Failed to delete project");
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

  async getShares(projectId: string): Promise<ShareList> {
    try {
      const { data } = await apiClient.get(`/projects/${projectId}/shares`);
      return ShareListSchema.parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to load shares");
    }
  },

  async updateShares(
    projectId: string,
    params: ShareUpdateParams,
  ): Promise<ShareList> {
    try {
      const { data } = await apiClient.post(
        `/projects/${projectId}/shares`,
        params,
      );
      return ShareListSchema.parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to update shares");
    }
  },

  async revokeShares(
    projectId: string,
    userIds: string[],
  ): Promise<ShareList> {
    try {
      const { data } = await apiClient.delete(
        `/projects/${projectId}/shares`,
        { data: { userIds } },
      );
      return ShareListSchema.parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to revoke shares");
    }
  },
};

export default projectService;
