import type { RootState } from "@/app/store";

export const selectAuthState = (state: RootState) => state.auth;

export const selectProfile = (state: RootState) => state.auth.profile;
