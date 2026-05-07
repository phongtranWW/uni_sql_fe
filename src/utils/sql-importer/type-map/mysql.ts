import { z } from "zod";
import { type FieldType } from "@/constants/field-types";
import type { TypeMapResult } from "./postgres";

export const MysqlTypeSchema = z
  .string()
  .transform((raw) => raw.toUpperCase().replace(/\s+/g, " ").trim())
  .transform((type): TypeMapResult => {
    // BOOLEAN: MySQL backend exports TINYINT(1) for BOOLEAN fields
    if (type === "TINYINT(1)") return { fieldType: "BOOLEAN" };

    // Exact matches
    switch (type) {
      case "INT":
      case "INTEGER":
      case "TINYINT":
      case "SMALLINT":
      case "MEDIUMINT":
      case "BIGINT":
        return { fieldType: "INT" };
      case "FLOAT":
        return { fieldType: "FLOAT" };
      case "DOUBLE":
      case "DOUBLE PRECISION":
      case "REAL":
        return { fieldType: "DOUBLE" };
      case "DECIMAL":
      case "NUMERIC":
        return { fieldType: "DECIMAL" };
      case "TEXT":
      case "MEDIUMTEXT":
      case "LONGTEXT":
      case "TINYTEXT":
        return { fieldType: "TEXT" };
      case "DATE":
        return { fieldType: "DATE" };
      case "TIME":
        return { fieldType: "TIME" };
      case "DATETIME":
        return { fieldType: "DATETIME" };
      case "TIMESTAMP":
        return { fieldType: "TIMESTAMP" };
    }

    // Prefix matches
    if (type.startsWith("DECIMAL") || type.startsWith("NUMERIC"))
      return { fieldType: "DECIMAL" };
    if (type.startsWith("INT") || type.startsWith("BIGINT") || type.startsWith("TINYINT"))
      return { fieldType: "INT" };
    if (type.startsWith("VARCHAR"))
      return { fieldType: "VARCHAR" };

    // CHAR(n) — note: CHAR(36) is used by some tools for UUID, but we cannot
    // distinguish it from a regular CHAR column without additional context.
    if (type.startsWith("CHAR"))
      return { fieldType: "CHAR" };

    // Fallback with warning
    return {
      fieldType: "VARCHAR",
      warning: `Unsupported MySQL type "${type}" — mapped to VARCHAR`,
    };
  });
