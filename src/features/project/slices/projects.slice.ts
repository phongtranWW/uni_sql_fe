import { createSlice } from "@reduxjs/toolkit";
import { initialProjectsSliceState } from "../states/projects.state";
import { getProjects } from "../thunks";

const projectsSlice = createSlice({
  name: "projects",
  initialState: initialProjectsSliceState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getProjects.rejected, (state) => {
        state.fetchStatus = "failed";
      });
  },
});

export default projectsSlice.reducer;
