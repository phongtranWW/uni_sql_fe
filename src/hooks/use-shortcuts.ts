import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  HK_DELETE_SELECTION,
  HK_REDO,
  HK_SAVE,
  HK_TOGGLE_ISSUES,
  HK_TOGGLE_SIDEBAR,
  HK_UNDO,
} from "@/constants/editor-shortcuts";
import {
  issuePanelSet,
  sidebarSet,
} from "@/features/editor-settings/editor-settings.slice";
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
  const showIssues = useAppSelector(
    (state) => state.editorSettings.show.issuePanel,
  );
  const showSidebar = useAppSelector(
    (state) => state.editorSettings.show.sidebar,
  );

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
    HK_UNDO,
    (e) => {
      if (isEditableTarget(e)) return;
      dispatch(ActionCreators.undo());
    },
    { preventDefault: true },
  );

  useHotkeys(
    HK_REDO,
    (e) => {
      if (isEditableTarget(e)) return;
      dispatch(ActionCreators.redo());
    },
    { preventDefault: true },
  );

  useHotkeys(
    [...HK_DELETE_SELECTION],
    (e) => {
      if (isEditableTarget(e)) return;
      e.preventDefault();
      dispatch(elementsSelectionDeleted());
    },
    { preventDefault: false },
  );

  useHotkeys(
    HK_SAVE,
    async (e) => {
      if (isEditableTarget(e)) return;
      if (!id || !project) return;
      try {
        await dispatch(upsertProject({ id, body: project })).unwrap();
        dispatch(ActionCreators.clearHistory());
      } catch {
        /* save failed — keep undo history */
      }
    },
    { preventDefault: true },
  );

  useHotkeys(
    HK_TOGGLE_ISSUES,
    (e) => {
      if (isEditableTarget(e)) return;
      dispatch(issuePanelSet(!showIssues));
    },
    { preventDefault: true },
    [showIssues, dispatch],
  );

  useHotkeys(
    HK_TOGGLE_SIDEBAR,
    (e) => {
      if (isEditableTarget(e)) return;
      dispatch(sidebarSet(!showSidebar));
    },
    { preventDefault: true },
    [showSidebar, dispatch],
  );
};

export default useShortcuts;
