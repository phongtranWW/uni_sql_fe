import { TABLE_HEADER_COLORS } from "@/constants/table-header-colors";
import type { TableHeaderColor } from "@/features/database/schemas/table";
import { nanoid } from "@reduxjs/toolkit";

export const generateTableHeaderColor = (): TableHeaderColor => {
  const colors = Object.values(TABLE_HEADER_COLORS);
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

export const generateTableName = (): string => {
  return `table_${nanoid(6)}`;
};
