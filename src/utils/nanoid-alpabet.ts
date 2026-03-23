import { customAlphabet } from "nanoid";

export const nanoidAlpabet = (size = 4) =>
  customAlphabet("abcdefghijklmnopqrstuvwxyz")(size);
