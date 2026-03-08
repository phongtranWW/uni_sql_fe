import apiClient from "@/lib/api-client";
import type { Profile } from "./schemas/profile";

export const authService = {
  redirectToGoogle(): void {
    const backendUrl = import.meta.env.VITE_URL_BACKEND;
    window.location.href = `${backendUrl}/auth/google`;
  },
  async getProfile(): Promise<Profile> {
    const { data } = await apiClient.get<Profile>("/users/profile");
    return data;
  },
};
