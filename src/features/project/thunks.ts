import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Database } from "./schemas/database";
import { databaseService } from "./service";
import axios from "axios";

export const getDatabase = createAsyncThunk<
  Database,
  string,
  { rejectValue: string }
>("database/get", async (id, { rejectWithValue }) => {
  try {
    const dto = await databaseService.getById(id);
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
