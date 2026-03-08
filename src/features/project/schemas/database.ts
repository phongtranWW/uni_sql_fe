import type { Ref } from "./ref";
import type { Table } from "./table";

export interface Database {
  name: string;
  tables: Table[];
  refs: Ref[];
}
