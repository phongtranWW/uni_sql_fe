import { selectDatabase } from "@/features/project/selectors";
import { updateSaveStatus } from "@/features/project/slices/meta";
import { createListenerMiddleware, isAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  predicate: (action) =>
    isAction(action) &&
    action.type.startsWith("database/") &&
    !["database/setSelectedTables", "database/setSelectedRefs"].includes(
      action.type,
    ),
  effect: (_, { dispatch, getState }) => {
    const current = selectDatabase(getState() as RootState);
    dispatch(updateSaveStatus(current));
  },
});

export default listenerMiddleware;
