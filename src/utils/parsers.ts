import {
  ProjectSchema,
  type Project,
} from "@/features/project/schemas/project.schema";

export const parseProjectFile = async (file: File): Promise<Project> => {
  const raw = await file.text();
  return ProjectSchema.parse(JSON.parse(raw));
};
