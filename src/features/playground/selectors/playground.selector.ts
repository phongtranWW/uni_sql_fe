import type { RootState } from "@/app/store";

export const selectPlaygroundSeed = (state: RootState) => state.playground.seed;

export const selectPlaygroundHistory = (state: RootState) =>
  state.playground.history;
