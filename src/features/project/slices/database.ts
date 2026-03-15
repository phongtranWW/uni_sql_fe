import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RefCreate, RefUpdate } from "../schemas/ref";
import { createTable, deleteTable, getProject, updateTable } from "../thunks";
import type { FieldCreate, FieldUpdate } from "../schemas/field";
import { initialDatabase } from "../state";

const databaseSlice = createSlice({
  name: "database",
  initialState: initialDatabase,
  reducers: {
    setSelectedTables: (state, action: PayloadAction<string[]>) => {
      state.tables.forEach(
        (t) => (t.isSelected = action.payload.includes(t.name)),
      );
    },
    addField: (
      state,
      action: PayloadAction<{ tableName: string; fieldCreate: FieldCreate }>,
    ) => {
      const table = state.tables.find(
        (t) => t.name === action.payload.tableName,
      );
      if (!table) return;
      table.fields.push({
        name: action.payload.fieldCreate.name,
        type: action.payload.fieldCreate.type,
        unique: action.payload.fieldCreate.unique || false,
        pk: action.payload.fieldCreate.pk || false,
        not_null: action.payload.fieldCreate.not_null || false,
        increment: action.payload.fieldCreate.increment || false,
      });
    },
    removeField: (
      state,
      action: PayloadAction<{ tableName: string; fieldName: string }>,
    ) => {
      const table = state.tables.find(
        (t) => t.name === action.payload.tableName,
      );
      if (!table) return;
      table.fields = table.fields.filter(
        (f) => f.name !== action.payload.fieldName,
      );
    },
    updateField: (
      state,
      action: PayloadAction<{
        tableName: string;
        fieldName: string;
        fieldUpdate: FieldUpdate;
      }>,
    ) => {
      const table = state.tables.find(
        (t) => t.name === action.payload.tableName,
      );
      if (!table) return;
      const field = table.fields.find(
        (f) => f.name === action.payload.fieldName,
      );
      if (!field) return;
      Object.assign(field, action.payload.fieldUpdate);
    },
    addRef: (state, action: PayloadAction<RefCreate>) => {
      state.refs.push({
        name: action.payload.name,
        endpoints: action.payload.endpoints,
        operator: action.payload.operator,
        isSelected: false,
      });
    },
    removeRef: (state, action: PayloadAction<string>) => {
      state.refs = state.refs.filter((r) => r.name !== action.payload);
    },
    updateRef: (
      state,
      action: PayloadAction<{ name: string; refUpdate: RefUpdate }>,
    ) => {
      const ref = state.refs.find((r) => r.name === action.payload.name);
      if (!ref) return;
      Object.assign(ref, action.payload.refUpdate);
    },
    setSelectedRefs: (state, action: PayloadAction<string[]>) => {
      state.refs.forEach(
        (r) => (r.isSelected = action.payload.includes(r.name)),
      );
    },
    removeSelectedElements: (state) => {
      state.tables = state.tables.filter((t) => !t.isSelected);
      state.refs = state.refs.filter((r) => !r.isSelected);
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProject.fulfilled, (state, action) => {
      state.name = action.payload.name;
      state.tables = action.payload.tables;
      state.refs = action.payload.refs;
    });
    builder.addCase(createTable.fulfilled, (state, action) => {
      state.tables.push({
        ...action.payload,
        fields: [],
        isSelected: false,
      });
    });
    builder.addCase(updateTable.fulfilled, (state, action) => {
      const table = state.tables.find((t) => t.name === action.payload.name);
      if (!table) return;
      Object.assign(table, action.payload.tableUpdate);
    });
    builder.addCase(deleteTable.fulfilled, (state, action) => {
      state.tables = state.tables.filter((t) => t.name !== action.payload);
    });
  },
});

export const {
  setSelectedTables,
  addField,
  removeField,
  updateField,
  addRef,
  removeRef,
  updateRef,
  setSelectedRefs,
  removeSelectedElements,
  setName,
} = databaseSlice.actions;

export default databaseSlice.reducer;
