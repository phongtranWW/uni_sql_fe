import { useAppDispatch, useAppSelector } from "@/app/hook";
import { issuePanelSet, sidebarSet, minimapSet, controlSet } from "@/features/editor-settings/editor-settings.slice";
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
import { useState } from "react";
import CodePreview from "./code-preview";
import { ActionCreators } from "redux-undo";
import projectService from "@/features/project/services/project.service";
import { useNavigate, useParams } from "react-router";
import { CODE_FORMATS } from "@/constants/code-formats";
import { type CodeFormat } from "@/types/format";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import {
  selectProject,
  selectProjectIsDirty,
} from "@/features/project/selectors/project.selector";
import { selectProjectIssues } from "@/features/project/selectors/issue.selector";
import { upsertProject } from "@/features/project/thunks";
import ImportProjectDialog from "./import-project-dialog";

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
  const showIssues = useAppSelector((state) => state.editorSettings.show.issuePanel);
  const showSidebar = useAppSelector((state) => state.editorSettings.show.sidebar);
  const showMinimap = useAppSelector((state) => state.editorSettings.show.minimap);
  const showControl = useAppSelector((state) => state.editorSettings.show.control);
  const project = useAppSelector(selectProject);
  const isDirty = useAppSelector(selectProjectIsDirty);
  const issues = useAppSelector(selectProjectIssues);
  const saveStatus = useAppSelector(
    (state) => state.project.present.saveStatus,
  );
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [exportCode, setExportCode] = useState("");
  const [exportFormat, setExportFormat] = useState<CodeFormat>(
    CODE_FORMATS.JSON,
  );

  const handleExport = async (format: "json" | "mysql" | "postgresql") => {
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
  };

  const handleSave = async () => {
    if (!id || !project) return;
    try {
      await dispatch(upsertProject({ id, body: project })).unwrap();
      dispatch(ActionCreators.clearHistory());
    } catch {
      /* save failed — keep undo history */
    }
  };

  const handleExit = () => {
    navigate("/");
  };

  const handleDeleteProject = async () => {
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
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
    }
  };

  return (
    <div>
      <Menubar className="border-0 shadow-none bg-transparent p-0">
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent hover:bg-accent data-[state=open]:bg-accent">
            File
          </MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Import from</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={() => setShowImportDialog(true)}>
                  JSON
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSub>
              <MenubarSubTrigger>Export to</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={() => handleExport("json")}>
                  JSON
                </MenubarItem>
                <MenubarItem onClick={() => handleExport("mysql")}>
                  MySQL
                </MenubarItem>
                <MenubarItem onClick={() => handleExport("postgresql")}>
                  Postgres
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem onClick={handleExit}>Exit</MenubarItem>
            <MenubarItem
              onClick={handleDeleteProject}
              className="text-rose-600 focus:text-rose-600"
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
            <MenubarItem onClick={() => dispatch(ActionCreators.undo())}>
              Undo <MenubarShortcut>Ctrl + Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => dispatch(ActionCreators.redo())}>
              Redo <MenubarShortcut>Ctrl + Y</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleSave}>
              Save <MenubarShortcut>Ctrl + S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
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
              checked={showSidebar}
              onCheckedChange={(checked) => dispatch(sidebarSet(checked))}
            >
              Show Sidebar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showIssues}
              onCheckedChange={(checked) => dispatch(issuePanelSet(checked))}
            >
              Show Issues
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showMinimap}
              onCheckedChange={(checked) => dispatch(minimapSet(checked))}
            >
              Show Minimap
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={showControl}
              onCheckedChange={(checked) => dispatch(controlSet(checked))}
            >
              Show Controls
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Theme</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarRadioGroup value={resolvedTheme} onValueChange={setTheme}>
                  <MenubarRadioItem value="light">
                    Light
                  </MenubarRadioItem>
                  <MenubarRadioItem value="dark">
                    Dark
                  </MenubarRadioItem>
                </MenubarRadioGroup>
              </MenubarSubContent>
            </MenubarSub>
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
    </div>
  );
};

export default HeaderMenubar;
