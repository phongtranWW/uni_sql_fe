import type { Endpoint } from "./endpoint";

export const REF_OPERATOR = {
  ONE_TO_ONE: "-",
  ONE_TO_MANY: ">",
  MANY_TO_ONE: "<",
} as const;

export type RefOperator = (typeof REF_OPERATOR)[keyof typeof REF_OPERATOR];

export interface Ref {
  name: string;
  isSelected: boolean;
  endpoints: [Endpoint, Endpoint];
  operator: RefOperator;
}

export interface RefCreate {
  name: string;
  endpoints: [Endpoint, Endpoint];
  operator: RefOperator;
}

export interface RefUpdate {
  name?: string;
  endpoints?: [Endpoint, Endpoint];
  operator?: RefOperator;
}
