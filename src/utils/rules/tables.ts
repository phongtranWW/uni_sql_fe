import type { Table } from "@/features/database/schemas/table";

const IDENTIFIER_REGEX = RegExp(/^[a-zA-Z_][a-zA-Z0-9_]*$/);
const RESERVED_KEYWORDS = [
  "select",
  "table",
  "where",
  "insert",
  "update",
  "delete",
  "from",
  "join",
  "group",
  "order",
  "by",
];

export const isTableNameValid = (name: string): void => {
  if (!name) {
    throw new Error("Table name is required.");
  }

  if (name.length > 50) {
    throw new Error(`Table name must not exceed ${50} characters.`);
  }

  if (!IDENTIFIER_REGEX.test(name)) {
    throw new Error(
      "Table name must start with letter/underscore and contain only letters, numbers, underscore.",
    );
  }

  if (RESERVED_KEYWORDS.includes(name.toLowerCase())) {
    throw new Error("Table name cannot be a SQL reserved keyword.");
  }
};

export const isTableAliasValid = (alias: string): void => {
  if (alias.length > 20) {
    throw new Error(`Alias must not exceed ${20} characters.`);
  }

  if (!IDENTIFIER_REGEX.test(alias)) {
    throw new Error(
      "Alias must start with letter/underscore and contain only letters, numbers, underscore.",
    );
  }

  if (RESERVED_KEYWORDS.includes(alias.toLowerCase())) {
    throw new Error("Alias cannot be a SQL reserved keyword.");
  }
};

export const isTableNameUnique = (tables: Table[], name: string): void => {
  const exists = tables.some(
    (t) => t.name.toLowerCase() === name.toLowerCase(),
  );

  if (exists) {
    throw new Error("Table name already exists.");
  }
};
