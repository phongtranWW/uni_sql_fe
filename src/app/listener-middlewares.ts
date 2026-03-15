import {
  createListenerMiddleware,
  isAction,
  isRejectedWithValue,
  type UnknownAction,
} from "@reduxjs/toolkit";
import { toast } from "sonner";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  predicate: (action): action is UnknownAction & { payload: string } =>
    isRejectedWithValue(action) &&
    isAction(action) &&
    action.type.startsWith("project/"),
  effect: (action) => {
    toast.error(action.payload);
  },
});

export default listenerMiddleware;
