import { useAppSelector, useAppDispatch } from "@/app/hook";
import { selectProjectIssues } from "@/features/project/selectors/issue.selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  X,
} from "lucide-react";
import { issuePanelSet } from "@/features/editor-settings/editor-settings.slice";

const formatPath = (path: (string | number)[]): string => {
  return path
    .map((segment) =>
      typeof segment === "number" ? `[${segment}]` : segment,
    )
    .join(".")
    .replace(/\.\[/g, "[");
};

const PanelIssues = () => {
  const issues = useAppSelector(selectProjectIssues);
  const dispatch = useAppDispatch();

  return (
    <div className="h-full flex flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium">Issues</span>
          <Badge
            variant={issues.length > 0 ? "destructive" : "secondary"}
            className="text-[10px] px-1.5 h-5"
          >
            {issues.length}
          </Badge>
        </div>
        <button
          onClick={() => dispatch(issuePanelSet(false))}
          className="p-1 rounded-sm hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 min-h-0">
        {issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <span className="text-sm font-medium">No issues found</span>
            <span className="text-xs">Your project is looking good!</span>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {issues.map((issue, idx) => (
              <div
                key={`${issue.message}-${idx}`}
                className="flex items-start gap-2 p-2 rounded-md hover:bg-accent/50 transition-colors group cursor-default"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-tight break-words">
                    {issue.message}
                  </p>
                  {issue.path.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      {formatPath(issue.path)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default PanelIssues;
