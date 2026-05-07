import apiClient from "@/lib/api-client";
import { ProfileSchema, type Profile } from "./schemas/profile.schema";
import { handleServiceError } from "@/lib/handle-service-error";

export const authService = {
  redirectToGoogle(): void {
    const backendUrl = import.meta.env.VITE_URL_BACKEND;
    window.location.href = `${backendUrl}/auth/google`;
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
