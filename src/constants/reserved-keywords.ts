export const RESERVED_KEYWORDS: string[] = [
  // core query
  "select",
  "insert",
  "update",
  "delete",
  "from",
  "where",
  "join",
  "inner",
  "left",
  "right",
  "full",
  "on",
  "and",
  "or",
  "not",
  "in",
  "is",
  "null",
  "like",
  "between",
  "exists",

  // ddl
  "create",
  "alter",
  "drop",
  "table",
  "database",
  "index",
  "view",

  // constraints
  "primary",
  "key",
  "foreign",
  "references",
  "unique",
  "check",
  "default",

  // grouping / sorting
  "group",
  "by",
  "order",
  "having",
  "limit",
  "offset",

  // set operations
  "union",
  "all",
  "distinct",

  // case
  "case",
  "when",
  "then",
  "else",
  "end",

  // user / session
  "user",
  "current_user",
  "session_user",

  // types & literals
  "true",
  "false",

  // problematic names (thực tế hay gây lỗi)
  "order",
  "group",
  "user",
  "table",
  "select",
];
