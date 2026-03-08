import type { Database } from "./schemas/database";
import type { Ref } from "./schemas/ref";
import type { Table } from "./schemas/table";

export interface DatabaseState {
  name: string;
  tables: Table[];
  refs: Ref[];
}

export interface MetaState {
  status: "loading" | "succeeded" | "failed";
  saveStatus: "saved" | "unsaved" | "saving";
  error: string | null;
  originalDatabase: Database | null;
}

export const initialMeta: MetaState = {
  status: "loading",
  saveStatus: "unsaved",
  error: null,
  originalDatabase: null,
};

export const initialDatabase: DatabaseState = {
  name: "",
  tables: [],
  refs: [],
};
