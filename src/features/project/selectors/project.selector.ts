import type { RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";

// ─── Root ─────────────────────────────────────────────
const selectProjectSlice = (state: RootState) => state.project.present;
const selectProjectData = (state: RootState) => selectProjectSlice(state).data;
const selectProjectSaveStatus = (state: RootState) =>
  selectProjectSlice(state).saveStatus;
const selectProjectLastSavedSnapshot = (state: RootState) =>
  selectProjectSlice(state).lastSavedSnapshot;

// ─── Status ───────────────────────────────────────────
export const selectFetchStatus = (state: RootState) =>
  selectProjectSlice(state).fetchStatus;

export const selectProjectIsDirty = createSelector(
  [selectProjectData, selectProjectLastSavedSnapshot],
  (data, lastSavedSnapshot) => {
    if (!data || !lastSavedSnapshot) return false;
    return JSON.stringify(data) !== lastSavedSnapshot;
  },
);

export const selectProjectSaveState = createSelector(
  [selectProjectSaveStatus, selectProjectIsDirty],
  (saveStatus, isDirty) => {
    if (saveStatus === "saving") return "saving";
    if (isDirty) return "dirty";
    return "saved";
  },
);

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

export const selectIndexes = createSelector(
  selectProjectData,
  (data) => data?.indexes ?? [],
);
