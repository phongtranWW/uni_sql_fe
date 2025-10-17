export interface DatabaseDiagram {
  database: Record<string, Database>;
  schemas: Record<string, Schema>;
  notes: Record<string, Note>;
  refs: Record<string, Ref>;
  enums: Record<string, Enum>;
  tableGroups: Record<string, TableGroup>;
  tables: Record<string, Table>;
  endpoints: Record<string, Endpoint>;
  enumValues: Record<string, EnumValue>;
  indexes: Record<string, Index>;
  indexColumns: Record<string, IndexColumn>;
  fields: Record<string, Field>;
  records: Record<string, unknown>;
  tablePartials: Record<string, unknown>;
}

export interface Database {
  id: number;
  hasDefaultSchema: boolean;
  note: string | null;
  schemaIds: number[];
  noteIds: number[];
}

export interface Schema {
  id: number;
  name: string;
  note: string | null;
  tableIds: number[];
  enumIds: number[];
  tableGroupIds: number[];
  refIds: number[];
  databaseId: number;
}

export interface Note {
  id?: number;
  content?: string;
}

export interface Ref {
  id: number;
  name: string;
  onDelete?: string;
  endpointIds: number[];
  schemaId: number;
}

export interface Enum {
  id: number;
  name: string;
  note: string | null;
  valueIds: number[];
  fieldIds: number[];
  schemaId: number;
}

export interface EnumValue {
  id: number;
  name: string;
  note: string | null;
  enumId: number;
}

export interface TableGroup {
  id?: number;
  name?: string;
}

export interface Table {
  id: string;
  name: string;
  alias: string | null;
  note: string | null;
  partials: unknown[];
  fieldIds: string[];
  indexIds: number[];
  schemaId: number;
  groupId: number | null;
}

export interface Endpoint {
  id: number;
  schemaName: string | null;
  tableName: string;
  fieldNames: string[];
  relation: "1" | "*" | string;
  refId: number;
  fieldIds: number[];
}

export interface Index {
  id?: number;
  name?: string;
  unique?: boolean;
}

export interface IndexColumn {
  id?: number;
  fieldId?: number;
  order?: string;
}

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  unique?: boolean;
  pk?: boolean;
  not_null?: boolean;
  note?: string | null;
  increment?: boolean;
  dbdefault?: DBDefault;
  endpointIds?: number[];
  tableId: string;
  enumId: number | null;
}

export interface FieldType {
  schemaName: string | null;
  type_name: string;
  args: string | null;
}

export interface DBDefault {
  type: "expression" | "string" | "number";
  value: string | number;
}
