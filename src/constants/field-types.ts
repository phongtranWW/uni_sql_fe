export const FIELD_TYPES = [
  "INT",
  "FLOAT",
  "DOUBLE",
  "DECIMAL",
  "CHAR",
  "VARCHAR",
  "TEXT",
  "BOOLEAN",
  "DATE",
  "TIME",
  "DATETIME",
  "TIMESTAMP",
  "UUID",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export const FIELD_DEFAULT_PATTERNS: Record<
  string,
  {
    patterns: RegExp[];
    functions: string[];
    message: string;
  }
> = {
  INT: {
    patterns: [/^-?\d+$/],
    functions: [],
    message: "Default for INT must be an integer (e.g. 0, -1, 42)",
  },
  FLOAT: {
    patterns: [/^-?\d+(\.\d+)?$/],
    functions: [],
    message: "Default for FLOAT must be a number (e.g. 0.0, 3.14)",
  },
  DOUBLE: {
    patterns: [/^-?\d+(\.\d+)?$/],
    functions: [],
    message: "Default for DOUBLE must be a number (e.g. 0.0, 3.14)",
  },
  DECIMAL: {
    patterns: [/^-?\d+(\.\d+)?$/],
    functions: [],
    message: "Default for DECIMAL must be a number (e.g. 0.0, 3.14)",
  },
  BOOLEAN: {
    patterns: [/^(true|false|0|1)$/i],
    functions: [],
    message: "Default for BOOLEAN must be true, false, 0, or 1",
  },
  DATE: {
    patterns: [/^\d{4}-\d{2}-\d{2}$/],
    functions: ["CURRENT_DATE", "NOW()"],
    message: "Default for DATE must be YYYY-MM-DD, CURRENT_DATE, or NOW()",
  },
  TIME: {
    patterns: [/^\d{2}:\d{2}(:\d{2})?$/],
    functions: ["CURRENT_TIME", "NOW()"],
    message:
      "Default for TIME must be HH:MM or HH:MM:SS, CURRENT_TIME, or NOW()",
  },
  DATETIME: {
    patterns: [/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/],
    functions: ["CURRENT_TIMESTAMP", "NOW()", "CURRENT_DATE"],
    message:
      "Default for DATETIME must be YYYY-MM-DD HH:MM:SS, CURRENT_TIMESTAMP, or NOW()",
  },
  TIMESTAMP: {
    patterns: [/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/],
    functions: ["CURRENT_TIMESTAMP", "NOW()"],
    message:
      "Default for TIMESTAMP must be YYYY-MM-DD HH:MM:SS, CURRENT_TIMESTAMP, or NOW()",
  },
  UUID: {
    functions: [],
    patterns: [
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-57][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    ],
    message: "Default for UUID must be a valid UUID",
  },
  CHAR: {
    patterns: [/^'(?:''|[^'])*'$/],
    functions: [],
    message: "Default for CHAR must be a valid SQL string literal",
  },
  VARCHAR: {
    patterns: [/^'(?:''|[^'])*'$/],
    functions: [],
    message: "Default for VARCHAR must be a valid SQL string literal",
  },
  TEXT: {
    patterns: [/^'(?:''|[^'])*'$/],
    functions: [],
    message: "Default for TEXT must be a valid SQL string literal",
  },
};
