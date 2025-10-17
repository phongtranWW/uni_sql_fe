import type { RootState } from "@/app/store";
import { fieldsAdapter, tablesAdapter } from "./adapters";
import { createSelector } from "@reduxjs/toolkit";

export const {
  selectAll: selectAllTables,
  selectById: selectTableById,
  selectIds: selectTableIds,
  selectEntities: selectTableEntities,
} = tablesAdapter.getSelectors<RootState>((state) => state.diagram.tables);

export const { selectAll: selectAllFields, selectById: selectFieldById } =
  fieldsAdapter.getSelectors((state: RootState) => state.diagram.fields);

export const selectFieldIdsByTableId = createSelector(
  [selectAllFields, (_: RootState, tableId: string) => tableId],
  (fields, tableId) =>
    fields.filter((f) => f.tableId === tableId).map((f) => f.id)
);

export const selectFieldsByTableId = createSelector(
  [selectAllFields, (_: RootState, tableId: string) => tableId],
  (fields, tableId) => fields.filter((f) => f.tableId === tableId)
);
