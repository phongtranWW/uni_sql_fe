import { useEffect } from "react";
import { useBeforeUnload, useBlocker } from "react-router";

const LEAVE_PAGE_MESSAGE =
  "You have unsaved changes. Are you sure you want to leave this page?";

const useUnsavedChangesGuard = (isDirty: boolean) => {
  useBeforeUnload((event) => {
    if (!isDirty) return;
    event.preventDefault();
    event.returnValue = LEAVE_PAGE_MESSAGE;
  });

  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (blocker.state !== "blocked") return;

    const shouldLeave = window.confirm(LEAVE_PAGE_MESSAGE);
    if (shouldLeave) {
      blocker.proceed();
      return;
    }
    blocker.reset();
  }, [blocker]);
};

export default useUnsavedChangesGuard;
