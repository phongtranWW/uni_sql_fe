import { useAppSelector, useAppDispatch } from "@/app/hook";
import { selectProjectIssues } from "@/features/project/selectors/issue.selector";
import type { ProjectIssue } from "@/features/project/selectors/issue.selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { issuePanelSet } from "@/features/editor-settings/editor-settings.slice";

const formatPath = (path: (string | number)[]): string => {
  return path
    .map((segment) => (typeof segment === "number" ? `[${segment}]` : segment))
    .join(".")
    .replace(/\.\[/g, "[");
};

const issueRowKey = (issue: ProjectIssue, index: number): string => {
  const pathKey = issue.path.map(String).join("/");
  return `${index}:${pathKey}:${issue.message}`;
};

const PanelIssues = () => {
  const issues = useAppSelector(selectProjectIssues);
  const dispatch = useAppDispatch();

  return (
    <div className="flex h-full flex-col border-l border-border bg-background">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
            <AlertTriangle
              className="size-4 text-amber-600 dark:text-amber-400"
              aria-hidden
            />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold leading-none">
              Issues
            </h2>
            <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
              Validation from project schema
            </p>
          </div>
          <Badge
            variant={issues.length > 0 ? "destructive" : "secondary"}
            className="h-5 shrink-0 px-1.5 text-[10px] tabular-nums"
          >
            {issues.length}
          </Badge>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="shrink-0 text-muted-foreground"
          aria-label="Close issues panel"
          onClick={() => dispatch(issuePanelSet(false))}
        >
          <X className="size-3.5" />
        </Button>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        {issues.length === 0 ? (
          <div className="mx-3 my-4 flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center text-muted-foreground">
            <div className="flex size-11 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2
                className="size-6 text-emerald-600 dark:text-emerald-400"
                aria-hidden
              />
            </div>
            <span className="text-sm font-medium text-foreground">
              No issues found
            </span>
            <span className="max-w-55 text-xs leading-relaxed">
              Project data matches the schema. Fix any new problems here as you
              edit.
            </span>
          </div>
        ) : (
          <ul className="space-y-2 p-3" role="list">
            {issues.map((issue, idx) => (
              <li key={issueRowKey(issue, idx)}>
                <div className="flex gap-2.5 rounded-lg border border-border/60 bg-muted/15 px-3 py-2.5 transition-colors hover:bg-muted/25">
                  <AlertTriangle
                    className="mt-0.5 size-3.5 shrink-0 text-amber-600 dark:text-amber-400"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug wrap-break-word text-foreground">
                      {issue.message}
                    </p>
                    {issue.path.length > 0 && (
                      <p
                        className="mt-1.5 rounded bg-muted/50 px-1.5 py-1 font-mono text-[11px] leading-relaxed text-muted-foreground wrap-break-word"
                        title={formatPath(issue.path)}
                      >
                        {formatPath(issue.path)}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
};

export default PanelIssues;
