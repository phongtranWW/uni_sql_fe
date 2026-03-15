import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import { initialMeta } from "../state";
import { createTable, getProject, updateTable, upsertProject } from "../thunks";

const metaSlice = createSlice({
  name: "meta",
  initialState: initialMeta,
  reducers: {
    updateSaveStatus: (
      state,
      action: PayloadAction<"saving" | "saved" | "unsaved">,
    ) => {
      state.saveStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProject.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.saveStatus = "saved";
        state.originalDatabase = action.payload;
      })
      .addCase(getProject.rejected, (state) => {
        state.status = "failed";
      });

    builder
      .addCase(upsertProject.pending, (state) => {
        state.saveStatus = "saving";
      })
      .addCase(upsertProject.fulfilled, (state, action) => {
        state.saveStatus = "saved";
        state.originalDatabase = action.payload;
      })
      .addCase(upsertProject.rejected, (state) => {
        state.saveStatus = "unsaved";
      });
    builder.addMatcher(
      isAnyOf(createTable.fulfilled, updateTable.fulfilled),
      (state) => {
        state.saveStatus = "unsaved";
      },
    );
  },
});

export const { updateSaveStatus } = metaSlice.actions;

export default metaSlice.reducer;
