import type { RootState } from "@/app/store";
import { createSelector } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual";

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
    return !isEqual(data, lastSavedSnapshot);
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

// ─── Ownership ────────────────────────────────────────
export const selectIsOwner = (state: RootState) =>
  selectProjectSlice(state).isOwner;

// ─── Data ─────────────────────────────────────────────
export const selectProject = selectProjectData;

export const selectProjectId = createSelector(
  selectProjectData,
  (data) => data?.id ?? null,
);

export const selectTables = createSelector(
  selectProjectData,
  (data) => data?.tables ?? [],
);

export const selectTableFields = (tableName: string) =>
  createSelector(
    selectTables,
    (tables) => tables.find((t) => t.name === tableName)?.fields ?? [],
  );

export const selectRefs = createSelector(
  selectProjectData,
  (data) => data?.refs ?? [],
);

export const selectIndexes = createSelector(
  selectProjectData,
  (data) => data?.indexes ?? [],
);
