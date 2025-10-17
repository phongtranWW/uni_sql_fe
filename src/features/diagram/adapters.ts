import type { Field, Table } from "@/types/database-diagram";
import { createEntityAdapter } from "@reduxjs/toolkit";

export const tablesAdapter = createEntityAdapter({
  selectId: (table: Table) => table.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const fieldsAdapter = createEntityAdapter({
  selectId: (field: Field) => field.id,
});
