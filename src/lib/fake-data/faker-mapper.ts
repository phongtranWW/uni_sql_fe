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
      case "int":
      case "smallint": {
        if (enforceUnique) return seenValues.size + 1;
        return faker.number.int({ min: 1, max: 100_000 });
      }
      case "bigint": {
        if (enforceUnique) return seenValues.size + 1;
        return faker.number.int({ min: 1, max: 1_000_000_000 });
      }
      case "float":
        return faker.number.float({ min: 0, max: 1000, fractionDigits: 2 });
      case "double":
        return faker.number.float({ min: 0, max: 1_000_000, fractionDigits: 4 });
      case "decimal":
        return faker.finance.amount({ min: 1, max: 10000, dec: 2 });

      case "boolean":
        return faker.datatype.boolean();

      case "date":
        return faker.date.past({ years: 5 }).toISOString().slice(0, 10);
      case "datetime":
        return faker.date
          .recent({ days: 365 })
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");
      case "timestamp":
        return faker.date.recent({ days: 365 }).toISOString();

      case "uuid":
        return faker.string.uuid();

      case "varchar":
      case "text": {
        const hint = pickColumnHint(column.name);
        const raw = hint ? hint.generate(faker) : faker.lorem.words({ min: 2, max: 4 });
        if (cap && raw.length > cap) return raw.slice(0, cap);
        return raw;
      }

      case "json":
        return JSON.stringify({
          id: faker.string.uuid(),
          value: faker.lorem.words({ min: 1, max: 3 }),
        });
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
