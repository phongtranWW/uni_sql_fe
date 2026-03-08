import { combineReducers } from "@reduxjs/toolkit";
import undoable, { excludeAction } from "redux-undo";
import databaseReducer from "./database";
import metaReducer from "./meta";

const projectReducer = combineReducers({
  database: undoable(databaseReducer, {
    limit: 50,
    filter: excludeAction([
      "database/setSelectedTables",
      "database/setSelectedRefs",
    ]),
  }),
  meta: metaReducer,
});

export default projectReducer;
