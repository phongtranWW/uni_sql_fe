import apiClient from "@/lib/api-client";
import type { Table } from "./schemas/table";
import type { Ref } from "./schemas/ref";

export interface DatabaseSummary {
  id: string;
  name: string;
}

export interface DatabaseDto {
  id: string;
  name: string;
  tables: Table[];
  refs: Ref[];
}

export const databaseService = {
  async getById(id: string): Promise<DatabaseDto> {
    const { data } = await apiClient.get<DatabaseDto>(`/projects/${id}`);
    return data;
  },
};
