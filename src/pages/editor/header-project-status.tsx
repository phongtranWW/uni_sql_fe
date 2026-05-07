import { useAppSelector } from "@/app/hook";
import { Badge } from "@/components/ui/badge";
import { selectProjectSaveState } from "@/features/project/selectors/project.selector";
import { CheckCircle2, Loader2, Pencil } from "lucide-react";

const HeaderProjectStatus = () => {
  const saveState = useAppSelector(selectProjectSaveState);

  if (saveState === "saving") {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 border-sky-600/50 text-sky-600 dark:border-sky-400/50 dark:text-sky-400"
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Saving
      </Badge>
    );
  }

  if (saveState === "dirty") {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 border-red-600/50 text-red-600 dark:border-red-400/50 dark:text-red-400"
      >
        <Pencil className="h-3.5 w-3.5" />
        Dirty
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-emerald-600/50 text-emerald-600 dark:border-emerald-400/50 dark:text-emerald-400"
    >
      <CheckCircle2 className="h-3.5 w-3.5" />
      Saved
    </Badge>
  );
};

export default HeaderProjectStatus;
