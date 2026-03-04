import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import databaseReducer, {
  setSelectedRefs,
  setSelectedTables,
} from "@/features/database/slice";
import undoable, { excludeAction } from "redux-undo";
import authReducer from "@/features/auth/slice";

export const store = configureStore({
  reducer: {
    database: undoable(databaseReducer, {
      limit: 50,
      filter: excludeAction([setSelectedTables.type, setSelectedRefs.type]),
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
