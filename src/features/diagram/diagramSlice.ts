import { createSlice } from "@reduxjs/toolkit";
import { fieldsAdapter, tablesAdapter } from "./adapters";
import { mockFields, mockTables } from "@/data/mock";
import type { DatabaseType } from "@/types/database-type";
export const diagramSlice = createSlice({
  name: "database",
  initialState: {
    setting: {
      databaseType: "postgres" as DatabaseType,
    },
    tables: tablesAdapter.getInitialState({
      ids: mockTables.map((t) => t.id),
      entities: Object.fromEntries(mockTables.map((t) => [t.id, t])),
    }),
    fields: fieldsAdapter.getInitialState({
      ids: mockFields.map((f) => f.id),
      entities: Object.fromEntries(mockFields.map((f) => [f.id, f])),
    }),
  },
  reducers: {
    tableAdded: (state, action) => {
      tablesAdapter.addOne(state.tables, action.payload);
    },
    tableRemoved: (state, action) => {
      tablesAdapter.removeOne(state.tables, action.payload);
    },
    tableUpdated: (state, action) => {
      tablesAdapter.updateOne(state.tables, action.payload);
    },
    fieldAdded: (state, action) => {
      fieldsAdapter.addOne(state.fields, action.payload);
    },
    fieldRemoved: (state, action) => {
      fieldsAdapter.removeOne(state.fields, action.payload);
    },
    fieldUpdated: (state, action) => {
      fieldsAdapter.updateOne(state.fields, action.payload);
    },
  },
});

export const {
  tableAdded,
  tableRemoved,
  tableUpdated,
  fieldAdded,
  fieldRemoved,
  fieldUpdated,
} = diagramSlice.actions;
export default diagramSlice.reducer;
