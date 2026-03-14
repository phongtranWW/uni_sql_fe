import type { ProjectSummary } from "./schemas";

export interface ProjectsState {
  items: ProjectSummary[];
  total: number;
  search?: string;
  page: number;
  limit: number;
  totalPages: number;
  status: "loading" | "succeeded" | "failed";
  error: string | null;
}

export const initialProjects: ProjectsState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  status: "loading",
  error: null,
};
