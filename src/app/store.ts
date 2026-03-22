import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slice";
import listenerMiddleware from "./listener-middlewares";
import projectReducer from "@/features/project/slices/project.slice";
import projectsReucer from "@/features/project/slices/projects.slice";

export const store = configureStore({
  reducer: {
    project: projectReducer,
    projects: projectsReucer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
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
