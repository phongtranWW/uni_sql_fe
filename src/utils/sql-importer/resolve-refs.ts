import type { RefOperator } from "@/constants/ref-operator";
import type { ParsedFk } from "./parsers/alter-fk";
import type { ParsedUnique } from "./parsers/alter-unique";

export interface ResolvedRef {
  name: string;
  operator: RefOperator;
  from: { tableName: string; fieldName: string };
  to: { tableName: string; fieldName: string };
}

/**
 * Determine the ref operator for each FK constraint.
 *
 * Logic (from EXPORTER.md §6):
 * - Default operator is `>` (many-to-one).
 * - If there is a matching `ADD … UNIQUE uq_<refName>` on the FK column,
 *   the relationship is one-to-one → operator `-`.
 * - `<` (one-to-many) cannot be recovered from plain SQL without naming
 *   conventions, so all plain FKs are mapped as `>`.
 *
 * The uqSet key format mirrors the exporter skeleton:
 *   `${fromTable}.${fromField}::${fkName}`
 */
export function resolveRefs(
  fks: ParsedFk[],
  uniques: ParsedUnique[],
): ResolvedRef[] {
  const uqSet = new Set<string>(
    uniques.map((uq) => `${uq.table}.${uq.field}::${uq.refName}`),
  );

  return fks.map((fk) => {
    const key = `${fk.fromTable}.${fk.fromField}::${fk.name}`;
    const operator: RefOperator = uqSet.has(key) ? "-" : ">";

    return {
      name: fk.name,
      operator,
      from: { tableName: fk.fromTable, fieldName: fk.fromField },
      to: { tableName: fk.toTable, fieldName: fk.toField },
    };
  });
}
