import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  initialPlaygroundSliceState,
  type PlaygroundHistoryEntry,
  type PlaygroundSeed,
  type EngineStatus,
  type RunState,
} from "./playground.state";
import type { QueryResult, QueryError } from "@/lib/sql-engine";

const HISTORY_LIMIT = 50;

const playgroundSlice = createSlice({
  name: "playground",
  initialState: initialPlaygroundSliceState,
  reducers: {
    /**
     * Set the seed before navigating to /playground.
     * The playground page reads this on mount and forwards it to the engine.
     */
    playgroundSeedSet: (state, action: PayloadAction<PlaygroundSeed>) => {
      state.seed = action.payload;
      state.engineStatus = "idle";
      state.engineError = null;
    },
    playgroundSeedCleared: (state) => {
      state.seed = null;
      state.engineStatus = "idle";
      state.engineError = null;
    },

    // Engine status
    playgroundEngineStatusSet: (state, action: PayloadAction<EngineStatus>) => {
      state.engineStatus = action.payload;
    },
    playgroundEngineErrorSet: (state, action: PayloadAction<string>) => {
      state.engineStatus = "error";
      state.engineError = action.payload;
    },

    // Buffer
    playgroundBufferSet: (state, action: PayloadAction<string>) => {
      state.buffer = action.payload;
    },
    playgroundSelectionSet: (state, action: PayloadAction<string>) => {
      state.selection = action.payload;
    },

    // Run state
    playgroundRunStarted: (state) => {
      state.runState = {
        status: "running",
        results: [],
        error: null,
        finishedAt: null,
      };
    },
    playgroundRunSucceeded: (state, action: PayloadAction<QueryResult[]>) => {
      state.runState = {
        status: "ok",
        results: action.payload,
        error: null,
        finishedAt: new Date().toISOString(),
      };
    },
    playgroundRunFailed: (state, action: PayloadAction<QueryError>) => {
      state.runState = {
        status: "error",
        results: [],
        error: action.payload,
        finishedAt: new Date().toISOString(),
      };
    },
    playgroundRunReset: (state) => {
      state.runState = {
        status: "idle",
        results: [],
        error: null,
        finishedAt: null,
      };
    },

    // History
    playgroundHistoryAppended: (
      state,
      action: PayloadAction<PlaygroundHistoryEntry>,
    ) => {
      // Most-recent first. Trim to keep memory bounded.
      state.history.unshift(action.payload);
      if (state.history.length > HISTORY_LIMIT) {
        state.history.length = HISTORY_LIMIT;
      }
    },
    playgroundHistoryCleared: (state) => {
      state.history = [];
    },
  },
});

export const {
  playgroundSeedSet,
  playgroundSeedCleared,
  playgroundEngineStatusSet,
  playgroundEngineErrorSet,
  playgroundBufferSet,
  playgroundSelectionSet,
  playgroundRunStarted,
  playgroundRunSucceeded,
  playgroundRunFailed,
  playgroundRunReset,
  playgroundHistoryAppended,
  playgroundHistoryCleared,
} = playgroundSlice.actions;

export default playgroundSlice.reducer;
