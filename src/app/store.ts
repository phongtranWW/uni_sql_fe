import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slice";
import projectReducer from "@/features/project/slices/project.slice";
import projectsReucer from "@/features/project/slices/projects.slice";
import editorSettingsReducer from "@/features/editor-settings/editor-settings.slice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    projects: projectsReucer,
    auth: authReducer,
    editorSettings: editorSettingsReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
