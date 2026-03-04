import type { TABLE_HEADER_COLORS } from "@/constants/table-header-colors";
import type { Field } from "./field";

export type TableHeaderColor =
  (typeof TABLE_HEADER_COLORS)[keyof typeof TABLE_HEADER_COLORS];

export interface Table {
  name: string;
  fields: Field[];
  headerColor: TableHeaderColor;
  isSelected: boolean;
  alias: string | null;
}

export interface TableCreate {
  name: string;
  headerColor: TableHeaderColor;
  alias?: string;
}

export interface TableUpdate {
  name?: string;
  headerColor?: TableHeaderColor;
  alias?: string;
  isSelected?: boolean;
}
