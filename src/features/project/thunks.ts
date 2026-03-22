import { createAppThunk } from "@/app/thunks";
import projectService, {
  type ProjectExportParams,
  type ProjectGetManyParams,
} from "./services/project.service";
import type { Project, ProjectSummaryPage } from "./schemas/project.schema";
import type { ExportResult } from "./schemas/export-result.schema";

export const getProjects = createAppThunk<
  ProjectSummaryPage,
  { params: ProjectGetManyParams }
>("project/getAll", ({ params }) => projectService.getManyBy(params));

export const getProject = createAppThunk<Project, string>("project/get", (id) =>
  projectService.getOneBy(id),
);

export const upsertProject = createAppThunk<
  Project,
  { id: string; body: object }
>("project/upsert", ({ id, body }) => projectService.upsert(id, body));

export const exportProject = createAppThunk<
  ExportResult,
  { id: string; params: ProjectExportParams }
>("project/export", ({ id, params }) => projectService.export(id, params));
