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
import { useParams } from "react-router";
import { CODE_FORMATS } from "@/constants/code-formats";
import { type CodeFormat } from "@/types/format";
import { toast } from "sonner";
import { useTheme } from "next-themes";

const HeaderMenubar = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { resolvedTheme, setTheme } = useTheme();
  const showIssues = useAppSelector((state) => state.editorSettings.show.issuePanel);
  const showSidebar = useAppSelector((state) => state.editorSettings.show.sidebar);
  const showMinimap = useAppSelector((state) => state.editorSettings.show.minimap);
  const showControl = useAppSelector((state) => state.editorSettings.show.control);
  const [showCodePreview, setShowCodePreview] = useState(false);
  const [exportCode, setExportCode] = useState("");
  const [exportFormat, setExportFormat] = useState<CodeFormat>(
    CODE_FORMATS.JSON,
  );

  const handleExport = async (format: "json" | "mysql" | "postgresql") => {
    if (!id) return;
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
  };

  return (
    <div>
      <Menubar className="border-0 shadow-none bg-transparent p-0">
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent hover:bg-accent data-[state=open]:bg-accent">
            File
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Import from</MenubarItem>
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
            <MenubarItem>
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
    </div>
  );
};

export default HeaderMenubar;
