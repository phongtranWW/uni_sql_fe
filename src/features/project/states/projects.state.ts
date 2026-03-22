import type { ProjectSummary } from "../schemas/project.schema";

export interface ProjectsSliceState {
  items: ProjectSummary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
}

export const initialProjectsSliceState: ProjectsSliceState = {
  items: [],
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  fetchStatus: "idle",
};
