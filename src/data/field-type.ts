import type { FieldType } from "@/types/database-diagram";
import type { DatabaseType } from "@/types/database-type";

export const FIELD_TYPE: Record<DatabaseType, FieldType[]> = {
  postgres: [
    { schemaName: null, type_name: "smallint", args: null },
    { schemaName: null, type_name: "integer", args: null },
    { schemaName: null, type_name: "bigint", args: null },
    { schemaName: null, type_name: "numeric", args: "10,2" },
    { schemaName: null, type_name: "boolean", args: null },
  ],
  mysql: [
    { schemaName: null, type_name: "smallint", args: null },
    { schemaName: null, type_name: "integer", args: null },
    { schemaName: null, type_name: "bigint", args: null },
    { schemaName: null, type_name: "numeric", args: "10,2" },
    { schemaName: null, type_name: "boolean", args: null },
  ],
};
