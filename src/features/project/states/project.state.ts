import type { Project } from "../schemas/project.schema";

export interface ProjectSliceState {
  data: Project | null;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  saveStatus: "idle" | "saving" | "saved" | "failed";
  lastSavedSnapshot: string | null;
}

export const initialProjectSliceState: ProjectSliceState = {
  data: null,
  fetchStatus: "idle",
  saveStatus: "idle",
  lastSavedSnapshot: null,
};
