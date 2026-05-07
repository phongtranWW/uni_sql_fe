import apiClient from "@/lib/api-client";
import { ProfileSchema, type Profile } from "./schemas/profile.schema";
import { handleServiceError } from "@/lib/handle-service-error";

export const authService = {
  redirectToGoogle(): void {
    const backendUrl = import.meta.env.VITE_URL_BACKEND;
    window.location.href = `${backendUrl}/auth/google`;
  },

  openGooglePopup(): Window | null {
    const backendUrl = import.meta.env.VITE_URL_BACKEND;
    const url = `${backendUrl}/auth/google`;
    const w = 500;
    const h = 600;
    const left = window.screenX + (window.innerWidth - w) / 2;
    const top = window.screenY + (window.innerHeight - h) / 2;
    return window.open(
      url,
      "google-login",
      `width=${w},height=${h},left=${left},top=${top},toolbar=no,menubar=no`,
    );
  },
  async getProfile(): Promise<Profile> {
    try {
      const { data } = await apiClient.get("/users/profile");
      return ProfileSchema.parse(data);
    } catch (error) {
      handleServiceError(error, "Failed to load profile");
    }
  },
};
