import { initialDatabase } from "@/data/mock_database";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Table, TableCreate, TableUpdate } from "./schemas/table";
import { nanoid } from "nanoid";
import type { FieldCreate, FieldUpdate } from "./schemas/field";
import type { Ref, RefCreate } from "./schemas/ref";

const databaseSlice = createSlice({
  name: "database",
  initialState: initialDatabase,
  reducers: {
    createTable(state, action: PayloadAction<TableCreate>) {
      const table: Table = {
        id: nanoid(6),
        name: action.payload.name,
        fields: action.payload.fields || [],
        alias: action.payload.alias || null,
        headerColor: action.payload.headerColor || null,
      };
      state.tables.push(table);
    },
    removeTable(state, action: PayloadAction<string>) {
      const tableId = action.payload;
      state.tables = state.tables.filter((t) => t.id !== tableId);
      state.refs = state.refs.filter(
        (ref) => !ref.endpoints.some((e) => e.tableId === tableId),
      );
    },
    updateTable(
      state,
      action: PayloadAction<{ tableId: string; tableUpdate: TableUpdate }>,
    ) {
      const table = state.tables.find((t) => t.id === action.payload.tableId);
      if (!table) return;
      Object.assign(table, action.payload.tableUpdate);
    },
    addField(
      state,
      action: PayloadAction<{ tableId: string; field: FieldCreate }>,
    ) {
      const table = state.tables.find((t) => t.id === action.payload.tableId);
      if (!table) return;
      table.fields.push({
        id: nanoid(6),
        name: action.payload.field.name,
        type: action.payload.field.type,
        unique: action.payload.field.unique ?? false,
        pk: action.payload.field.pk ?? false,
        not_null: action.payload.field.not_null ?? false,
        increment: action.payload.field.increment ?? false,
      });
    },
    removeField(
      state,
      action: PayloadAction<{ tableId: string; fieldId: string }>,
    ) {
      const { tableId, fieldId } = action.payload;
      const table = state.tables.find((t) => t.id === action.payload.tableId);
      if (!table) return;
      table.fields = table.fields.filter(
        (f) => f.id !== action.payload.fieldId,
      );
      state.refs = state.refs
        .map((ref) => {
          ref.endpoints = ref.endpoints
            .map((endpoint) => {
              if (endpoint.tableId !== tableId) return endpoint;

              return {
                ...endpoint,
                fieldIds: endpoint.fieldIds.filter((id) => id !== fieldId),
              };
            })
            .filter((endpoint) => endpoint.fieldIds.length > 0);

          return ref;
        })
        .filter((ref) => ref.endpoints.length >= 2);
    },
    updateField(
      state,
      action: PayloadAction<{
        tableId: string;
        fieldId: string;
        fieldUpdate: FieldUpdate;
      }>,
    ) {
      const { tableId, fieldId, fieldUpdate } = action.payload;
      const table = state.tables.find((t) => t.id === tableId);
      if (!table) return;
      const field = table.fields.find((f) => f.id === fieldId);
      if (!field) return;
      Object.assign(field, fieldUpdate);
    },
    createRef(state, action: PayloadAction<RefCreate>) {
      const ref: Ref = {
        id: nanoid(6),
        name: action.payload.name,
        endpoints: action.payload.endpoints || [],
      };
      state.refs.push(ref);
    },
    removeRef(state, action: PayloadAction<string>) {
      state.refs = state.refs.filter((r) => r.id !== action.payload);
    },
  },
});

export const {
  createTable,
  removeTable,
  updateTable,
  addField,
  removeField,
  updateField,
  createRef,
  removeRef,
} = databaseSlice.actions;

export default databaseSlice.reducer;
