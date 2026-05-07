import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  issuePanelSet,
  sidebarSet,
  minimapSet,
  controlSet,
} from "@/features/editor-settings/editor-settings.slice";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";
import { Fragment, useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EDITOR_SHORTCUT_HELP } from "@/constants/editor-shortcuts";
import CodePreview from "./code-preview";
import { ActionCreators } from "redux-undo";
import projectService from "@/features/project/services/project.service";
import { useNavigate, useParams } from "react-router";
import { CODE_FORMATS } from "@/constants/code-formats";
import { type CodeFormat } from "@/types/format";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  selectIsOwner,
  selectProject,
  selectProjectIsDirty,
} from "@/features/project/selectors/project.selector";
import { selectProjectIssues } from "@/features/project/selectors/issue.selector";
import { upsertProject } from "@/features/project/thunks";
import ImportProjectDialog from "./import-project-dialog";
import { elementsSelectionDeleted } from "@/features/project/slices/project.slice";

const sanitizeProjectJsonExport = (raw: string) => {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return raw;
    }

    const { name, tables, refs, indexes } = parsed;
    return JSON.stringify(
      {
        name,
        tables,
        refs,
        indexes: indexes ?? [],
      },
      null,
      2,
    );
  } catch {
    return raw;
  }
};

const HeaderMenubar = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const showIssues = useAppSelector(
    (state) => state.editorSettings.show.issuePanel,
  );
  const showSidebar = useAppSelector(
    (state) => state.editorSettings.show.sidebar,
  );
  const showMinimap = useAppSelector(
    (state) => state.editorSettings.show.minimap,
  );
  const showControl = useAppSelector(
    (state) => state.editorSettings.show.control,
  );
  const project = useAppSelector(selectProject);
  const isDirty = useAppSelector(selectProjectIsDirty);
  const isOwner = useAppSelector(selectIsOwner);
  const issues = useAppSelector(selectProjectIssues);
  const saveStatus = useAppSelector(
    (state) => state.project.present.saveStatus,
  );
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  const [exportCode, setExportCode] = useState("");
  const [exportFormat, setExportFormat] = useState<CodeFormat>(
    CODE_FORMATS.JSON,
  );

  const handleExport = useCallback(
    async (format: "json" | "mysql" | "postgresql") => {
      if (!id || !project) return;
      if (issues.length > 0) {
        toast.error(
          `Fix ${issues.length} validation issue${issues.length === 1 ? "" : "s"} before exporting.`,
        );
        return;
      }
      if (saveStatus === "saving") {
        toast.info("Project is still saving. Try again in a moment.");
        return;
      }
      try {
        if (isDirty) {
          await dispatch(upsertProject({ id, body: project })).unwrap();
          dispatch(ActionCreators.clearHistory());
        }
        const result = await projectService.export(id, { format });
        if (result) {
          setExportCode(
            format === "json"
              ? sanitizeProjectJsonExport(result.content)
              : result.content,
          );
          setExportFormat(
            format === "postgresql"
              ? CODE_FORMATS.PostgreSQL
              : format === "mysql"
                ? CODE_FORMATS.MySQL
                : CODE_FORMATS.JSON,
          );
          setShowCodePreview(true);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unknown error");
      }
    },
    [dispatch, id, isDirty, issues, project, saveStatus],
  );

  const handleExportJson = useCallback(() => {
    void handleExport("json");
  }, [handleExport]);

  const handleExportMysql = useCallback(() => {
    void handleExport("mysql");
  }, [handleExport]);

  const handleExportPostgresql = useCallback(() => {
    void handleExport("postgresql");
  }, [handleExport]);

  const handleSave = useCallback(async () => {
    if (!id || !project) return;
    try {
      await dispatch(upsertProject({ id, body: project })).unwrap();
      dispatch(ActionCreators.clearHistory());
    } catch {
      /* save failed — keep undo history */
    }
  }, [dispatch, id, project]);

  const handleExit = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleDeleteProject = useCallback(async () => {
    if (!id) return;
    const shouldDelete = window.confirm(
      "Delete this project permanently? This action cannot be undone.",
    );
    if (!shouldDelete) return;

    try {
      await projectService.delete(id);
      toast.success("Project deleted.");
      navigate("/");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete project",
      );
    }
  }, [id, navigate]);

  const handleDeleteSelection = useCallback(() => {
    dispatch(elementsSelectionDeleted());
  }, [dispatch]);

  const openImportDialog = useCallback(() => {
    setShowImportDialog(true);
  }, []);

  const openShortcutsDialog = useCallback(() => {
    setShowShortcutsDialog(true);
  }, []);

  const handleUndo = useCallback(() => {
    dispatch(ActionCreators.undo());
  }, [dispatch]);

  const handleRedo = useCallback(() => {
    dispatch(ActionCreators.redo());
  }, [dispatch]);

  const handleSidebarCheckedChange = useCallback(
    (checked: boolean) => {
      dispatch(sidebarSet(checked));
    },
    [dispatch],
  );

  const handleIssuePanelCheckedChange = useCallback(
    (checked: boolean) => {
      dispatch(issuePanelSet(checked));
    },
    [dispatch],
  );

  const handleMinimapCheckedChange = useCallback(
    (checked: boolean) => {
      dispatch(minimapSet(checked));
    },
    [dispatch],
  );

  const handleControlCheckedChange = useCallback(
    (checked: boolean) => {
      dispatch(controlSet(checked));
    },
    [dispatch],
  );

  return (
    <div>
      <Menubar className="border-0 shadow-none bg-transparent p-0">
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent hover:bg-accent data-[state=open]:bg-accent">
            File
          </MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger disabled={isOwner === false}>
                Import from
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={openImportDialog}>
                  JSON
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger>Export to</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={handleExportJson}>
                  JSON
                </MenubarItem>
                <MenubarItem onClick={handleExportMysql}>
                  MySQL
                </MenubarItem>
                <MenubarItem onClick={handleExportPostgresql}>
                  Postgres
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem onClick={handleExit}>Exit</MenubarItem>
            <MenubarItem
              onClick={handleDeleteProject}
              disabled={isOwner === false}
              className="text-rose-600 focus:text-rose-600 data-disabled:text-rose-600/40 data-disabled:pointer-events-none"
            >
              Delete
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent hover:bg-accent data-[state=open]:bg-accent">
            Edit
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleUndo} disabled={isOwner === false}>
              Undo <MenubarShortcut>Ctrl + Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleRedo} disabled={isOwner === false}>
              Redo <MenubarShortcut>Ctrl + Y</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleSave} disabled={isOwner === false}>
              Save <MenubarShortcut>Ctrl + S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem
              onClick={handleDeleteSelection}
              disabled={isOwner === false}
            >
              Delete <MenubarShortcut>Del / Bac</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent hover:bg-accent data-[state=open]:bg-accent">
            View
          </MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem
              className="justify-between gap-4 pr-2"
              checked={showSidebar}
              onCheckedChange={handleSidebarCheckedChange}
            >
              Show Sidebar
              <MenubarShortcut>Ctrl + Alt + B</MenubarShortcut>
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              className="justify-between gap-4 pr-2"
              checked={showIssues}
              onCheckedChange={handleIssuePanelCheckedChange}
            >
              Show Issues
              <MenubarShortcut>Ctrl + Alt + I</MenubarShortcut>
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showMinimap}
              onCheckedChange={handleMinimapCheckedChange}
            >
              Show Minimap
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showControl}
              onCheckedChange={handleControlCheckedChange}
            >
              Show Controls
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Theme</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarRadioGroup
                  value={resolvedTheme}
                  onValueChange={setTheme}
                >
                  <MenubarRadioItem value="light">Light</MenubarRadioItem>
                  <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent hover:bg-accent data-[state=open]:bg-accent">
            Help
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={openShortcutsDialog}>
              Shortcuts
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <CodePreview
        open={showCodePreview}
        onOpenChange={setShowCodePreview}
        code={exportCode}
        format={exportFormat}
      />
      <ImportProjectDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />

      <Dialog open={showShortcutsDialog} onOpenChange={setShowShortcutsDialog}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
          <DialogHeader className="space-y-1.5 border-b border-border bg-muted/20 px-6 py-5 text-left">
            <DialogTitle className="text-base">Shortcuts</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[min(70vh,20rem)]">
            <ul className="px-2 py-2">
              {EDITOR_SHORTCUT_HELP.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-2 border-b border-border/60 px-4 py-3.5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                >
                  <p className="text-sm text-foreground">{row.description}</p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 sm:shrink-0 sm:justify-end">
                    {row.chords.map((chord, ci) => (
                      <Fragment key={ci}>
                        {ci > 0 && (
                          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                            or
                          </span>
                        )}
                        <div className="inline-flex items-center gap-0.5">
                          {chord.map((key, ki) => (
                            <Fragment key={`${key}-${ki}`}>
                              {ki > 0 && (
                                <span
                                  className="px-0.5 text-xs text-muted-foreground"
                                  aria-hidden
                                >
                                  +
                                </span>
                              )}
                              <Kbd>{key}</Kbd>
                            </Fragment>
                          ))}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeaderMenubar;
