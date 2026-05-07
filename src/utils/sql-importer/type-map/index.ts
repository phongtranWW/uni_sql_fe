import type { FieldType } from "@/constants/field-types";
import type { SqlDialect } from "../types";
import { PostgresTypeSchema, type TypeMapResult } from "./postgres";
import { MysqlTypeSchema } from "./mysql";

export type { TypeMapResult };

export function mapSqlType(
  rawType: string,
  dialect: SqlDialect,
): { fieldType: FieldType; warning?: string } {
  const schema =
    dialect === "postgresql" ? PostgresTypeSchema : MysqlTypeSchema;
  return schema.parse(rawType);
}
