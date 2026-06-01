import type { RootState } from "@/app/store";

export const selectPlaygroundSeed = (state: RootState) => state.playground.seed;

export const selectPlaygroundHistory = (state: RootState) =>
  state.playground.history;

export const selectPlaygroundEngineStatus = (state: RootState) =>
  state.playground.engineStatus;

export const selectPlaygroundEngineError = (state: RootState) =>
  state.playground.engineError;

export const selectPlaygroundBuffer = (state: RootState) =>
  state.playground.buffer;

export const selectPlaygroundSelection = (state: RootState) =>
  state.playground.selection;

export const selectPlaygroundRunState = (state: RootState) =>
  state.playground.runState;
