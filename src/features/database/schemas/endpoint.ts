export interface Endpoint {
  id: string;
  tableId: string;
  fieldIds: string[];
  relation: "1" | "*";
}

export interface EndpointCreate {
  tableId: string;
  fieldIds: string[];
  relation: "1" | "*";
}

export interface EndpointUpdate {
  tableId?: string;
  fieldIds?: string[];
  relation?: "1" | "*";
}
