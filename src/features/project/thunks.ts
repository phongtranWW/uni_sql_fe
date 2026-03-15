import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Database } from "./schemas/database";
import axios from "axios";
import { projectService } from "./service";
import type { TableCreate, TableUpdate } from "./schemas/table";
import { selectDatabase } from "./selectors";
import type { RootState } from "@/app/store";

export const getProject = createAsyncThunk<
  Database,
  string,
  { rejectValue: string }
>("project/get", async (id, { rejectWithValue }) => {
  try {
    const dto = await projectService.getById(id);
    return { ...dto };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load database",
      );
    }
    return rejectWithValue("Failed to load database");
  }
});

export const upsertProject = createAsyncThunk<
  Database,
  { id: string; database: Database },
  { rejectValue: string }
>("project/upsert", async ({ id, database }, { rejectWithValue }) => {
  try {
    const dto = await projectService.upsert(id, { ...database });
    return { ...dto };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to save database",
      );
    }
    return rejectWithValue("Failed to save database");
  }
});

export const createTable = createAsyncThunk<
  TableCreate,
  TableCreate,
  { state: RootState; rejectValue: string }
>("project/createTable", async (tableCreate, { getState, rejectWithValue }) => {
  try {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableCreate.name))
      throw new Error(
        "Table name must start with a letter or underscore, and contain only letters, numbers, or underscores",
      );
    if (tableCreate.name.length > 63)
      throw new Error("Table name must not exceed 63 characters");

    if (tableCreate.alias) {
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableCreate.alias))
        throw new Error(
          "Table alias must start with a letter or underscore, and contain only letters, numbers, or underscores",
        );
      if (tableCreate.alias.length > 63)
        throw new Error("Table alias must not exceed 63 characters");
    }

    const { tables } = selectDatabase(getState());
    if (tables.some((t) => t.name === tableCreate.name))
      throw new Error(`Table "${tableCreate.name}" already exists`);

    return tableCreate;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create table",
    );
  }
});

export const updateTable = createAsyncThunk<
  { name: string; tableUpdate: TableUpdate },
  { name: string; tableUpdate: TableUpdate },
  { state: RootState; rejectValue: string }
>(
  "project/updateTable",
  async ({ name, tableUpdate }, { getState, rejectWithValue }) => {
    try {
      const { tables } = selectDatabase(getState());
      const table = tables.find((t) => t.name === name);
      if (!table) throw new Error(`Table "${name}" not found`);
      if (tableUpdate.name) {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableUpdate.name))
          throw new Error(
            "Table name must start with a letter or underscore, and contain only letters, numbers, or underscores",
          );
        if (tableUpdate.name.length > 63)
          throw new Error("Table name must not exceed 63 characters");

        if (tables.some((t) => t.name === tableUpdate.name && t.name !== name))
          throw new Error(`Table "${tableUpdate.name}" already exists`);
      }

      if (tableUpdate.alias) {
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(tableUpdate.alias))
          throw new Error(
            "Table alias must start with a letter or underscore, and contain only letters, numbers, or underscores",
          );
        if (tableUpdate.alias.length > 63)
          throw new Error("Table alias must not exceed 63 characters");
      }

      return { name, tableUpdate };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create table",
      );
    }
  },
);

export const deleteTable = createAsyncThunk<
  string,
  string,
  { state: RootState; rejectValue: string }
>("project/deleteTable", async (name, { getState, rejectWithValue }) => {
  try {
    if (name) {
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name))
        throw new Error(
          "Table name must start with a letter or underscore, and contain only letters, numbers, or underscores",
        );
      if (name.length > 63)
        throw new Error("Table name must not exceed 63 characters");
    }
    const { tables } = selectDatabase(getState());
    const table = tables.find((t) => t.name === name);
    if (!table) throw new Error(`Table "${name}" not found`);
    return name;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Failed to create table",
    );
  }
});
