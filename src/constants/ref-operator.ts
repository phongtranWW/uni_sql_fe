export const REF_OPERATOR = ["-", ">", "<"] as const;

export type RefOperator = (typeof REF_OPERATOR)[number];

export const REF_OPERATOR_LABELS = {
  "-": "1 : 1",
  ">": "N : 1",
  "<": "1 : N",
} as const;
