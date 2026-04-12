import { tokenStorage } from "@/utils/token-storage";
import { authService } from "./service";
import { createAppThunk } from "@/app/thunks";
import type { Profile } from "./schemas/profile.schema";

export const handleAuthCallback = createAppThunk<Profile, string>(
  "auth/handleCallback",
  async (token) => {
    try {
      tokenStorage.set(token);
      return await authService.getProfile();
    } catch (error) {
      tokenStorage.clear();
      throw error;
    }
  },
);

export const restoreSession = createAppThunk<Profile | null, void>(
  "auth/restoreSession",
  async () => {
    const token = tokenStorage.get();
    if (!token) return null;
    try {
      return await authService.getProfile();
    } catch {
      tokenStorage.clear();
      throw new Error("Session expired. Please log in again.");
    }
  },
);

export const logout = createAppThunk<void, void>("auth/logout", async () => {
  try {
    tokenStorage.clear();
  } catch {
    throw new Error("Logout failed");
  }
});

export const loginWithGoogle = createAppThunk<void, void>(
  "auth/loginWithGoogle",
  async () => {
    try {
      authService.redirectToGoogle();
    } catch {
      throw new Error("Login with Google failed");
    }
  },
);
