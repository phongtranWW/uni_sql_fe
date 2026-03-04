import type { Database } from "@/features/database/schemas/database";
import type { Field } from "@/features/database/schemas/field";
import type { Ref, RefOperator } from "@/features/database/schemas/ref";
import type { Table } from "@/features/database/schemas/table";
import { generateTableHeaderColor } from "./generators/tables";

export const tableToDbml = (table: Table) => {
  const header = table.alias
    ? `Table ${table.name} as ${table.alias}`
    : `Table ${table.name}`;

  const fields = table.fields.map((f) => {
    const constraints: string[] = [];
    if (f.pk) constraints.push("pk");
    if (f.unique) constraints.push("unique");
    if (f.not_null) constraints.push("not null");
    if (f.increment) constraints.push("increment");

    const constraintStr =
      constraints.length > 0 ? ` [${constraints.join(", ")}]` : "";

    return `  ${f.name} ${f.type}${constraintStr}`;
  });

  return `${header} {\n${fields.join("\n")}\n}`;
};

export const refToDbml = (ref: Ref) => {
  const [a, b] = ref.endpoints;
  const namePrefix = ref.name ? `Ref ${ref.name}` : "Ref";
  return `${namePrefix}: ${a.tableName}.${a.fieldName} ${ref.operator} ${b.tableName}.${b.fieldName}`;
};

export const databaseToDbml = (database: Database) => {
  const parts: string[] = [];

  for (const table of database.tables) {
    parts.push(tableToDbml(table));
  }

  for (const ref of database.refs) {
    parts.push(refToDbml(ref));
  }

  return parts.join("\n\n");
};

export const dbmlToDatabase = (dbml: string): Database => {
  const tables: Table[] = [];
  const refs: Ref[] = [];

  const lines = dbml
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\/\/.*$/, "").trimEnd());

  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    const tableMatch = line.match(
      /^Table\s+(\w+)(?:\s+as\s+(\w+))?\s*(?:\[.*\])?\s*\{/,
    );
    if (tableMatch) {
      const tableName = tableMatch[1];
      const alias = tableMatch[2] ?? null;
      const fields: Field[] = [];
      i++;

      while (i < lines.length && lines[i].trim() !== "}") {
        const fieldLine = lines[i].trim();

        if (!fieldLine || fieldLine.startsWith("Note")) {
          i++;
          continue;
        }

        const fieldMatch = fieldLine.match(
          new RegExp(
            String.raw`^(\w+)\s+([\w\s\(\),]+?)(?:\s+\[([^\]]*)\])?\s*$`,
          ),
        );
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          const fieldType = fieldMatch[2].trim();
          const constraintStr = fieldMatch[3] ?? "";
          const constraints = constraintStr
            .split(",")
            .map((c) => c.trim().toLowerCase());

          fields.push({
            name: fieldName,
            type: fieldType,
            pk: constraints.includes("pk"),
            unique: constraints.includes("unique"),
            not_null: constraints.includes("not null"),
            increment: constraints.includes("increment"),
          });
        }

        i++;
      }

      tables.push({
        name: tableName,
        alias,
        fields,
        headerColor: generateTableHeaderColor(),
        isSelected: false,
      });
      i++;
      continue;
    }

    const inlineRefMatch = line.match(
      /^Ref\s*(\w*)\s*:\s*(\w+)\.(\w+)\s*([-<>])\s*(\w+)\.(\w+)/,
    );
    if (inlineRefMatch) {
      const [, name, t1, f1, op, t2, f2] = inlineRefMatch;
      refs.push({
        name,
        operator: op as RefOperator,
        endpoints: [
          { tableName: t1, fieldName: f1 },
          { tableName: t2, fieldName: f2 },
        ],
        isSelected: false,
      });
      i++;
      continue;
    }

    const blockRefMatch = line.match(/^Ref\s*(\w*)\s*\{/);
    if (blockRefMatch) {
      const name = blockRefMatch[1];
      i++;
      while (i < lines.length && lines[i].trim() !== "}") {
        const refLine = lines[i].trim();
        const refBodyMatch = refLine.match(
          /^(\w+)\.(\w+)\s*([-<>])\s*(\w+)\.(\w+)/,
        );
        if (refBodyMatch) {
          const [, t1, f1, op, t2, f2] = refBodyMatch;
          refs.push({
            name,
            operator: op as RefOperator,
            endpoints: [
              { tableName: t1, fieldName: f1 },
              { tableName: t2, fieldName: f2 },
            ],
            isSelected: false,
          });
        }
        i++;
      }
      i++;
      continue;
    }

    i++;
  }

  return { tables, refs };
};
