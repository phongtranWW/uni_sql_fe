import type { EditorSettings } from "./editor-settings.schema";

export const initialEditorSettingsSliceState: EditorSettings = {
  show: {
    issuePanel: false,
    sidebar: true,
    minimap: false,
    control: false,
  },
};
