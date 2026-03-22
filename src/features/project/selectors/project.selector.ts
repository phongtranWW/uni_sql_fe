import type { RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";

// ─── Root ─────────────────────────────────────────────
const selectProjectSlice = (state: RootState) => state.project.present;
const selectProjectData = (state: RootState) => selectProjectSlice(state).data;

// ─── Status ───────────────────────────────────────────
export const selectFetchStatus = (state: RootState) =>
  selectProjectSlice(state).fetchStatus;
export const selectSaveStatus = (state: RootState) =>
  selectProjectSlice(state).saveStatus;

// ─── Undo/Redo ────────────────────────────────────────
export const selectCanUndo = (state: RootState) =>
  state.project.past.length > 0;
export const selectCanRedo = (state: RootState) =>
  state.project.future.length > 0;

// ─── Data ─────────────────────────────────────────────
export const selectProject = createSelector(
  selectProjectData,
  (data) => data ?? null,
);

export const selectTables = createSelector(
  selectProjectData,
  (data) => data?.tables ?? [],
);

export const selectRefs = createSelector(
  selectProjectData,
  (data) => data?.refs ?? [],
);
