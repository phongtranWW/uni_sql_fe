import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialEditorSettingsSliceState } from "./editor-settings.state";

const editorSettingsSlice = createSlice({
  name: "editorSettings",
  initialState: initialEditorSettingsSliceState,
  reducers: {
    issuePanelSet: (state, action: PayloadAction<boolean>) => {
      state.show.issuePanel = action.payload;
    },
    sidebarSet: (state, action: PayloadAction<boolean>) => {
      state.show.sidebar = action.payload;
    },
    minimapSet: (state, action: PayloadAction<boolean>) => {
      state.show.minimap = action.payload;
    },
    controlSet: (state, action: PayloadAction<boolean>) => {
      state.show.control = action.payload;
    },
  },
});

export const { issuePanelSet, sidebarSet, minimapSet, controlSet } =
  editorSettingsSlice.actions;
export default editorSettingsSlice.reducer;
