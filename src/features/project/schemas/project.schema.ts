import { z } from "zod";
import { TableSchema } from "./table-schema";
import { RefSchema } from "./ref.schema";
import { ResponsePaginationSchema } from "@/features/common/schemas/response-pagination";
import { IndexSchema } from "./index.schema";

export const ProjectSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    tables: z.array(TableSchema),
    refs: z.array(RefSchema),
    indexes: z.array(IndexSchema).default([]),
  })
  .superRefine((project, ctx) => {
    const { tables, refs, indexes } = project;
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

    const indexNameSet = new Set<string>();
    indexes.forEach((index, i) => {
      // Không trùng tên index
      if (indexNameSet.has(index.name)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate index name: "${index.name}"`,
          path: ["indexes", i, "name"],
        });
      }
      indexNameSet.add(index.name);

      const table = tableMap.get(index.tableName);

      // Table phải tồn tại
      if (!table) {
        ctx.addIssue({
          code: "custom",
          message: `Index "${index.name}" references non-existent table "${index.tableName}"`,
          path: ["indexes", i, "tableName"],
        });
        return;
      }

      const fieldNameSet = new Set(table.fields.map((f) => f.name));

      // Field phải tồn tại trong table
      index.fields.forEach((field, j) => {
        if (!fieldNameSet.has(field)) {
          ctx.addIssue({
            code: "custom",
            message: `Index "${index.name}" references non-existent field "${field}" in table "${index.tableName}"`,
            path: ["indexes", i, "fields", j],
          });
        }
      });

      // Không trùng field trong cùng một index
      const indexFieldSet = new Set<string>();
      index.fields.forEach((field, j) => {
        if (indexFieldSet.has(field)) {
          ctx.addIssue({
            code: "custom",
            message: `Duplicate field "${field}" in index "${index.name}"`,
            path: ["indexes", i, "fields", j],
          });
        }
        indexFieldSet.add(field);
      });

      // Unique index trên PK thì thừa
      if (index.unique) {
        const pkFields = new Set(
          table.fields.filter((f) => f.pk).map((f) => f.name),
        );
        const isRedundant =
          index.fields.length === 1 && pkFields.has(index.fields[0]);
        if (isRedundant) {
          ctx.addIssue({
            code: "custom",
            message: `Unique index "${index.name}" is redundant because "${index.fields[0]}" is already a primary key`,
            path: ["indexes", i],
          });
        }
      }
    });

    // Không trùng index signature trên cùng một table (kể cả khác thứ tự field)
    const indexSignatureSet = new Set<string>();
    indexes.forEach((index, i) => {
      const signature = `${index.tableName}::${[...index.fields].sort().join(",")}`;
      if (indexSignatureSet.has(signature)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate index on fields (${index.fields.join(", ")}) in table "${index.tableName}"`,
          path: ["indexes", i],
        });
      }
      indexSignatureSet.add(signature);
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
