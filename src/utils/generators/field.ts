import { nanoid } from "@reduxjs/toolkit";

export const generateFieldName = (): string => {
  return `field_${nanoid(3)}`;
};
