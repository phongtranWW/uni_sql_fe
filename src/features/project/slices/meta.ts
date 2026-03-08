import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialMeta } from "../state";
import { getProject, upsertProject } from "../thunks";
import type { Database } from "../schemas/database";
import { isEqual } from "lodash";

const metaSlice = createSlice({
  name: "meta",
  initialState: initialMeta,
  reducers: {
    updateSaveStatus: (state, action: PayloadAction<Database>) => {
      if (state.saveStatus === "saving") return;
      state.saveStatus = isEqual(state.originalDatabase, action.payload)
        ? "saved"
        : "unsaved";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.saveStatus = "saved";
        state.error = null;
        state.originalDatabase = action.payload;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || null;
      });
    builder
      .addCase(upsertProject.pending, (state) => {
        state.saveStatus = "saving";
      })
      .addCase(upsertProject.fulfilled, (state, action) => {
        state.saveStatus = "saved";
        state.originalDatabase = action.payload;
      })
      .addCase(upsertProject.rejected, (state, action) => {
        state.saveStatus = "unsaved";
        state.error = action.payload || null;
      });
  },
});

export const { updateSaveStatus } = metaSlice.actions;

export default metaSlice.reducer;
