import { z } from "zod";
import { TableSchema } from "./table-schema";
import { RefSchema } from "./ref.schema";
import { IndexSchema } from "./index.schema";
import { ResponsePaginationSchema } from "@/features/common/schemas/response-pagination";

type RawProject = {
  tables: z.infer<typeof TableSchema>[];
  refs: z.infer<typeof RefSchema>[];
  indexes: z.infer<typeof IndexSchema>[];
};
type TableMap = Map<string, z.infer<typeof TableSchema>>;
type Ctx = z.RefinementCtx;

// ─── Table Rules ─────────────────────────────────────────────────────────────

const validateTables = (tables: RawProject["tables"], ctx: Ctx): TableMap => {
  const tableMap: TableMap = new Map();
  const seen = new Set<string>();

  tables.forEach((table, i) => {
    if (seen.has(table.name)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate table name: "${table.name}"`,
        path: ["tables", i, "name"],
      });
    }
    seen.add(table.name);
    tableMap.set(table.name, table);
  });

  return tableMap;
};

// ─── Ref Rules ───────────────────────────────────────────────────────────────

const validateRefNames = (refs: RawProject["refs"], ctx: Ctx) => {
  const seen = new Set<string>();
  refs.forEach((ref, i) => {
    if (seen.has(ref.name)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate ref name: "${ref.name}"`,
        path: ["refs", i, "name"],
      });
    }
    seen.add(ref.name);
  });
};

const validateRefEndpoints = (
  refs: RawProject["refs"],
  tableMap: TableMap,
  ctx: Ctx,
) => {
  refs.forEach((ref, refIndex) => {
    ref.endpoints.forEach((ep, epIndex) => {
      const table = tableMap.get(ep.tableName);

      if (!table) {
        ctx.addIssue({
          code: "custom",
          message: `Table "${ep.tableName}" does not exist`,
          path: ["refs", refIndex, "endpoints", epIndex, "tableName"],
        });
        return;
      }

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
};

const validateRefTypeMatch = (
  refs: RawProject["refs"],
  tableMap: TableMap,
  ctx: Ctx,
) => {
  refs.forEach((ref, refIndex) => {
    const [a, b] = ref.endpoints;
    if (!a || !b) return;

    const fieldA = tableMap
      .get(a.tableName)
      ?.fields.find((f) => f.name === a.fieldName);
    const fieldB = tableMap
      .get(b.tableName)
      ?.fields.find((f) => f.name === b.fieldName);
    if (!fieldA || !fieldB) return;

    if (fieldA.type !== fieldB.type) {
      ctx.addIssue({
        code: "custom",
        message: `Type mismatch: "${a.tableName}.${a.fieldName}" is ${fieldA.type} but "${b.tableName}.${b.fieldName}" is ${fieldB.type}`,
        path: ["refs", refIndex, "endpoints"],
      });
    }
  });
};

const validateRefDuplicates = (refs: RawProject["refs"], ctx: Ctx) => {
  const seen = new Set<string>();

  refs.forEach((ref, i) => {
    const [a, b] = ref.endpoints;
    if (!a || !b) return;

    const key = [
      `${a.tableName}.${a.fieldName}`,
      `${b.tableName}.${b.fieldName}`,
    ]
      .sort()
      .join("--");

    if (seen.has(key)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate relationship between "${a.tableName}.${a.fieldName}" and "${b.tableName}.${b.fieldName}"`,
        path: ["refs", i],
      });
    }

    seen.add(key);
  });
};

const validateRefCycles = (
  refs: RawProject["refs"],
  tableMap: TableMap,
  ctx: Ctx,
) => {
  const graph = new Map<string, string[]>();
  tableMap.forEach((_, name) => graph.set(name, []));
  refs.forEach((ref) => {
    const [a, b] = ref.endpoints;
    if (!a || !b || !graph.has(a.tableName) || !graph.has(b.tableName)) return;
    graph.get(a.tableName)!.push(b.tableName);
  });

  const visited = new Set<string>();
  const stack = new Set<string>();
  const hasCycle = (node: string): boolean => {
    if (stack.has(node)) return true;
    if (visited.has(node)) return false;
    visited.add(node);
    stack.add(node);
    for (const neighbor of graph.get(node) ?? []) {
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
};

// ─── Index Rules ─────────────────────────────────────────────────────────────

const validateIndexNames = (indexes: RawProject["indexes"], ctx: Ctx) => {
  const seen = new Set<string>();
  indexes.forEach((index, i) => {
    if (seen.has(index.name)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate index name: "${index.name}"`,
        path: ["indexes", i, "name"],
      });
    }
    seen.add(index.name);
  });
};

const validateIndexFields = (
  indexes: RawProject["indexes"],
  tableMap: TableMap,
  ctx: Ctx,
) => {
  indexes.forEach((index, i) => {
    const table = tableMap.get(index.tableName);

    if (!table) {
      ctx.addIssue({
        code: "custom",
        message: `Index "${index.name}" references non-existent table "${index.tableName}"`,
        path: ["indexes", i, "tableName"],
      });
      return;
    }

    const fieldNameSet = new Set(table.fields.map((f) => f.name));
    const seenFields = new Set<string>();

    index.fields.forEach((field, j) => {
      if (!fieldNameSet.has(field)) {
        ctx.addIssue({
          code: "custom",
          message: `Index "${index.name}" references non-existent field "${field}" in table "${index.tableName}"`,
          path: ["indexes", i, "fields", j],
        });
      }

      if (seenFields.has(field)) {
        ctx.addIssue({
          code: "custom",
          message: `Duplicate field "${field}" in index "${index.name}"`,
          path: ["indexes", i, "fields", j],
        });
      }
      seenFields.add(field);
    });

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
};

const validateIndexSignatures = (indexes: RawProject["indexes"], ctx: Ctx) => {
  const seen = new Set<string>();
  indexes.forEach((index, i) => {
    const signature = `${index.tableName}::${[...index.fields].sort().join(",")}`;
    if (seen.has(signature)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate index on fields (${index.fields.join(", ")}) in table "${index.tableName}"`,
        path: ["indexes", i],
      });
    }
    seen.add(signature);
  });
};

// ─── Schema ──────────────────────────────────────────────────────────────────

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

    const tableMap = validateTables(tables, ctx);

    validateRefNames(refs, ctx);
    validateRefEndpoints(refs, tableMap, ctx);
    validateRefTypeMatch(refs, tableMap, ctx);
    validateRefDuplicates(refs, ctx);
    validateRefCycles(refs, tableMap, ctx);

    validateIndexNames(indexes, ctx);
    validateIndexFields(indexes, tableMap, ctx);
    validateIndexSignatures(indexes, ctx);
  });

// ─── Exports ─────────────────────────────────────────────────────────────────

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
