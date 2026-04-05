import { z } from "zod";
import { TableSchema } from "./table-schema";
import { RefSchema } from "./ref.schema";
import { ResponsePaginationSchema } from "@/features/common/schemas/response-pagination";

export const ProjectSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    tables: z.array(TableSchema),
    refs: z.array(RefSchema),
  })
  .superRefine((project, ctx) => {
    const { tables, refs } = project;
    const tableNameSet = new Set<string>();
    tables.forEach((table, index) => {
      if (tableNameSet.has(table.name)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate table name: ${table.name}`,
          path: ["tables", index, "name"],
        });
      }
      tableNameSet.add(table.name);
    });

    const refNameSet = new Set<string>();
    refs.forEach((ref, index) => {
      if (refNameSet.has(ref.name)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate ref name: ${ref.name}`,
          path: ["refs", index, "name"],
        });
      }
      refNameSet.add(ref.name);
    });

    refs.forEach((ref, refIndex) => {
      ref.endpoints.forEach((ep, epIndex) => {
        if (!tableNameSet.has(ep.tableName)) {
          ctx.addIssue({
            code: "custom",
            message: `Table "${ep.tableName}" does not exist`,
            path: ["refs", refIndex, "endpoints", epIndex, "tableName"],
          });
        }
      });
    });

    const graph = new Map<string, string[]>();
    tables.forEach((t) => graph.set(t.name, []));
    refs.forEach((ref) => {
      const [a, b] = ref.endpoints;
      if (!a || !b) return;
      if (!graph.has(a.tableName) || !graph.has(b.tableName)) return;
      graph.get(a.tableName)!.push(b.tableName);
    });
    const visited = new Set<string>();
    const stack = new Set<string>();
    const hasCycle = (node: string): boolean => {
      if (stack.has(node)) return true;
      if (visited.has(node)) return false;
      visited.add(node);
      stack.add(node);
      for (const neighbor of graph.get(node) || []) {
        if (hasCycle(neighbor)) return true;
      }
      stack.delete(node);
      return false;
    };

    for (const node of graph.keys()) {
      if (hasCycle(node)) {
        ctx.addIssue({
          code: "custom",
          message: "Circular relationship detected",
          path: ["refs"],
        });
        break;
      }
    }

    const relationSet = new Set<string>();
    refs.forEach((ref, index) => {
      const [a, b] = ref.endpoints;
      if (!a || !b) return;
      const key1 = `${a.tableName}-${b.tableName}`;
      const key2 = `${b.tableName}-${a.tableName}`;
      if (relationSet.has(key1) || relationSet.has(key2)) {
        ctx.addIssue({
          code: "custom",
          message: "Duplicate relationship between tables",
          path: ["refs", index],
        });
      }
      relationSet.add(key1);
    });

    const tableMap = new Map(tables.map((t) => [t.name, t]));
    refs.forEach((ref, refIndex) => {
      ref.endpoints.forEach((ep, epIndex) => {
        const table = tableMap.get(ep.tableName);
        if (!table) return;

        const fieldExists = table.fields.some((f) => f.name === ep.fieldName);

        if (!fieldExists) {
          ctx.addIssue({
            code: "custom",
            message: `Field "${ep.fieldName}" does not exist in table "${ep.tableName}"`,
            path: ["refs", refIndex, "endpoints", epIndex, "fieldName"],
          });
        }
      });
    });

    refs.forEach((ref, refIndex) => {
      const [a, b] = ref.endpoints;
      if (!a || !b) return;

      const tableA = tableMap.get(a.tableName);
      const tableB = tableMap.get(b.tableName);
      if (!tableA || !tableB) return;

      const fieldA = tableA.fields.find((f) => f.name === a.fieldName);
      const fieldB = tableB.fields.find((f) => f.name === b.fieldName);
      if (!fieldA || !fieldB) return;

      if (fieldA.type !== fieldB.type) {
        ctx.addIssue({
          code: "custom",
          message: `Type mismatch: "${a.tableName}.${a.fieldName}" is ${fieldA.type} but "${b.tableName}.${b.fieldName}" is ${fieldB.type}`,
          path: ["refs", refIndex, "endpoints"],
        });
      }
    });
  });

export const ProjectSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type ProjectSummary = z.infer<typeof ProjectSummarySchema>;
export type ProjectSummaryPage = z.infer<
  ReturnType<typeof ResponsePaginationSchema<typeof ProjectSummarySchema>>
>;
