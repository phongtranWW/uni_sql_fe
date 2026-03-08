import type { RootState } from "@/app/store";
export const selectProjectState = (state: RootState) => state.project;

export const selectMeta = (state: RootState) => selectProjectState(state).meta;

export const selectDatabase = (state: RootState) =>
  selectProjectState(state).database.present;

export const selectDatabaseTables = (state: RootState) =>
  selectDatabase(state).tables;
export const selectDatabaseRefs = (state: RootState) =>
  selectDatabase(state).refs;
