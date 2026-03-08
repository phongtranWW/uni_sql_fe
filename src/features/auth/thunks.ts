import { tokenStorage } from "@/utils/token-storage";
import { authService } from "./service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Profile } from "./schemas/profile";
import axios from "axios";

export const handleAuthCallback = createAsyncThunk<
  Profile,
  string,
  { rejectValue: string }
>("auth/handleCallback", async (token, { rejectWithValue }) => {
  try {
    tokenStorage.set(token);
    return await authService.getProfile();
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
  Profile | null,
  void,
  { rejectValue: string }
>("auth/restoreSession", async (_, { rejectWithValue }) => {
  try {
    const token = tokenStorage.get();
    if (!token) return null;
    return await authService.getProfile();
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

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      tokenStorage.clear();
    } catch {
      return rejectWithValue("Logout failed");
    }
  },
);

export const loginWithGoogle = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/loginWithGoogle", async (_, { rejectWithValue }) => {
  try {
    authService.redirectToGoogle();
  } catch {
    return rejectWithValue("Login with Google failed");
  }
});
