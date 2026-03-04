import { tokenStorage } from "@/utils/token-storage";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { Auth } from "./schemas/auth";
import { authService } from "./service";
import type { Profile } from "./schemas/profile";
import axios from "axios";

export const handleAuthCallback = createAsyncThunk<
  { profile: Profile; token: string },
  string,
  { rejectValue: string }
>("auth/handleCallback", async (token, { rejectWithValue }) => {
  try {
    tokenStorage.set(token);
    const profile = await authService.getProfile();
    return {
      profile,
      token,
    };
  } catch (error) {
    tokenStorage.clear();
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message || "Authentication failed",
      );
    }
    return rejectWithValue("Authentication failed");
  }
});

export const restoreSession = createAsyncThunk<
  { profile: Profile; token: string },
  void,
  { rejectValue: string }
>("auth/restoreSession", async (_, { rejectWithValue }) => {
  try {
    const token = tokenStorage.get();

    if (!token) {
      return rejectWithValue("Access token not found");
    }
    const profile = await authService.getProfile();
    return {
      profile,
      token,
    };
  } catch (error: unknown) {
    tokenStorage.clear();
    if (axios.isAxiosError(error)) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Session expired. Please log in again.",
      );
    }
    return rejectWithValue("Session expired. Please log in again.");
  }
});

export const logout = createAsyncThunk<void, void>("auth/logout", async () => {
  tokenStorage.clear();
});

const initialState: Auth = {
  profile: null,
  token: tokenStorage.get(),
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sessionExpired(state) {
      state.profile = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = "Session expired. Please log in again.";
      tokenStorage.clear();
    },
    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(handleAuthCallback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        handleAuthCallback.fulfilled,
        (state, action: PayloadAction<{ profile: Profile; token: string }>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.profile = action.payload.profile;
          state.token = action.payload.token;
          state.error = null;
        },
      )
      .addCase(handleAuthCallback.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "Authentication failed";
      });
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        restoreSession.fulfilled,
        (state, action: PayloadAction<{ profile: Profile; token: string }>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.profile = action.payload.profile;
          state.token = action.payload.token;
          state.error = null;
        },
      )
      .addCase(restoreSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.profile = null;
        state.error = action.payload || null;
      });
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.profile = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.token = null;
        state.isAuthenticated = false;
        state.isAuthenticated = false;
      });
  },
});

export const { sessionExpired, clearError } = authSlice.actions;
export default authSlice.reducer;
