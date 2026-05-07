/**
 * Hotkey strings registered in `use-shortcuts.ts` and documented under Help → Shortcuts.
 */
export const HK_UNDO = "ctrl+z";
export const HK_REDO = "ctrl+y";
export const HK_DELETE_SELECTION = ["backspace", "delete"] as const;
export const HK_SAVE = "ctrl+s";
export const HK_TOGGLE_ISSUES = "ctrl+alt+i";
export const HK_TOGGLE_SIDEBAR = "ctrl+alt+b";

/** One chord = keys pressed together; multiple chords = alternatives (e.g. Backspace or Delete). */
export type EditorShortcutHelpRow = {
  id: string;
  description: string;
  chords: readonly (readonly string[])[];
};

export const EDITOR_SHORTCUT_HELP: EditorShortcutHelpRow[] = [
  {
    id: "undo",
    description: "Undo last edit.",
    chords: [["Ctrl", "Z"]],
  },
  {
    id: "redo",
    description: "Redo.",
    chords: [["Ctrl", "Y"]],
  },
  {
    id: "delete",
    description: "Delete canvas selection.",
    chords: [["Backspace"], ["Delete"]],
  },
  {
    id: "save",
    description: "Save project (undo resets).",
    chords: [["Ctrl", "S"]],
  },
  {
    id: "toggle-issues",
    description: "Toggle Issues panel.",
    chords: [["Ctrl", "Alt", "I"]],
  },
  {
    id: "toggle-sidebar",
    description: "Toggle Sidebar.",
    chords: [["Ctrl", "Alt", "B"]],
  },
];
