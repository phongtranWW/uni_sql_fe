export interface Endpoint {
  tableName: string;
  fieldName: string;
}

export interface EndpointCreate {
  tableName: string;
  fieldName: string;
}

export interface EndpointUpdate {
  tableName?: string;
  fieldName?: string;
}
