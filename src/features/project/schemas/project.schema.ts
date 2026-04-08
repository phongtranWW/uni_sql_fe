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
type ProjectRuleContext = {
  project: RawProject;
  tableMap: TableMap;
  ctx: Ctx;
};
type ProjectRule = (ruleCtx: ProjectRuleContext) => void;

const addIssue = (
  ctx: Ctx,
  message: string,
  path: Array<string | number>,
) => {
  ctx.addIssue({
    code: "custom",
    message,
    path,
  });
};

const validateUniqueBy = <T>(
  items: T[],
  getKey: (item: T) => string,
  onDuplicate: (item: T, index: number) => void,
) => {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    const key = getKey(item);
    if (seen.has(key)) {
      onDuplicate(item, index);
      return;
    }
    seen.add(key);
  });
};

// ─── Table Rules ─────────────────────────────────────────────────────────────

const validateTables = (tables: RawProject["tables"], ctx: Ctx): TableMap => {
  const tableMap: TableMap = new Map();
  validateUniqueBy(
    tables,
    (table) => table.name,
    (table, i) => {
      addIssue(ctx, `Duplicate table name: "${table.name}"`, ["tables", i, "name"]);
    },
  );

  tables.forEach((table) => {
    tableMap.set(table.name, table);
  });

  return tableMap;
};

// ─── Ref Rules ───────────────────────────────────────────────────────────────

const validateRefNames = (refs: RawProject["refs"], ctx: Ctx) => {
  validateUniqueBy(
    refs,
    (ref) => ref.name,
    (ref, i) => addIssue(ctx, `Duplicate ref name: "${ref.name}"`, ["refs", i, "name"]),
  );
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
        addIssue(ctx, `Table "${ep.tableName}" does not exist`, [
          "refs",
          refIndex,
          "endpoints",
          epIndex,
          "tableName",
        ]);
        return;
      }

      const fieldExists = table.fields.some((f) => f.name === ep.fieldName);
      if (!fieldExists) {
        addIssue(
          ctx,
          `Field "${ep.fieldName}" does not exist in table "${ep.tableName}"`,
          ["refs", refIndex, "endpoints", epIndex, "fieldName"],
        );
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
      addIssue(
        ctx,
        `Type mismatch: "${a.tableName}.${a.fieldName}" is ${fieldA.type} but "${b.tableName}.${b.fieldName}" is ${fieldB.type}`,
        ["refs", refIndex, "endpoints"],
      );
    }
  });
};

const validateRefDuplicates = (refs: RawProject["refs"], ctx: Ctx) => {
  validateUniqueBy(
    refs,
    (ref) => {
      const [a, b] = ref.endpoints;
      if (!a || !b) return `__skip__${ref.name}`;
      return [`${a.tableName}.${a.fieldName}`, `${b.tableName}.${b.fieldName}`]
        .sort()
        .join("--");
    },
    (ref, i) => {
      const [a, b] = ref.endpoints;
      if (!a || !b) return;
      addIssue(
        ctx,
        `Duplicate relationship between "${a.tableName}.${a.fieldName}" and "${b.tableName}.${b.fieldName}"`,
        ["refs", i],
      );
    },
  );
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
      addIssue(ctx, "Circular relationship detected", ["refs"]);
      break;
    }
  }
};

// ─── Index Rules ─────────────────────────────────────────────────────────────

const validateIndexNames = (indexes: RawProject["indexes"], ctx: Ctx) => {
  validateUniqueBy(
    indexes,
    (index) => index.name,
    (index, i) =>
      addIssue(ctx, `Duplicate index name: "${index.name}"`, [
        "indexes",
        i,
        "name",
      ]),
  );
};

const validateIndexFields = (
  indexes: RawProject["indexes"],
  tableMap: TableMap,
  ctx: Ctx,
) => {
  indexes.forEach((index, i) => {
    const table = tableMap.get(index.tableName);

    if (!table) {
      addIssue(
        ctx,
        `Index "${index.name}" references non-existent table "${index.tableName}"`,
        ["indexes", i, "tableName"],
      );
      return;
    }

    const fieldNameSet = new Set(table.fields.map((f) => f.name));
    const seenFields = new Set<string>();

    index.fields.forEach((field, j) => {
      if (!fieldNameSet.has(field)) {
        addIssue(
          ctx,
          `Index "${index.name}" references non-existent field "${field}" in table "${index.tableName}"`,
          ["indexes", i, "fields", j],
        );
      }

      if (seenFields.has(field)) {
        addIssue(ctx, `Duplicate field "${field}" in index "${index.name}"`, [
          "indexes",
          i,
          "fields",
          j,
        ]);
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
        addIssue(
          ctx,
          `Unique index "${index.name}" is redundant because "${index.fields[0]}" is already a primary key`,
          ["indexes", i],
        );
      }
    }
  });
};

const validateIndexSignatures = (indexes: RawProject["indexes"], ctx: Ctx) => {
  validateUniqueBy(
    indexes,
    (index) => `${index.tableName}::${[...index.fields].sort().join(",")}`,
    (index, i) =>
      addIssue(
        ctx,
        `Duplicate index on fields (${index.fields.join(", ")}) in table "${index.tableName}"`,
        ["indexes", i],
      ),
  );
};

const runProjectRules: ProjectRule[] = [
  ({ project, ctx }) => validateRefNames(project.refs, ctx),
  ({ project, tableMap, ctx }) => validateRefEndpoints(project.refs, tableMap, ctx),
  ({ project, tableMap, ctx }) => validateRefTypeMatch(project.refs, tableMap, ctx),
  ({ project, ctx }) => validateRefDuplicates(project.refs, ctx),
  ({ project, tableMap, ctx }) => validateRefCycles(project.refs, tableMap, ctx),
  ({ project, ctx }) => validateIndexNames(project.indexes, ctx),
  ({ project, tableMap, ctx }) => validateIndexFields(project.indexes, tableMap, ctx),
  ({ project, ctx }) => validateIndexSignatures(project.indexes, ctx),
];

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
    const tableMap = validateTables(project.tables, ctx);
    const ruleCtx: ProjectRuleContext = { project, tableMap, ctx };
    runProjectRules.forEach((rule) => rule(ruleCtx));
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
