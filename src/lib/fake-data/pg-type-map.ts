import type { FieldType } from "@/constants/field-types";
import { PostgresTypeSchema } from "@/utils/sql-importer/type-map/postgres";

/**
 * Bridge layer that turns a raw PostgreSQL data type (as seen in
 * `information_schema.columns.data_type`, e.g. `"character varying"`,
 * `"integer"`, `"timestamp without time zone"`) into the app's internal
 * `FieldType`.
 *
 * We deliberately reuse `PostgresTypeSchema` from the SQL importer so the
 * playground and the importer share a single source of truth for type
 * mapping — fixing one fixes both.
 */
export interface PgTypeMapResult {
  fieldType: FieldType;
  /** Set when the data type is unknown and was forced into a fallback. */
  warning?: string;
}

export function pgTypeToFieldType(dataType: string): PgTypeMapResult {
  return PostgresTypeSchema.parse(dataType);
}
