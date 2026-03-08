import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Database } from "./schemas/database";
import axios from "axios";
import { projectService } from "./service";

export const getProject = createAsyncThunk<
  Database,
  string,
  { rejectValue: string }
>("project/get", async (id, { rejectWithValue }) => {
  try {
    const dto = await projectService.getById(id);
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

export const upsertProject = createAsyncThunk<
  Database,
  { id: string; database: Database },
  { rejectValue: string }
>("project/upsert", async ({ id, database }, { rejectWithValue }) => {
  try {
    const dto = await projectService.upsert(id, { ...database });
    return { ...dto };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save database",
      );
    }
    return rejectWithValue("Failed to save database");
  }
});
