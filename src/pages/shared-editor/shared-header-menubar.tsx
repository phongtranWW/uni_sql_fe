import { useAppDispatch, useAppSelector } from "@/app/hook";
import {
  issuePanelSet,
  sidebarSet,
  minimapSet,
  controlSet,
  autoFocusSet,
} from "@/features/editor-settings/editor-settings.slice";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useCallback, useState } from "react";
import CodePreview from "@/pages/editor/code-preview";
import projectService from "@/features/project/services/project.service";
import { useNavigate, useParams } from "react-router";
import { CODE_FORMATS } from "@/constants/code-formats";
import { type CodeFormat } from "@/types/format";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { selectProject } from "@/features/project/selectors/project.selector";

const SharedHeaderMenubar = () => {
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
  const autoFocus = useAppSelector(
    (state) => state.editorSettings.show.autoFocus,
  );
  const project = useAppSelector(selectProject);

  const [showCodePreview, setShowCodePreview] = useState(false);
  const [exportCode, setExportCode] = useState("");
  const [exportFormat, setExportFormat] = useState<CodeFormat>(
    CODE_FORMATS.JSON,
  );

  const handleExport = useCallback(
    async (format: "json" | "mysql" | "postgresql") => {
      if (!id || !project) return;
      try {
        const result = await projectService.export(id, { format });
        if (result) {
          setExportCode(result.content);
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
    [id, project],
  );

  const handleSidebarCheckedChange = useCallback(
    (checked: boolean) => dispatch(sidebarSet(checked)),
    [dispatch],
  );
  const handleIssuePanelCheckedChange = useCallback(
    (checked: boolean) => dispatch(issuePanelSet(checked)),
    [dispatch],
  );
  const handleMinimapCheckedChange = useCallback(
    (checked: boolean) => dispatch(minimapSet(checked)),
    [dispatch],
  );
  const handleControlCheckedChange = useCallback(
    (checked: boolean) => dispatch(controlSet(checked)),
    [dispatch],
  );
  const handleAutoFocusCheckedChange = useCallback(
    (checked: boolean) => dispatch(autoFocusSet(checked)),
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
              <MenubarSubTrigger>Export to</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem onClick={() => void handleExport("json")}>
                  JSON
                </MenubarItem>
                <MenubarItem onClick={() => void handleExport("mysql")}>
                  MySQL
                </MenubarItem>
                <MenubarItem onClick={() => void handleExport("postgresql")}>
                  Postgres
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem onClick={() => navigate("/")}>Exit</MenubarItem>
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
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              className="justify-between gap-4 pr-2"
              checked={showIssues}
              onCheckedChange={handleIssuePanelCheckedChange}
            >
              Show Issues
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
            <MenubarCheckboxItem
              checked={autoFocus}
              onCheckedChange={handleAutoFocusCheckedChange}
            >
              Auto Focus
            </MenubarCheckboxItem>
            <MenubarCheckboxItem
              checked={resolvedTheme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            >
              Dark Theme
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <CodePreview
        open={showCodePreview}
        onOpenChange={setShowCodePreview}
        code={exportCode}
        format={exportFormat}
      />
    </div>
  );
};

export default SharedHeaderMenubar;
