import type { z } from "zod";
import { IndexValidateSchema } from "./schemas/index.schema";
import type { RefValidate } from "./schemas/ref.schema";
import type { TableValidate } from "./schemas/table-schema";

export type ProjectValidateOutput = {
  name: string;
  tables: Record<string, TableValidate>;
  refs: Record<string, RefValidate>;
  indexes: Record<string, z.infer<typeof IndexValidateSchema>>;
};

export type ProjectValidateRule = (
  project: ProjectValidateOutput,
  ctx: z.RefinementCtx,
) => void;

/** [REF - 01] Ensure all referenced tables exist */
const refTablesExist: ProjectValidateRule = (project, ctx) => {
  Object.entries(project.refs).forEach(([refName, ref]) => {
    const { from, to } = ref.endpoints;
    if (!project.tables[from.tableName]) {
      ctx.addIssue({
        code: "custom",
        message: `Table "${from.tableName}" does not exist`,
        path: ["refs", refName, "endpoints", "from", "tableName"],
      });
    }
    if (!project.tables[to.tableName]) {
      ctx.addIssue({
        code: "custom",
        message: `Table "${to.tableName}" does not exist`,
        path: ["refs", refName, "endpoints", "to", "tableName"],
      });
    }
  });
};

/** [REF - 02] Ensure all referenced fields exist and types match */
const refFieldTypesMatch: ProjectValidateRule = (project, ctx) => {
  Object.entries(project.refs).forEach(([refName, ref]) => {
    const { from, to } = ref.endpoints;
    const fromField = project.tables[from.tableName]?.fields[from.fieldName];
    const toField = project.tables[to.tableName]?.fields[to.fieldName];
    if (!fromField || !toField) return;
    if (fromField.type !== toField.type) {
      ctx.addIssue({
        code: "custom",
        message: `Field types do not match: "${from.tableName}.${from.fieldName}" (${fromField.type}) and "${to.tableName}.${to.fieldName}" (${toField.type})`,
        path: ["refs", refName],
      });
    }
  });
};

/** [REF - 03] Detect circular relationships between tables using DFS */
const refCycles: ProjectValidateRule = (project, ctx) => {
  const graph = new Map<string, Set<string>>();
  Object.keys(project.tables).forEach((name) => graph.set(name, new Set()));

  Object.values(project.refs).forEach((ref) => {
    const { from, to } = ref.endpoints;
    if (from.tableName === to.tableName) return;
    if (!graph.has(from.tableName) || !graph.has(to.tableName)) return;
    graph.get(from.tableName)!.add(to.tableName);
  });

  const visited = new Set<string>();
  const stack = new Set<string>();
  const path: string[] = [];

  const dfs = (node: string): string | null => {
    if (stack.has(node)) return node;
    if (visited.has(node)) return null;
    visited.add(node);
    stack.add(node);
    path.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      const cycleNode = dfs(neighbor);
      if (cycleNode !== null) return cycleNode;
    }
    stack.delete(node);
    path.pop();
    return null;
  };

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      const cycleNode = dfs(node);
      if (cycleNode !== null) {
        const cycleStart = path.findIndex((n) => n === cycleNode);
        const cycle = path.slice(cycleStart);
        ctx.addIssue({
          code: "custom",
          message: `Circular relationship detected: ${[...cycle, cycleNode].join(" → ")}`,
          path: ["refs"],
        });
        break;
      }
    }
  }
};

/** [INDEX - 01] Ensure all referenced tables exist */
const indexTablesExist: ProjectValidateRule = (project, ctx) => {
  Object.entries(project.indexes).forEach(([indexName, index]) => {
    if (!project.tables[index.tableName]) {
      ctx.addIssue({
        code: "custom",
        message: `Table "${index.tableName}" does not exist`,
        path: ["indexes", indexName, "tableName"],
      });
    }
  });
};

/** [INDEX - 02] Ensure all referenced fields exist */
const indexFieldsExist: ProjectValidateRule = (project, ctx) => {
  Object.entries(project.indexes).forEach(([indexName, index]) => {
    const table = project.tables[index.tableName];
    if (!table) return;
    index.fields.forEach((field, j) => {
      if (!table.fields[field]) {
        ctx.addIssue({
          code: "custom",
          message: `Field "${field}" does not exist in table "${index.tableName}"`,
          path: ["indexes", indexName, "fields", j],
        });
      }
    });
  });
};

/** [INDEX - 03] Ensure all fields are unique within each index */
const indexFieldsUnique: ProjectValidateRule = (project, ctx) => {
  Object.entries(project.indexes).forEach(([indexName, index]) => {
    const seen = new Set<string>();
    index.fields.forEach((field, j) => {
      if (seen.has(field)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate field "${field}" in index "${indexName}"`,
          path: ["indexes", indexName, "fields", j],
        });
      }
      seen.add(field);
    });
  });
};

/** [INDEX - 04] Ensure all indexes are unique per table + field set */
const indexesUnique: ProjectValidateRule = (project, ctx) => {
  const seen = new Set<string>();
  Object.entries(project.indexes).forEach(([indexName, index]) => {
    const signature = `${index.tableName}::${[...index.fields].sort().join(",")}`;
    if (seen.has(signature)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate index on fields (${index.fields.join(", ")}) in table "${index.tableName}"`,
        path: ["indexes", indexName],
      });
    }
    seen.add(signature);
  });
};

export const projectValidateRules: ProjectValidateRule[] = [
  refTablesExist,
  refFieldTypesMatch,
  refCycles,
  indexTablesExist,
  indexFieldsExist,
  indexFieldsUnique,
  indexesUnique,
];
