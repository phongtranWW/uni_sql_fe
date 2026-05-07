import { useAppSelector, useAppDispatch } from "@/app/hook";
import { selectProjectIssues } from "@/features/project/selectors/issue.selector";
import type { ProjectIssue } from "@/features/project/selectors/issue.selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { issuePanelSet } from "@/features/editor-settings/editor-settings.slice";
import {
  tablesSelected,
  refsSelected,
  tablesSelectionCleared,
  refsSelectionCleared,
} from "@/features/project/slices/project.slice";
import {
  selectTables,
  selectRefs,
} from "@/features/project/selectors/project.selector";
import { useCallback } from "react";

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
  const showIssues = useAppSelector(
    (state) => state.editorSettings.show.issuePanel,
  );
  const tables = useAppSelector(selectTables);
  const refs = useAppSelector(selectRefs);
  const dispatch = useAppDispatch();

  const handleIssueClick = useCallback(
    (issue: ProjectIssue) => {
      const [root, idx] = issue.path;
      if (root === "tables" && typeof idx === "number") {
        const table = tables[idx];
        if (!table) return;
        const isCurrentlySelected = table.isSelected ?? false;
        dispatch(tablesSelectionCleared());
        dispatch(refsSelectionCleared());
        if (!isCurrentlySelected) {
          dispatch(tablesSelected({ name: [table.name], value: true }));
        }
      } else if (root === "refs" && typeof idx === "number") {
        const ref = refs[idx];
        if (!ref) return;
        const isCurrentlySelected = ref.isSelected ?? false;
        dispatch(tablesSelectionCleared());
        dispatch(refsSelectionCleared());
        if (!isCurrentlySelected) {
          dispatch(refsSelected({ name: [ref.name], value: true }));
        }
      }
    },
    [dispatch, tables, refs],
  );

  if (!showIssues) return null;

  return (
    <>
      <ResizableHandle />
      <ResizablePanel defaultSize="20%" minSize="15%" maxSize="35%">
        <div className="flex h-full flex-col border-l border-border bg-background">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-destructive/10">
            <AlertCircle
              className="size-4 text-destructive"
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
                <div
                  className="flex cursor-pointer gap-2.5 rounded-lg border border-border/60 bg-muted/15 px-3 py-2.5 transition-colors hover:bg-muted/25"
                  onClick={() => handleIssueClick(issue)}
                >
                  <AlertCircle
                    className="mt-0.5 size-3.5 shrink-0 text-destructive"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-snug wrap-break-word text-foreground">
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
      </ResizablePanel>
    </>
  );
};

export default PanelIssues;
