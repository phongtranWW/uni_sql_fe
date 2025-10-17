import { viewSlice } from "@/features/view/viewSlice";
import { diagramSlice } from "@/features/diagram/diagramSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  view: viewSlice.reducer,
  diagram: diagramSlice.reducer,
});

export default rootReducer;
