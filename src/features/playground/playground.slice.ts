import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  initialPlaygroundSliceState,
  type PlaygroundHistoryEntry,
  type PlaygroundSeed,
} from "./playground.state";

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
    },
    playgroundSeedCleared: (state) => {
      state.seed = null;
    },
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
  playgroundHistoryAppended,
  playgroundHistoryCleared,
} = playgroundSlice.actions;

export default playgroundSlice.reducer;
