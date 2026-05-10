import { createAppThunk } from "@/app/thunks";
import projectService, {
  type ProjectExportParams,
  type ProjectGetManyParams,
  type ShareUpdateParams,
} from "./services/project.service";
import type { Project, ProjectSummaryPage } from "./schemas/project.schema";
import type { ExportResult } from "./schemas/export-result.schema";
import type { ShareList } from "./schemas/share.schema";

export const getProjects = createAppThunk<
  ProjectSummaryPage,
  { params: ProjectGetManyParams }
>("project/getAll", ({ params }) => projectService.getManyBy(params));

export const getSharedProjects = createAppThunk<
  ProjectSummaryPage,
  { params: ProjectGetManyParams }
>("project/getShared", ({ params }) => projectService.getSharedWithMe(params));

export const getProject = createAppThunk<Project, string>("project/get", (id) =>
  projectService.getOneBy(id),
);

export const getSharedProject = createAppThunk<Project, string>(
  "project/getShared",
  (id) => projectService.getSharedOneBy(id),
);

export const upsertProject = createAppThunk<
  Project,
  { id: string; body: object }
>("project/upsert", ({ id, body }) => projectService.upsert(id, body));

export const exportProject = createAppThunk<
  ExportResult,
  { id: string; params: ProjectExportParams }
>("project/export", ({ id, params }) => projectService.export(id, params));

export const deleteProject = createAppThunk<void, string>("project/delete", (id) =>
  projectService.delete(id),
);

export const getShares = createAppThunk<ShareList, string>(
  "project/shares/get",
  (projectId) => projectService.getShares(projectId),
);

export const updateShares = createAppThunk<
  ShareList,
  { projectId: string; params: ShareUpdateParams }
>("project/shares/update", ({ projectId, params }) =>
  projectService.updateShares(projectId, params),
);

export const revokeShares = createAppThunk<
  ShareList,
  { projectId: string; userIds: string[] }
>("project/shares/revoke", ({ projectId, userIds }) =>
  projectService.revokeShares(projectId, userIds),
);
