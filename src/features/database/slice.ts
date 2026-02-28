import { initialDatabase } from "@/data/mock_database";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Table, TableCreate, TableUpdate } from "./schemas/table";

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
  },
});

export const { addTable, removeTable, updateTable } = databaseSlice.actions;

export default databaseSlice.reducer;
