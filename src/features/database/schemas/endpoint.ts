export interface Endpoint {
  id: string;
  tableId: string;
  fieldId: string;
  relation: "1" | "*";
}

export interface EndpointCreate {
  tableId: string;
  fieldId: string;
  relation: "1" | "*";
}

export interface EndpointUpdate {
  tableId?: string;
  fieldId?: string;
  relation?: "1" | "*";
}
