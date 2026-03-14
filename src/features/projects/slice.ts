import { createSlice } from "@reduxjs/toolkit";
import { getProjects } from "./thunks";
import { initialProjects } from "./state";

const projectsSlice = createSlice({
  name: "projects",
  initialState: initialProjects,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.error = null;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? null;
      });
  },
});

export default projectsSlice.reducer;
