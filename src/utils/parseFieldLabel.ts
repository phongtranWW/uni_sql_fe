import type { FieldType } from "@/types/database-diagram";
import type { DatabaseType } from "@/types/database-type";

const CONVERTER: Record<
  DatabaseType,
  Record<string, (args: string | null) => string>
> = {
  postgres: {
    varchar: (args) => {
      if (args) return `varchar(${args})`;
      return "varchar(255)";
    },
    numeric: (args) => {
      if (args) return `numeric(${args})`;
      return "numeric(10,2)";
    },
    integer: () => "integer",
    smallint: () => "smallint",
    bigint: () => "bigint",
    boolean: () => "boolean",
    text: () => "text",
    date: () => "date",
    timestamp: () => "timestamp",
  },
  mysql: {},
};

export default function parseFieldLabel(
  fieldType: FieldType,
  databaseType: DatabaseType
): string | null {
  const converter = CONVERTER[databaseType][fieldType.type_name.toLowerCase()];
  if (!converter) return null;
  return converter(fieldType.args);
}
