import type { Project } from "../schemas/project.schema";

export interface ProjectSliceState {
  data: Project | null;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  saveStatus: "idle" | "saved" | "unsaved" | "saving";
}

export const initialProjectSliceState: ProjectSliceState = {
  data: null,
  fetchStatus: "idle",
  saveStatus: "idle",
};
