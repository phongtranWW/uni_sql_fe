import { useCallback, useEffect, useMemo, useRef } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { keymap } from "@codemirror/view";
import { Compartment, Prec } from "@codemirror/state";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { selectPlaygroundBuffer } from "@/features/playground/selectors/playground.selector";
import {
  playgroundBufferSet,
  playgroundSelectionSet,
} from "@/features/playground/playground.slice";
import type { UseSqlEngineResult } from "@/hooks/use-sql-engine";
import { usePlaygroundActions } from "./use-playground-actions";

interface PlaygroundEditorProps {
  engine: UseSqlEngineResult;
}

const PlaygroundEditor = ({ engine }: PlaygroundEditorProps) => {
  const { resolvedTheme } = useTheme();
  const dispatch = useAppDispatch();
  const buffer = useAppSelector(selectPlaygroundBuffer);

  const { runAll, runSelection } = usePlaygroundActions(engine);

  const editorRef = useRef<ReactCodeMirrorRef | null>(null);
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
      keymapCompartment.of(buildKeymap(runAll, runSelection)),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
        dispatch(playgroundSelectionSet(""));
        return;
      }
      dispatch(playgroundSelectionSet(vu.state.doc.sliceString(from, to)));
    },
    [dispatch],
  );

  return (
    <div className="h-full overflow-hidden border-b border-border">
      <CodeMirror
        ref={editorRef}
        value={buffer}
        onChange={(value) => dispatch(playgroundBufferSet(value))}
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
