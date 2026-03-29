import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialProjectSliceState } from "../states/project.state";
import undoable, { excludeAction } from "redux-undo";
import { getProject, upsertProject } from "../thunks";
import type { TableCreate, TableUpdate } from "../schemas/table-schema";
import type {
  FieldCreate,
  FieldPart,
  FieldReplace,
} from "../schemas/field-schema";
import type { RefCreate, RefUpdate } from "../schemas/ref.schema";

const projectSlice = createSlice({
  name: "project",
  initialState: initialProjectSliceState,
  reducers: {
    // ─── Table ───────────────────────────────────────────
    tableCreated: (state, action: PayloadAction<TableCreate>) => {
      state.data?.tables.push({
        ...action.payload,
        fields: [],
      });
    },
    tableUpdated: (
      state,
      action: PayloadAction<{ name: string; tableUpdate: TableUpdate }>,
    ) => {
      const table = state.data?.tables.find(
        (t) => t.name === action.payload.name,
      );
      if (!table) return;
      Object.assign(table, action.payload.tableUpdate);
    },
    tableDeleted: (state, action: PayloadAction<string>) => {
      if (!state.data) return;
      state.data.tables = state.data.tables.filter(
        (t) => t.name !== action.payload,
      );
    },
    tablesSelected: (
      state,
      action: PayloadAction<{ name: string[]; value: boolean }>,
    ) => {
      state.data?.tables.forEach((table) => {
        if (action.payload.name.includes(table.name))
          table.isSelected = action.payload.value;
      });
    },
    tablesSelectionCleared: (state) => {
      state.data?.tables.forEach((t) => (t.isSelected = false));
    },

    elementsDeleted: (
      state,
      action: PayloadAction<{ tableNames: string[]; refNames: string[] }>,
    ) => {
      if (!state.data) return;
      const tablesToDelete = new Set(action.payload.tableNames);
      const refsToDelete = new Set(action.payload.refNames);

      state.data.tables = state.data.tables.filter(
        (t) => !tablesToDelete.has(t.name),
      );

      state.data.refs = state.data.refs.filter((r) => {
        if (refsToDelete.has(r.name)) return false;
        const connectedToDeletedTable = r.endpoints.some((e) =>
          tablesToDelete.has(e.tableName),
        );
        return !connectedToDeletedTable;
      });
    },

    elementsSelectionDeleted: (state) => {
      if (!state.data) return;
      const tablesToDelete = new Set(
        state.data.tables.filter((t) => t.isSelected).map((t) => t.name),
      );
      const refsToDelete = new Set(
        state.data.refs.filter((r) => r.isSelected).map((r) => r.name),
      );

      state.data.tables = state.data.tables.filter(
        (t) => !tablesToDelete.has(t.name),
      );

      state.data.refs = state.data.refs.filter((r) => {
        if (refsToDelete.has(r.name)) return false;
        const connectedToDeletedTable = r.endpoints.some((e) =>
          tablesToDelete.has(e.tableName),
        );
        return !connectedToDeletedTable;
      });
    },

    // ─── Field ───────────────────────────────────────────
    fieldCreated: (
      state,
      action: PayloadAction<{ tableName: string; data: FieldCreate }>,
    ) => {
      const table = state.data?.tables.find(
        (t) => t.name === action.payload.tableName,
      );
      if (!table) return;
      table.fields.push({
        ...action.payload.data,
      });
    },

    fieldReplaced: (
      state,
      action: PayloadAction<{
        tableName: string;
        fieldName: string;
        data: FieldReplace;
      }>,
    ) => {
      const table = state.data?.tables.find(
        (t) => t.name === action.payload.tableName,
      );
      if (!table) return;
      const idx = table.fields.findIndex(
        (f) => f.name === action.payload.fieldName,
      );
      if (idx < 0) return;
      table.fields[idx] = {
        ...action.payload.data,
      };
    },

    fieldPartial: (
      state,
      action: PayloadAction<{
        tableName: string;
        fieldName: string;
        data: FieldPart;
      }>,
    ) => {
      const table = state.data?.tables.find(
        (t) => t.name === action.payload.tableName,
      );
      if (!table) return;
      const field = table.fields.find(
        (f) => f.name === action.payload.fieldName,
      );
      if (!field) return;
      Object.assign(field, action.payload.data);
    },
    fieldRemoved: (
      state,
      action: PayloadAction<{ tableName: string; fieldName: string }>,
    ) => {
      const table = state.data?.tables.find(
        (t) => t.name === action.payload.tableName,
      );
      if (!table) return;
      table.fields = table.fields.filter(
        (f) => f.name !== action.payload.fieldName,
      );
    },

    // ─── Ref ─────────────────────────────────────────────
    refCreated: (state, action: PayloadAction<RefCreate>) => {
      state.data?.refs.push({ ...action.payload, isSelected: false });
    },
    refUpdated: (
      state,
      action: PayloadAction<{ name: string; refUpdate: RefUpdate }>,
    ) => {
      const ref = state.data?.refs.find((r) => r.name === action.payload.name);
      if (!ref) return;
      Object.assign(ref, action.payload.refUpdate);
    },
    refRemoved: (state, action: PayloadAction<string>) => {
      if (!state.data) return;
      state.data.refs = state.data.refs.filter(
        (r) => r.name !== action.payload,
      );
    },
    refsSelected: (
      state,
      action: PayloadAction<{ name: string[]; value: boolean }>,
    ) => {
      state.data?.refs.forEach((ref) => {
        if (action.payload.name.includes(ref.name))
          ref.isSelected = action.payload.value;
      });
    },
    refsSelectionCleared: (state) => {
      state.data?.refs.forEach((r) => (r.isSelected = false));
    },

    nameSet: (state, action: PayloadAction<string>) => {
      if (!state.data) return;
      state.data.name = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProject.pending, (state) => {
        state.fetchStatus = "loading";
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.data = action.payload;
        state.fetchStatus = "succeeded";
      })
      .addCase(getProject.rejected, (state) => {
        state.fetchStatus = "failed";
      })
      .addCase(upsertProject.pending, (state) => {
        state.saveStatus = "saving";
      })
      .addCase(upsertProject.fulfilled, (state, action) => {
        state.data = action.payload;
        state.saveStatus = "saved";
      });
  },
});

export const {
  tableCreated,
  tableUpdated,
  tableDeleted,
  tablesSelected,
  tablesSelectionCleared,
  elementsDeleted,
  elementsSelectionDeleted,
  fieldCreated,
  fieldReplaced,
  fieldPartial,
  fieldRemoved,
  refCreated,
  refUpdated,
  refRemoved,
  refsSelected,
  refsSelectionCleared,
  nameSet,
} = projectSlice.actions;

export default undoable(projectSlice.reducer, {
  filter: excludeAction([
    "project/tablesSelected",
    "project/tablesSelectionCleared",
    "project/refsSelected",
    "project/refsSelectionCleared",
    getProject.pending.type,
    getProject.fulfilled.type,
    getProject.rejected.type,
    upsertProject.pending.type,
    upsertProject.fulfilled.type,
    upsertProject.rejected.type,
  ]),
});
