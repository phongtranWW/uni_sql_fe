import { useAppDispatch, useAppSelector } from "@/app/hook";
import { ActionCreators } from "redux-undo";
import { useHotkeys } from "react-hotkeys-hook";
import { removeSelectedElements } from "@/features/project/slices/database";
import { upsertProject } from "@/features/project/thunks";
import { selectDatabase, selectMeta } from "@/features/project/selectors";
import { useParams } from "react-router";

const useShortcuts = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const database = useAppSelector(selectDatabase);
  const { saveStatus } = useAppSelector(selectMeta);

  useHotkeys("ctrl+z", () => dispatch(ActionCreators.undo()), {
    preventDefault: true,
  });
  useHotkeys("ctrl+y", () => dispatch(ActionCreators.redo()), {
    preventDefault: true,
  });
  useHotkeys(
    "ctrl+s",
    () => {
      if (id && saveStatus === "unsaved")
        dispatch(upsertProject({ id, database }));
    },
    { preventDefault: true },
  );
  useHotkeys(
    ["backspace", "delete"],
    () => dispatch(removeSelectedElements()),
    {
      preventDefault: true,
    },
  );
};

export default useShortcuts;
