import type { RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";
import { ProjectValidateSchema } from "../schemas/project.schema";

const selectProjectData = (state: RootState) => state.project.present.data;

export type ProjectIssue = {
  message: string;
  path: (string | number)[];
};

const parseProjectIssues = (
  data: NonNullable<ReturnType<typeof selectProjectData>>,
): ProjectIssue[] => {
  const result = ProjectValidateSchema.safeParse(data);
  if (result.success) return [];

  return result.error.issues.map((issue) => ({
    message: issue.message,
    path: issue.path.filter((p): p is string | number => typeof p !== "symbol"),
  }));
};

export const selectProjectIssues = createSelector(
  selectProjectData,
  (data): ProjectIssue[] => (data ? parseProjectIssues(data) : []),
);
