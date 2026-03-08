import type { Ref } from "./schemas/ref";
import type { Table } from "./schemas/table";

export interface DatabaseState {
  name: string;
  tables: Table[];
  refs: Ref[];
}

export interface MetaState {
  status: "loading" | "succeeded" | "failed";
  error: string | null;
}

export const initialMeta: MetaState = {
  status: "loading",
  error: null,
};

export const initialDatabase: DatabaseState = {
  name: "",
  tables: [],
  refs: [],
};
