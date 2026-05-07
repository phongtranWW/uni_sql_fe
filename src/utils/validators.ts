import { FIELD_DEFAULT_PATTERNS } from "@/constants/field-types";

export function validateFieldDefault(
  type: string,
  value: string,
): { valid: boolean; message?: string } {
  const config = FIELD_DEFAULT_PATTERNS[type];
  if (!config) return { valid: true };
  const upper = value.toUpperCase();
  const matchPattern =
    config.patterns?.some((regex) => regex.test(value)) ?? false;
  const matchFunction = config.functions?.some((fn) => fn === upper) ?? false;
  if (matchPattern || matchFunction) {
    return { valid: true };
  }
  return {
    valid: false,
    message: config.message,
  };
}
