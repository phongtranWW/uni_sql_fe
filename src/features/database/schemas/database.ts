import type { Ref } from "./ref";
import type { Table } from "./table";

export interface Database {
  tables: Table[];
  refs: Ref[];
}
