import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import databaseReducer from "@/features/database/slice";
import undoable, { excludeAction } from "redux-undo";
import authReducer from "@/features/auth/slice";

export const store = configureStore({
  reducer: {
    database: undoable(databaseReducer, {
      limit: 50,
      filter: excludeAction([
        "database/setSelectedTables",
        "database/setSelectedRefs",
        "database/load/fulfilled",
        "database/load/rejected",
      ]),
    }),
    auth: authReducer,
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
