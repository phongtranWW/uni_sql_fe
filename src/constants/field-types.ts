export const FIELD_TYPES = [
  "int",
  "bigint",
  "smallint",
  "decimal",
  "float",
  "double",
  "varchar",
  "text",
  "boolean",
  "date",
  "datetime",
  "timestamp",
  "uuid",
  "json",
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
  int: {
    patterns: [/^-?\d+$/],
    functions: [],
    message: "Default for int must be an integer (e.g. 0, -1, 42)",
  },
  bigint: {
    patterns: [/^-?\d+$/],
    functions: [],
    message: "Default for bigint must be an integer (e.g. 0, -1, 42)",
  },
  smallint: {
    patterns: [/^-?\d+$/],
    functions: [],
    message: "Default for smallint must be an integer (e.g. 0, -1, 42)",
  },
  float: {
    patterns: [/^-?\d+(\.\d+)?$/],
    functions: [],
    message: "Default for float must be a number (e.g. 0.0, 3.14)",
  },
  double: {
    patterns: [/^-?\d+(\.\d+)?$/],
    functions: [],
    message: "Default for double must be a number (e.g. 0.0, 3.14)",
  },
  decimal: {
    patterns: [/^-?\d+(\.\d+)?$/],
    functions: [],
    message: "Default for decimal must be a number (e.g. 0.0, 3.14)",
  },
  boolean: {
    patterns: [/^(true|false|0|1)$/i],
    functions: [],
    message: "Default for boolean must be true, false, 0, or 1",
  },
  date: {
    patterns: [/^\d{4}-\d{2}-\d{2}$/],
    functions: ["CURRENT_DATE", "NOW()"],
    message: "Default for date must be YYYY-MM-DD, CURRENT_DATE, or NOW()",
  },
  datetime: {
    patterns: [/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/],
    functions: ["CURRENT_TIMESTAMP", "NOW()", "CURRENT_DATE"],
    message:
      "Default for datetime must be YYYY-MM-DD HH:MM:SS, CURRENT_TIMESTAMP, or NOW()",
  },
  timestamp: {
    patterns: [/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/],
    functions: ["CURRENT_TIMESTAMP", "NOW()"],
    message:
      "Default for timestamp must be YYYY-MM-DD HH:MM:SS, CURRENT_TIMESTAMP, or NOW()",
  },
  uuid: {
    functions: ["gen_random_uuid()", "uuid_generate_v4()"],
    patterns: [
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-57][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    ],
    message: "Default for uuid must be a valid UUID or gen_random_uuid()",
  },
  varchar: {
    patterns: [/^'(?:''|[^'])*'$/],
    functions: [],
    message: "Default for varchar must be a valid SQL string literal",
  },
  text: {
    patterns: [/^'(?:''|[^'])*'$/],
    functions: [],
    message: "Default for text must be a valid SQL string literal",
  },
  json: {
    patterns: [/^'(?:''|[^'])*'$/],
    functions: [],
    message: "Default for json must be a valid JSON string literal",
  },
};
