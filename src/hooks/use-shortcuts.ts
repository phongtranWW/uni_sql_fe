import { useAppDispatch } from "@/app/hook";
import { ActionCreators } from "redux-undo";
import { elementsSelectionDeleted } from "@/features/project/slices/project.slice";
import { useHotkeys } from "react-hotkeys-hook";

const useShortcuts = () => {
  const dispatch = useAppDispatch();

  const isEditableTarget = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement)?.tagName;
    return (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT" ||
      (e.target as HTMLElement)?.isContentEditable
    );
  };

  useHotkeys(
    "ctrl+z",
    (e) => {
      if (isEditableTarget(e)) return;
      dispatch(ActionCreators.undo());
    },
    { preventDefault: true },
  );

  useHotkeys(
    "ctrl+y",
    (e) => {
      if (isEditableTarget(e)) return;
      dispatch(ActionCreators.redo());
    },
    { preventDefault: true },
  );

  useHotkeys(
    ["backspace", "delete"],
    (e) => {
      if (isEditableTarget(e)) return;
      e.preventDefault();
      dispatch(elementsSelectionDeleted());
    },
    { preventDefault: false },
  );
};

export default useShortcuts;
