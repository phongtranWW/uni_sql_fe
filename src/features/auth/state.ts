import type { Profile } from "./schemas/profile";

export interface AuthState {
  profile: Profile | null;
  status: "loading" | "succeeded" | "failed";
  error: string | null;
}

export const initialAuth: AuthState = {
  profile: null,
  status: "loading",
  error: null,
};
