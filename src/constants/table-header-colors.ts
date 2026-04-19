export const TABLE_HEADER_COLORS = [
  "#64748B",
  "#3B82F6",
  "#0EA5E9",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#84CC16",
  "#F59E0B",
  "#EAB308",
  "#F97316",
  "#EF4444",
  "#F43F5E",
  "#EC4899",
  "#8B5CF6",
  "#D946EF",
] as const;

export type TableHeaderColor = (typeof TABLE_HEADER_COLORS)[number];
