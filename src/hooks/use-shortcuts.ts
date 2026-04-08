import { useAppDispatch, useAppSelector } from "@/app/hook";
import { ActionCreators } from "redux-undo";
import { elementsSelectionDeleted } from "@/features/project/slices/project.slice";
import { upsertProject } from "@/features/project/thunks";
import { selectProject } from "@/features/project/selectors/project.selector";
import { useHotkeys } from "react-hotkeys-hook";
import { useParams } from "react-router";

const useShortcuts = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const project = useAppSelector(selectProject);

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

  useHotkeys(
    "ctrl+s",
    (e) => {
      if (isEditableTarget(e)) return;
      if (!id || !project) return;
      dispatch(upsertProject({ id, body: project }));
    },
    { preventDefault: true },
  );
};

export default useShortcuts;
