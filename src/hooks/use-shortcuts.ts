import { useAppDispatch } from "@/app/hook";
import { ActionCreators } from "redux-undo";
import { useHotkeys } from "react-hotkeys-hook";
import { removeSelectedElements } from "@/features/database/slice";

const useShortcuts = () => {
  const dispatch = useAppDispatch();

  useHotkeys("ctrl+z", () => dispatch(ActionCreators.undo()), {
    preventDefault: true,
  });
  useHotkeys("ctrl+y", () => dispatch(ActionCreators.redo()), {
    preventDefault: true,
  });
  useHotkeys(
    ["backspace", "delete"],
    () => dispatch(removeSelectedElements()),
    {
      preventDefault: true,
    },
  );
};

export default useShortcuts;
