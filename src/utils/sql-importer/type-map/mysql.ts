import { z } from "zod";
import { type FieldType } from "@/constants/field-types";
import type { TypeMapResult } from "./postgres";

export const MysqlTypeSchema = z
  .string()
  .transform((raw) => raw.toUpperCase().replace(/\s+/g, " ").trim())
  .transform((type): TypeMapResult => {
    // BOOLEAN: MySQL backend exports TINYINT(1) for BOOLEAN fields
    if (type === "TINYINT(1)") return { fieldType: "boolean" };

    // Exact matches
    switch (type) {
      case "TINYINT":
      case "SMALLINT":
        return { fieldType: "smallint" };
      case "INT":
      case "INTEGER":
      case "MEDIUMINT":
        return { fieldType: "int" };
      case "BIGINT":
        return { fieldType: "bigint" };
      case "FLOAT":
      case "DOUBLE":
      case "DOUBLE PRECISION":
      case "REAL":
        return { fieldType: "double" };
      case "DECIMAL":
      case "NUMERIC":
        return { fieldType: "decimal" };
      case "TEXT":
      case "MEDIUMTEXT":
      case "LONGTEXT":
      case "TINYTEXT":
        return { fieldType: "text" };
      case "DATE":
        return { fieldType: "date" };
      case "DATETIME":
        return { fieldType: "datetime" };
      case "TIMESTAMP":
        return { fieldType: "timestamp" };
      case "JSON":
        return { fieldType: "json" };
    }

    // Prefix matches
    if (type.startsWith("DECIMAL") || type.startsWith("NUMERIC"))
      return { fieldType: "decimal" };
    if (type.startsWith("INT") || type.startsWith("BIGINT") || type.startsWith("TINYINT"))
      return { fieldType: "int" };
    if (type.startsWith("VARCHAR"))
      return { fieldType: "varchar" };

    // Fallback with warning
    return {
      fieldType: "varchar",
      warning: `Unsupported MySQL type "${type}" — mapped to varchar`,
    };
  });
