export type SqlDialect = "postgresql" | "mysql";

export interface ImportWarning {
  code:
    | "UNSUPPORTED_TYPE"
    | "PARSE_ERROR"
    | "UNKNOWN_STATEMENT"
    | "COMPOSITE_PK"
    | "INLINE_REFERENCES";
  message: string;
  statement?: string;
}
