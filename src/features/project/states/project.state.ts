import type { Project } from "../schemas/project.schema";

export interface ProjectSliceState {
  data: Project | null;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
}

export const initialProjectSliceState: ProjectSliceState = {
  data: null,
  fetchStatus: "idle",
};
