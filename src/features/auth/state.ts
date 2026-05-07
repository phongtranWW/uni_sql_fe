import type { Profile } from "./schemas/profile.schema";

export interface AuthSliceState {
  profile: Profile | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export const initialAuthSliceState: AuthSliceState = {
  profile: null,
  status: "loading", // Vẫn để loading vì khi mount app thường sẽ restore session ngay lập tức, nhưng đã bổ sung "idle" vào type.
  error: null,
};
