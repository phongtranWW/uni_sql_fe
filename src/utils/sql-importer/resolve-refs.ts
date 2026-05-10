import type { RefOperator } from "@/constants/ref-operator";
import type { ParsedFk } from "./parsers/alter-fk";
import type { ParsedUnique } from "./parsers/alter-unique";

export interface ResolvedRef {
  name: string;
  operator: RefOperator;
  from: { tableName: string; fieldName: string };
  to: { tableName: string; fieldName: string };
}

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
