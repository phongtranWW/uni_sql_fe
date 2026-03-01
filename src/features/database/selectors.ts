import type { RootState } from "@/app/store";

export const selectDatabaseState = (state: RootState) => state.database.present;

export const selectTables = (state: RootState) =>
  selectDatabaseState(state).tables;

export const selectRefs = (state: RootState) => selectDatabaseState(state).refs;
