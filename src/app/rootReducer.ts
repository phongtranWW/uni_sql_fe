import { viewSlice } from "@/features/view/viewSlice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  view: viewSlice.reducer,
});

export default rootReducer;
