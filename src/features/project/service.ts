import apiClient from "@/lib/api-client";
import type { Table } from "./schemas/table";
import type { Ref } from "./schemas/ref";

export interface ProjectDto {
  id: string;
  name: string;
  tables: Table[];
  refs: Ref[];
}

export interface ProjectUpsertDto {
  name: string;
  tables: Table[];
  refs: Ref[];
}

export const projectService = {
  async getById(id: string): Promise<ProjectDto> {
    const { data } = await apiClient.get<ProjectDto>(`/projects/${id}`);
    return data;
  },

  async upsert(id: string, database: ProjectUpsertDto): Promise<ProjectDto> {
    const { data } = await apiClient.put<ProjectDto>(
      `/projects/${id}`,
      database,
    );
    return data;
  },
};
