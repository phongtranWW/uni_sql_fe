import type { Field } from "./field";

export interface Table {
  name: string;
  fields: Field[];
  alias: string | null;
  headerColor: string | null;
}

export interface TableCreate {
  name: string;
  headerColor?: string;
  alias?: string;
  fields?: Field[];
}

export interface TableUpdate {
  name?: string;
  headerColor?: string;
  alias?: string;
  fields?: Field[];
}
