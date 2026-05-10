import type { Faker } from "@faker-js/faker";
import type { FieldType } from "@/constants/field-types";
import type { SchemaColumn } from "@/lib/sql-engine";
import { pickColumnHint } from "./column-heuristics";

/**
 * Produce one fake JS value for the given column.
 *
 * The function is intentionally NOT a closure factory: it is called per row
 * by the orchestrator, with `seenValues` re-used across rows so we can
 * enforce UNIQUE constraints without external state.
 *
 * For `INT` UNIQUE we use a counter (`seenValues.size + 1`) to guarantee
 * progress; for string types we retry up to 5 times before suffixing.
 */
export function generateValueForColumn(
  faker: Faker,
  column: SchemaColumn,
  fieldType: FieldType,
  seenValues: Set<unknown>,
): unknown {
  const enforceUnique = column.isUnique || column.isPrimaryKey;
  const cap = column.maxLength ?? undefined;

  const tryGenerate = (): unknown => {
    switch (fieldType) {
      case "INT": {
        if (enforceUnique) return seenValues.size + 1;
        return faker.number.int({ min: 1, max: 100_000 });
      }
      case "FLOAT":
        return faker.number.float({ min: 0, max: 1000, fractionDigits: 2 });
      case "DOUBLE":
        return faker.number.float({ min: 0, max: 1_000_000, fractionDigits: 4 });
      case "DECIMAL":
        return faker.finance.amount({ min: 1, max: 10000, dec: 2 });

      case "BOOLEAN":
        return faker.datatype.boolean();

      case "DATE":
        return faker.date.past({ years: 5 }).toISOString().slice(0, 10);
      case "TIME":
        return faker.date.recent().toTimeString().slice(0, 8);
      case "DATETIME":
        return faker.date
          .recent({ days: 365 })
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
      case "TIMESTAMP":
        return faker.date.recent({ days: 365 }).toISOString();

      case "UUID":
        return faker.string.uuid();

      case "CHAR":
        // CHAR(n) — pad/trim to exactly `cap` chars when we know it.
        if (cap && cap > 0) return faker.string.alpha({ length: cap });
        return faker.string.alpha({ length: 1 });

      case "VARCHAR":
      case "TEXT": {
        const hint = pickColumnHint(column.name);
        const raw = hint ? hint.generate(faker) : faker.lorem.words({ min: 2, max: 4 });
        if (cap && raw.length > cap) return raw.slice(0, cap);
        return raw;
      }
    }
  };

  if (!enforceUnique) return tryGenerate();

  // UNIQUE retry loop. INT counter case already guarantees uniqueness.
  let candidate = tryGenerate();
  for (let attempt = 0; attempt < 5; attempt++) {
    if (!seenValues.has(candidate)) return candidate;
    candidate = tryGenerate();
  }
  // Last-ditch suffix to break ties for string types.
  if (typeof candidate === "string") {
    const suffix = `_${seenValues.size + 1}`;
    if (cap && candidate.length + suffix.length > cap) {
      candidate = candidate.slice(0, cap - suffix.length) + suffix;
    } else {
      candidate = candidate + suffix;
    }
  }
  return candidate;
}
