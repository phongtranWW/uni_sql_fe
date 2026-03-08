import { cn } from "@/lib/utils";
import { Loader2, CloudOff, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/app/hook";
import { selectMeta } from "@/features/project/selectors";

const STATUS_CONFIG = {
  saving: {
    label: "Saving...",
    icon: <Loader2 className="h-3 w-3 animate-spin" />,
    variant: "secondary" as const,
    className: "",
  },
  unsaved: {
    label: "Unsaved",
    icon: <CloudOff className="h-3 w-3" />,
    variant: "outline" as const,
    className: "text-yellow-600 border-yellow-400 dark:text-yellow-400",
  },
  saved: {
    label: "Saved",
    icon: <Check className="h-3 w-3" />,
    variant: "outline" as const,
    className: "text-green-600 border-green-400 dark:text-green-500",
  },
};

const HeaderProjectStatus = () => {
  const { saveStatus } = useAppSelector(selectMeta);
  const config = STATUS_CONFIG[saveStatus];

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "flex items-center gap-1.5 text-xs font-normal",
        config.className,
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default HeaderProjectStatus;
