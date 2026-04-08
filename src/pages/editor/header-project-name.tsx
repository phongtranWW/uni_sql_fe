import { useEffect, useState, type KeyboardEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { Input } from "@/components/ui/input";
import { selectProject } from "@/features/project/selectors/project.selector";
import { nameSet } from "@/features/project/slices/project.slice";
import { cn } from "@/lib/utils";

interface HeaderProjectNameProps {
  className?: string;
}

const HeaderProjectName = ({ className }: HeaderProjectNameProps) => {
  const dispatch = useAppDispatch();
  const project = useAppSelector(selectProject);
  const [draftName, setDraftName] = useState(project?.name ?? "");

  useEffect(() => {
    setDraftName(project?.name ?? "");
  }, [project?.name]);

  const commitName = () => {
    if (!project) return;
    const nextName = draftName.trim();
    if (!nextName) {
      setDraftName(project.name);
      return;
    }
    if (nextName === project.name) return;
    dispatch(nameSet(nextName));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      commitName();
      event.currentTarget.blur();
      return;
    }
    if (event.key === "Escape") {
      setDraftName(project?.name ?? "");
      event.currentTarget.blur();
    }
  };

  return (
    <Input
      value={draftName}
      onChange={(event) => setDraftName(event.target.value)}
      onBlur={commitName}
      onKeyDown={handleKeyDown}
      placeholder="Project name"
      className={cn("h-7 w-56 rounded-sm text-sm", className)}
    />
  );
};

export default HeaderProjectName;
