import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ProjectSummary } from "./schemas";
import projectService from "@/services/project";
import type { ResponsePagination } from "../shared-schemas";
import axios from "axios";
import type { ProjectGetManyParams } from "@/services/project/params";

export const getProjects = createAsyncThunk<
  ResponsePagination<ProjectSummary>,
  ProjectGetManyParams,
  { rejectValue: string }
>("project/get", async (params, { rejectWithValue }) => {
  try {
    const dto = await projectService.getManyBy(params);
    return { ...dto };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load database",
      );
    }
    return rejectWithValue("Failed to load database");
  }
});
