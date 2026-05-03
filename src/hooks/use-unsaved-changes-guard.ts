import { useEffect } from "react";
import { useBeforeUnload, useBlocker } from "react-router";
import { useAppSelector } from "@/app/hook";
import { selectProjectIsDirty } from "@/features/project/selectors/project.selector";

const useUnsavedChangesGuard = () => {
  const isDirty = useAppSelector(selectProjectIsDirty);
  useBeforeUnload((event) => {
    if (!isDirty) return;
    event.preventDefault();
  });

  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (blocker.state !== "blocked") return;

    const shouldLeave = window.confirm("You have unsaved changes. Are you sure you want to leave this page?");
    if (shouldLeave) {
      blocker.proceed();
      return;
    }
    blocker.reset();
  }, [blocker]);
};

export default useUnsavedChangesGuard;
