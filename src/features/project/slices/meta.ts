import { createSlice } from "@reduxjs/toolkit";
import { initialMeta } from "../state";
import { getDatabase } from "../thunks";

const metaSlice = createSlice({
  name: "meta",
  initialState: initialMeta,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDatabase.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getDatabase.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(getDatabase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || null;
      });
  },
});

export default metaSlice.reducer;
