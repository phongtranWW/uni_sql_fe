import { useCallback, useEffect, useMemo, useRef } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { keymap } from "@codemirror/view";
import { Compartment, Prec } from "@codemirror/state";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { usePlayground } from "./playground-context";

/**
 * SQL editor backed by CodeMirror, the same component the rest of the app
 * uses (see CodePreview). Differences:
 * - editable
 * - hooks Ctrl/Cmd+Enter and Ctrl/Cmd+Shift+Enter into the toolbar actions
 * - reports the selected text up to the page so "Run selection" can use it
 *
 * The keymap is wrapped in a {@link Compartment} so we can swap in fresh
 * `runAll` / `runSelection` closures via `view.dispatch(reconfigure())`
 * whenever the parent re-renders, without re-creating the entire editor.
 */
const PlaygroundEditor = () => {
  const { resolvedTheme } = useTheme();
  const { buffer, setBuffer, setSelection, runAll, runSelection } =
    usePlayground();

  const editorRef = useRef<ReactCodeMirrorRef | null>(null);
  // One Compartment per editor instance; persists across renders.
  const keymapCompartment = useMemo(() => new Compartment(), []);

  const buildKeymap = useCallback(
    (onRunAll: () => void, onRunSelection: () => void) =>
      Prec.high(
        keymap.of([
          {
            key: "Mod-Enter",
            preventDefault: true,
            run: () => {
              onRunAll();
              return true;
            },
          },
          {
            key: "Mod-Shift-Enter",
            preventDefault: true,
            run: () => {
              onRunSelection();
              return true;
            },
          },
        ]),
      ),
    [],
  );

  const extensions = useMemo(
    () => [
      sql({ dialect: PostgreSQL, upperCaseKeywords: true }),
      // Initial keymap; reconfigured by the effect below as runAll/runSelection
      // identities change.
      keymapCompartment.of(buildKeymap(runAll, runSelection)),
    ],
    // Intentionally empty: we never want to re-create the extensions array
    // (that would re-mount the editor). The keymap is updated via the
    // Compartment in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // Swap in fresh callbacks whenever they change. View access in an effect
  // is safe (the editor is mounted by then).
  useEffect(() => {
    const view = editorRef.current?.view;
    if (!view) return;
    view.dispatch({
      effects: keymapCompartment.reconfigure(buildKeymap(runAll, runSelection)),
    });
  }, [runAll, runSelection, buildKeymap, keymapCompartment]);

  const handleUpdate = useCallback(
    (vu: {
      state: {
        selection: { main: { from: number; to: number } };
        doc: { sliceString: (from: number, to: number) => string };
      };
    }) => {
      const { from, to } = vu.state.selection.main;
      if (from === to) {
        setSelection("");
        return;
      }
      setSelection(vu.state.doc.sliceString(from, to));
    },
    [setSelection],
  );

  return (
    <div className="h-full overflow-hidden border-b border-border">
      <CodeMirror
        ref={editorRef}
        value={buffer}
        onChange={setBuffer}
        height="100%"
        extensions={extensions}
        theme={resolvedTheme === "dark" ? githubDark : githubLight}
        key={resolvedTheme}
        onUpdate={handleUpdate}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
        }}
        className="h-full text-sm"
      />
    </div>
  );
};

export default PlaygroundEditor;
