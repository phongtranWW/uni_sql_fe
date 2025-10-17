import type { FieldType } from "@/types/database-diagram";
import type { DatabaseType } from "@/types/database-type";

const CONVERTER: Record<
  DatabaseType,
  Record<string, (args: string | null) => FieldType | null>
> = {
  postgres: {
    varchar: (args) => {
      if (!args) return { schemaName: null, type_name: "varchar", args: "255" };
      if (!/^(?:[1-9]?\d|1\d{2}|2[0-4]\d|25[0-5])$/.test(args)) return null;
      return { schemaName: null, type_name: "varchar", args };
    },
    numeric: (args) => {
      if (!args)
        return { schemaName: null, type_name: "numeric", args: "10,2" };

      const match = args.match(/^([1-9]|[1-2]\d|3[0-8])\s*,\s*(\d+)$/);
      if (!match) return null;

      const precision = Number(match[1]);
      const scale = Number(match[2]);

      if (scale > precision) return null;

      return {
        schemaName: null,
        type_name: "numeric",
        args: `${precision},${scale}`,
      };
    },
    smallint: () => ({ schemaName: null, type_name: "smallint", args: null }),
    integer: () => ({ schemaName: null, type_name: "integer", args: null }),
    bigint: () => ({ schemaName: null, type_name: "bigint", args: null }),
    boolean: () => ({ schemaName: null, type_name: "boolean", args: null }),
    text: () => ({ schemaName: null, type_name: "text", args: null }),
    date: () => ({ schemaName: null, type_name: "date", args: null }),
    timestamp: () => ({ schemaName: null, type_name: "timestamp", args: null }),
  },
  mysql: {},
};

export default function parseFieldType(
  value: string | null,
  databaseType: DatabaseType
) {
  if (!value) return null;

  const match = value.toLowerCase().match(/^(\w+)(?:\(([^)]+)\))?$/);
  if (!match) return null;

  const [, typeName, args] = match;
  const converter = CONVERTER[databaseType][typeName];

  if (!converter) return null;
  return converter(args ?? null);
}
