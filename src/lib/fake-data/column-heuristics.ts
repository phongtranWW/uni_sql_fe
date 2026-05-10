import type { Faker } from "@faker-js/faker";

/**
 * For string columns (VARCHAR / CHAR / TEXT) we try to give the user better
 * defaults than `lorem.words(2)` by inspecting the column name.
 *
 * The check is intentionally simple — a substring match against a small
 * dictionary. Order matters: `firstname` is checked before `name` so it
 * doesn't get caught by the broader rule.
 *
 * Each generator receives the live faker instance so it can choose locale-
 * sensitive output.
 */
export interface ColumnHint {
  /** Substrings to look for in the lower-cased column name. */
  patterns: RegExp;
  generate: (f: Faker) => string;
}

export const COLUMN_HINTS: ColumnHint[] = [
  { patterns: /^email|_email$|email_/, generate: (f) => f.internet.email() },
  { patterns: /first_?name|firstname/, generate: (f) => f.person.firstName() },
  { patterns: /last_?name|lastname|surname/, generate: (f) => f.person.lastName() },
  { patterns: /user_?name|username/, generate: (f) => f.internet.username() },
  { patterns: /full_?name|^name$|_name$/, generate: (f) => f.person.fullName() },
  { patterns: /phone|mobile|tel(?:ephone)?/, generate: (f) => f.phone.number() },
  { patterns: /password|pwd|hash|secret|token/, generate: (f) => f.internet.password({ length: 32 }) },
  { patterns: /url|website|link|homepage/, generate: (f) => f.internet.url() },
  { patterns: /image|avatar|photo|picture/, generate: (f) => f.image.avatar() },
  { patterns: /address|street/, generate: (f) => f.location.streetAddress() },
  { patterns: /city|town/, generate: (f) => f.location.city() },
  { patterns: /country/, generate: (f) => f.location.country() },
  { patterns: /state|province|region/, generate: (f) => f.location.state() },
  { patterns: /zip|postcode|postal/, generate: (f) => f.location.zipCode() },
  { patterns: /company|organization/, generate: (f) => f.company.name() },
  { patterns: /job|position|role/, generate: (f) => f.person.jobTitle() },
  { patterns: /title|subject|headline/, generate: (f) => f.lorem.sentence({ min: 3, max: 6 }) },
  { patterns: /description|bio|summary|intro/, generate: (f) => f.lorem.sentence() },
  { patterns: /content|body|text|message|note/, generate: (f) => f.lorem.paragraph() },
  { patterns: /comment/, generate: (f) => f.lorem.sentences({ min: 1, max: 3 }) },
  { patterns: /slug/, generate: (f) => f.helpers.slugify(f.lorem.words({ min: 2, max: 4 })).toLowerCase() },
  { patterns: /color|colour/, generate: (f) => f.color.human() },
  { patterns: /currency/, generate: (f) => f.finance.currencyCode() },
  { patterns: /price|amount|cost/, generate: (f) => f.finance.amount() },
];

/**
 * Pick the first hint whose pattern matches the column name. Returns
 * undefined when no rule fits — callers should fall back to a generic
 * lorem-words generator.
 */
export function pickColumnHint(columnName: string): ColumnHint | undefined {
  const name = columnName.toLowerCase();
  return COLUMN_HINTS.find((h) => h.patterns.test(name));
}
