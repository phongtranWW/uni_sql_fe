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
      case "INTEGER":
      case "INT":
      case "INT4":
      case "SMALLINT":
      case "BIGINT":
        return { fieldType: "INT" };
      case "REAL":
      case "FLOAT4":
        return { fieldType: "FLOAT" };
      case "DOUBLE PRECISION":
      case "FLOAT8":
        return { fieldType: "DOUBLE" };
      case "NUMERIC":
        return { fieldType: "DECIMAL" };
      case "TEXT":
        return { fieldType: "TEXT" };
      case "BOOLEAN":
      case "BOOL":
        return { fieldType: "BOOLEAN" };
      case "DATE":
        return { fieldType: "DATE" };
      case "TIME":
      case "TIME WITHOUT TIME ZONE":
        return { fieldType: "TIME" };
      case "TIMESTAMP":
      case "TIMESTAMP WITHOUT TIME ZONE":
        return { fieldType: "DATETIME" };
      case "TIMESTAMPTZ":
      case "TIMESTAMP WITH TIME ZONE":
        return { fieldType: "TIMESTAMP" };
      case "UUID":
        return { fieldType: "UUID" };
    }

    // Prefix matches (DECIMAL, NUMERIC with precision, VARCHAR, CHAR)
    if (type.startsWith("DECIMAL") || type.startsWith("NUMERIC"))
      return { fieldType: "DECIMAL" };
    if (type.startsWith("VARCHAR") || type.startsWith("CHARACTER VARYING"))
      return { fieldType: "VARCHAR" };
    if (type.startsWith("CHAR") || type.startsWith("CHARACTER"))
      return { fieldType: "CHAR" };

    // Fallback with warning
    const fallbackBase = type.startsWith("VARCHAR")
      ? "VARCHAR"
      : type.startsWith("CHAR")
        ? "CHAR"
        : null;

    if (fallbackBase)
      return { fieldType: fallbackBase as FieldType };

    return {
      fieldType: "VARCHAR",
      warning: `Unsupported PostgreSQL type "${type}" — mapped to VARCHAR`,
    };
  });
