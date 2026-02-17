import type { Endpoint } from "./endpoint";

export interface Ref {
  id: string;
  name: string;
  endpoints: Endpoint[];
}

export interface RefCreate {
  name: string;
  endpoints?: Endpoint[];
}

export interface RefUpdate {
  name?: string;
  endpoints?: Endpoint[];
}
