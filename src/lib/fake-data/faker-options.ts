import { faker } from "@faker-js/faker";

export interface FakerOption {
  id: string;
  label: string;
  generate: () => unknown;
}

export type ColumnGenerationMode = "faker" | "default";

export interface ColumnConfig {
  mode: ColumnGenerationMode;
  fakerId?: string;
  defaultValue?: string;
}

/**
 * Maps each field type to available faker function options.
 * Users can choose from these options when configuring column generation.
 */
export const FAKER_OPTIONS_BY_TYPE: Partial<Record<string, FakerOption[]>> = {
  int: [
    { id: "number", label: "Random number", generate: () => faker.number.int({ min: 1, max: 1000000 }) },
    { id: "age", label: "Age (1-100)", generate: () => faker.number.int({ min: 1, max: 100 }) },
    { id: "year", label: "Year", generate: () => faker.date.past({ years: 50 }).getFullYear() },
    { id: "quantity", label: "Quantity (1-100)", generate: () => faker.number.int({ min: 1, max: 100 }) },
  ],
  integer: [
    { id: "number", label: "Random number", generate: () => faker.number.int({ min: 1, max: 1000000 }) },
    { id: "age", label: "Age (1-100)", generate: () => faker.number.int({ min: 1, max: 100 }) },
    { id: "year", label: "Year", generate: () => faker.date.past({ years: 50 }).getFullYear() },
    { id: "quantity", label: "Quantity (1-100)", generate: () => faker.number.int({ min: 1, max: 100 }) },
  ],
  bigint: [
    { id: "bigint", label: "Large number", generate: () => faker.number.bigInt({ min: 1n, max: 9999999999n }).toString() },
    { id: "timestamp", label: "Unix timestamp", generate: () => Math.floor(faker.date.recent().getTime() / 1000) },
  ],
  smallint: [
    { id: "smallint", label: "Small number", generate: () => faker.number.int({ min: 1, max: 32767 }) },
    { id: "age", label: "Age", generate: () => faker.number.int({ min: 1, max: 100 }) },
    { id: "rating", label: "Rating (1-5)", generate: () => faker.number.int({ min: 1, max: 5 }) },
  ],
  decimal: [
    { id: "decimal", label: "Decimal number", generate: () => faker.number.float({ min: 0, max: 10000, fractionDigits: 2 }) },
    { id: "price", label: "Price", generate: () => faker.commerce.price({ min: 1, max: 10000, dec: 2 }) },
    { id: "percentage", label: "Percentage", generate: () => faker.number.float({ min: 0, max: 100, fractionDigits: 2 }) },
  ],
  numeric: [
    { id: "numeric", label: "Numeric value", generate: () => faker.number.float({ min: 0, max: 10000, fractionDigits: 2 }) },
    { id: "price", label: "Price", generate: () => faker.commerce.price({ min: 1, max: 10000, dec: 2 }) },
  ],
  double: [
    { id: "double", label: "Double precision", generate: () => faker.number.float({ min: 0, max: 1000000, fractionDigits: 6 }) },
    { id: "latitude", label: "Latitude", generate: () => faker.location.latitude() },
    { id: "longitude", label: "Longitude", generate: () => faker.location.longitude() },
  ],
  varchar: [
    { id: "word", label: "Random word", generate: () => faker.word.sample() },
    { id: "name", label: "Full name", generate: () => faker.person.fullName() },
    { id: "firstName", label: "First name", generate: () => faker.person.firstName() },
    { id: "lastName", label: "Last name", generate: () => faker.person.lastName() },
    { id: "email", label: "Email", generate: () => faker.internet.email() },
    { id: "username", label: "Username", generate: () => faker.internet.username() },
    { id: "phone", label: "Phone number", generate: () => faker.phone.number() },
    { id: "address", label: "Street address", generate: () => faker.location.streetAddress() },
    { id: "city", label: "City", generate: () => faker.location.city() },
    { id: "country", label: "Country", generate: () => faker.location.country() },
    { id: "company", label: "Company name", generate: () => faker.company.name() },
    { id: "jobTitle", label: "Job title", generate: () => faker.person.jobTitle() },
    { id: "url", label: "URL", generate: () => faker.internet.url() },
    { id: "color", label: "Color", generate: () => faker.color.human() },
  ],
  "character varying": [
    { id: "word", label: "Random word", generate: () => faker.word.sample() },
    { id: "name", label: "Full name", generate: () => faker.person.fullName() },
    { id: "firstName", label: "First name", generate: () => faker.person.firstName() },
    { id: "lastName", label: "Last name", generate: () => faker.person.lastName() },
    { id: "email", label: "Email", generate: () => faker.internet.email() },
    { id: "username", label: "Username", generate: () => faker.internet.username() },
    { id: "phone", label: "Phone number", generate: () => faker.phone.number() },
    { id: "address", label: "Street address", generate: () => faker.location.streetAddress() },
    { id: "city", label: "City", generate: () => faker.location.city() },
    { id: "country", label: "Country", generate: () => faker.location.country() },
    { id: "company", label: "Company name", generate: () => faker.company.name() },
    { id: "jobTitle", label: "Job title", generate: () => faker.person.jobTitle() },
    { id: "url", label: "URL", generate: () => faker.internet.url() },
    { id: "color", label: "Color", generate: () => faker.color.human() },
  ],
  char: [
    { id: "char", label: "Single character", generate: () => faker.string.alpha(1) },
    { id: "letter", label: "Letter", generate: () => faker.string.alpha({ length: 1, casing: "upper" }) },
  ],
  text: [
    { id: "sentence", label: "Sentence", generate: () => faker.lorem.sentence() },
    { id: "paragraph", label: "Paragraph", generate: () => faker.lorem.paragraph() },
    { id: "paragraphs", label: "Multiple paragraphs", generate: () => faker.lorem.paragraphs(3) },
    { id: "description", label: "Product description", generate: () => faker.commerce.productDescription() },
  ],
  boolean: [
    { id: "boolean", label: "Random true/false", generate: () => faker.datatype.boolean() },
    { id: "mostlyTrue", label: "Mostly true (80%)", generate: () => faker.datatype.boolean({ probability: 0.8 }) },
    { id: "mostlyFalse", label: "Mostly false (20%)", generate: () => faker.datatype.boolean({ probability: 0.2 }) },
  ],
  date: [
    { id: "recent", label: "Recent date", generate: () => faker.date.recent({ days: 30 }).toISOString().split("T")[0] },
    { id: "past", label: "Past date", generate: () => faker.date.past({ years: 10 }).toISOString().split("T")[0] },
    { id: "future", label: "Future date", generate: () => faker.date.future({ years: 5 }).toISOString().split("T")[0] },
    { id: "birthdate", label: "Birthdate", generate: () => faker.date.birthdate({ min: 18, max: 80, mode: "age" }).toISOString().split("T")[0] },
  ],
  time: [
    { id: "time", label: "Random time", generate: () => faker.date.recent().toTimeString().split(" ")[0] },
    { id: "businessHours", label: "Business hours", generate: () => {
      const hour = faker.number.int({ min: 9, max: 17 });
      const minute = faker.number.int({ min: 0, max: 59 });
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;
    }},
  ],
  datetime: [
    { id: "recent", label: "Recent timestamp", generate: () => faker.date.recent({ days: 7 }).toISOString() },
    { id: "past", label: "Past timestamp", generate: () => faker.date.past({ years: 5 }).toISOString() },
    { id: "future", label: "Future timestamp", generate: () => faker.date.future({ years: 2 }).toISOString() },
  ],
  timestamp: [
    { id: "recent", label: "Recent timestamp", generate: () => faker.date.recent({ days: 7 }).toISOString() },
    { id: "past", label: "Past timestamp", generate: () => faker.date.past({ years: 5 }).toISOString() },
    { id: "future", label: "Future timestamp", generate: () => faker.date.future({ years: 2 }).toISOString() },
  ],
  "timestamp without time zone": [
    { id: "recent", label: "Recent timestamp", generate: () => faker.date.recent({ days: 7 }).toISOString() },
    { id: "past", label: "Past timestamp", generate: () => faker.date.past({ years: 5 }).toISOString() },
    { id: "future", label: "Future timestamp", generate: () => faker.date.future({ years: 2 }).toISOString() },
  ],
  "timestamp with time zone": [
    { id: "recent", label: "Recent timestamp", generate: () => faker.date.recent({ days: 7 }).toISOString() },
    { id: "past", label: "Past timestamp", generate: () => faker.date.past({ years: 5 }).toISOString() },
    { id: "future", label: "Future timestamp", generate: () => faker.date.future({ years: 2 }).toISOString() },
  ],
  json: [
    { id: "object", label: "Simple object", generate: () => JSON.stringify({ id: faker.string.uuid(), value: faker.word.sample() }) },
    { id: "array", label: "Array of strings", generate: () => JSON.stringify(faker.helpers.multiple(() => faker.word.sample(), { count: 3 })) },
    { id: "nested", label: "Nested object", generate: () => JSON.stringify({
      user: { name: faker.person.fullName(), email: faker.internet.email() },
      metadata: { created: faker.date.recent().toISOString() }
    })},
  ],
  jsonb: [
    { id: "object", label: "Simple object", generate: () => JSON.stringify({ id: faker.string.uuid(), value: faker.word.sample() }) },
    { id: "array", label: "Array of strings", generate: () => JSON.stringify(faker.helpers.multiple(() => faker.word.sample(), { count: 3 })) },
    { id: "nested", label: "Nested object", generate: () => JSON.stringify({
      user: { name: faker.person.fullName(), email: faker.internet.email() },
      metadata: { created: faker.date.recent().toISOString() }
    })},
  ],
  uuid: [
    { id: "uuid", label: "UUID v4", generate: () => faker.string.uuid() },
  ],
  blob: [
    { id: "blob", label: "Random bytes", generate: () => `\\x${faker.string.hexadecimal({ length: 32, prefix: "" })}` },
  ],
  enum: [
    { id: "enum", label: "Random enum value", generate: () => faker.helpers.arrayElement(["option1", "option2", "option3"]) },
  ],
};

/**
 * Get default faker option for a field type.
 */
export function getDefaultFakerOption(fieldType: string): string {
  const options = FAKER_OPTIONS_BY_TYPE[fieldType.toLowerCase()];
  if (!options || options.length === 0) {
    return "default";
  }
  return options[0].id;
}

/**
 * Generate a value using a specific faker option.
 */
export function generateWithFakerOption(
  fieldType: string,
  fakerId: string,
): unknown {
  const options = FAKER_OPTIONS_BY_TYPE[fieldType.toLowerCase()];
  if (!options) {
    throw new Error(`Unknown field type: ${fieldType}`);
  }
  const option = options.find((o) => o.id === fakerId);
  if (!option) {
    throw new Error(`Unknown faker option: ${fakerId} for type ${fieldType}`);
  }
  return option.generate();
}
