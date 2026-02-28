import { initialDatabase } from "@/data/mock_database";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Table, TableCreate, TableUpdate } from "./schemas/table";
import type { RefUpdate } from "./schemas/ref";

const databaseSlice = createSlice({
  name: "database",
  initialState: initialDatabase,
  reducers: {
    addTable: (state, action: PayloadAction<TableCreate>) => {
      const table: Table = {
        name: action.payload.name,
        alias: action.payload.alias || null,
        headerColor: action.payload.headerColor,
        fields: [],
      };
      state.tables.push(table);
    },
    removeTable: (state, action: PayloadAction<string>) => {
      state.tables = state.tables.filter((t) => t.name !== action.payload);
    },
    updateTable: (
      state,
      action: PayloadAction<{
        name: string;
        tableUpdate: TableUpdate;
      }>,
    ) => {
      const table = state.tables.find((t) => t.name === action.payload.name);
      if (!table) return;
      Object.assign(table, action.payload.tableUpdate);
    },
    removeRef: (state, action: PayloadAction<string>) => {
      state.refs = state.refs.filter((r) => r.name !== action.payload);
    },
    updateRef: (
      state,
      action: PayloadAction<{
        name: string;
        refUpdate: RefUpdate;
      }>,
    ) => {
      const ref = state.refs.find((r) => r.name === action.payload.name);
      if (!ref) return;
      Object.assign(ref, action.payload.refUpdate);
    },
  },
});

export const { addTable, removeTable, updateTable, removeRef, updateRef } =
  databaseSlice.actions;

export default databaseSlice.reducer;
