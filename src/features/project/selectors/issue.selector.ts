import type { RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";
import { ProjectSchema } from "../schemas/project.schema";
import type { z } from "zod";

const selectProjectData = (state: RootState) => state.project.present.data;

export type ProjectIssue = {
  message: string;
  path: (string | number)[];
};

export const selectProjectIssues = createSelector(
  selectProjectData,
  (data): ProjectIssue[] => {
    if (!data) return [];

    const result = ProjectSchema.safeParse(data);
    if (result.success) return [];

    return result.error.issues.map((issue: z.ZodIssue) => ({
      message: issue.message,
      path: issue.path.filter(
        (p): p is string | number => typeof p !== "symbol",
      ),
    }));
  },
);
