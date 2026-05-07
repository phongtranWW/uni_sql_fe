import type { RootState } from "@/app/store";

const selectProjectSlice = (state: RootState) => state.projects;

export const selectProjects = (state: RootState) =>
  selectProjectSlice(state).items;

export const selectFetchStatus = (state: RootState) =>
  selectProjectSlice(state).fetchStatus;

export const selectTotal = (state: RootState) =>
  selectProjectSlice(state).total;
export const selectPage = (state: RootState) => selectProjectSlice(state).page;
