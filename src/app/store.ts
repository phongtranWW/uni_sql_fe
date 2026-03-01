import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import databaseReducer, { setSelectedTables } from "@/features/database/slice";
import undoable, { excludeAction } from "redux-undo";

export const store = configureStore({
  reducer: {
    database: undoable(databaseReducer, {
      limit: 50,
      undoType: "DATABASE_UNDO",
      redoType: "DATABASE_REDO",
      filter: excludeAction([setSelectedTables.type]),
    }),
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
