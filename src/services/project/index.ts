import apiClient from "@/lib/api-client";
import type { ProjectSummaryDto } from "./dtos";
import type { ProjectGetManyParams } from "./params";
import type { ResponsePaginationDto } from "../shared-dtos";

export const projectService = {
  async getManyBy(
    params: ProjectGetManyParams,
  ): Promise<ResponsePaginationDto<ProjectSummaryDto>> {
    const { data } = await apiClient.get<
      ResponsePaginationDto<ProjectSummaryDto>
    >("/projects", { params });
    return data;
  },
};

export default projectService;
