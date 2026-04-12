import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Profile } from "./schemas/profile.schema";
import { initialAuthSliceState } from "./state";
import {
  handleAuthCallback,
  loginWithGoogle,
  logout,
  restoreSession,
} from "./thunks";

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthSliceState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(handleAuthCallback.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        handleAuthCallback.fulfilled,
        (state, action: PayloadAction<Profile>) => {
          state.status = "succeeded";
          state.profile = action.payload;
          state.error = null;
        },
      )
      .addCase(handleAuthCallback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || null;
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(restoreSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || null;
        state.profile = null;
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.profile = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || null;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithGoogle.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
