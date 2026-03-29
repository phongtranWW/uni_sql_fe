import { useAppSelector } from "@/app/hook";
import { selectSaveStatus } from "@/features/project/selectors/project.selector";
import { useCallback, useEffect } from "react";
import { useBlocker } from "react-router";

const useUnsavedWarning = () => {
  const saveStatus = useAppSelector(selectSaveStatus);
  const isDirty = saveStatus !== "saved";
  const blocker = useBlocker(useCallback(() => isDirty, [isDirty]));

  useEffect(() => {
    if (!isDirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  return { isDirty, blocker };
};

export default useUnsavedWarning;
