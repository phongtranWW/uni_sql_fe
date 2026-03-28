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
