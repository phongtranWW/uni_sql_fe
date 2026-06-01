import { z } from "zod";
import { type FieldType } from "@/constants/field-types";

export interface TypeMapResult {
  fieldType: FieldType;
  warning?: string;
}

export const PostgresTypeSchema = z
  .string()
  .transform((raw) => raw.toUpperCase().replace(/\s+/g, " ").trim())
  .transform((type): TypeMapResult => {
    // Exact matches first
    switch (type) {
      case "SMALLINT":
      case "INT2":
        return { fieldType: "smallint" };
      case "INTEGER":
      case "INT":
      case "INT4":
        return { fieldType: "int" };
      case "BIGINT":
      case "INT8":
        return { fieldType: "bigint" };
      case "REAL":
      case "FLOAT4":
      case "DOUBLE PRECISION":
      case "FLOAT8":
        return { fieldType: "double" };
      case "NUMERIC":
        return { fieldType: "decimal" };
      case "TEXT":
        return { fieldType: "text" };
      case "BOOLEAN":
      case "BOOL":
        return { fieldType: "boolean" };
      case "DATE":
        return { fieldType: "date" };
      case "TIMESTAMP":
      case "TIMESTAMP WITHOUT TIME ZONE":
        return { fieldType: "datetime" };
      case "TIMESTAMPTZ":
      case "TIMESTAMP WITH TIME ZONE":
        return { fieldType: "timestamp" };
      case "UUID":
        return { fieldType: "uuid" };
      case "JSON":
      case "JSONB":
        return { fieldType: "json" };
    }

    // Prefix matches (DECIMAL, NUMERIC with precision, VARCHAR)
    if (type.startsWith("DECIMAL") || type.startsWith("NUMERIC"))
      return { fieldType: "decimal" };
    if (type.startsWith("VARCHAR") || type.startsWith("CHARACTER VARYING"))
      return { fieldType: "varchar" };

    // Fallback with warning
    return {
      fieldType: "varchar",
      warning: `Unsupported PostgreSQL type "${type}" — mapped to varchar`,
    };
  });
