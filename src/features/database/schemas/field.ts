export interface Field {
  id: string;
  name: string;
  type: string;
  unique: boolean;
  pk: boolean;
  not_null: boolean;
  increment: boolean;
}

export interface FieldCreate {
  name: string;
  type: string;
  unique?: boolean;
  pk?: boolean;
  not_null?: boolean;
  increment?: boolean;
}

export interface FieldUpdate {
  name?: string;
  type?: string;
  unique?: boolean;
  pk?: boolean;
  not_null?: boolean;
  increment?: boolean;
}
