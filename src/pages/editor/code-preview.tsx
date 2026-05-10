import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { sql } from "@codemirror/lang-sql";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { useNavigate } from "react-router";
import { FlaskConical } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { type CodeFormat } from "@/types/format";
import { CODE_FORMATS } from "@/constants/code-formats";
import { useCallback } from "react";
import { FILE_EXTENSIONS } from "@/constants/file-extensions";
import { useAppDispatch } from "@/app/hook";
import { playgroundSeedSet } from "@/features/playground/playground.slice";
import { isPlaygroundSupported, type SqlDialect } from "@/lib/sql-engine";

const EXTENSIONS = {
  [CODE_FORMATS.JSON]: [json()],
  [CODE_FORMATS.MySQL]: [sql()],
  [CODE_FORMATS.PostgreSQL]: [sql()],
  [CODE_FORMATS.DBML]: [],
};

/**
 * Map the editor's CodeFormat to the engine layer's SqlDialect. Returning
 * null means "no playground for this format" (e.g. JSON, DBML).
 */
function formatToDialect(format: CodeFormat): SqlDialect | null {
  switch (format) {
    case CODE_FORMATS.PostgreSQL:
      return "postgresql";
    case CODE_FORMATS.MySQL:
      return "mysql";
    default:
      return null;
  }
}

interface CodePreviewProps {
  code: string;
  format: CodeFormat;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Used to seed the playground page so it can label & link back. */
  projectId?: string | null;
  projectName?: string | null;
}

const CodePreview = ({
  code,
  format,
  open,
  onOpenChange,
  projectId = null,
  projectName = null,
}: CodePreviewProps) => {
  const { resolvedTheme } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export.${FILE_EXTENSIONS[format]}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, format]);

  const dialect = formatToDialect(format);
  const canTestSql = dialect !== null && isPlaygroundSupported(dialect);

  const handleTestSql = useCallback(() => {
    if (!dialect) return;
    dispatch(
      playgroundSeedSet({
        sql: code,
        dialect,
        projectId,
        projectName,
        createdAt: new Date().toISOString(),
      }),
    );
    onOpenChange(false);
    navigate("/playground");
  }, [code, dialect, dispatch, navigate, onOpenChange, projectId, projectName]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-none sm:max-w-none h-[80vh]">
        <DialogHeader>
          <DialogTitle>Preview Result</DialogTitle>
          <DialogDescription>
            This is the result you will receive.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 border rounded-md overflow-hidden">
          <ScrollArea className="h-full">
            <CodeMirror
              value={code}
              height="100%"
              extensions={EXTENSIONS[format]}
              key={resolvedTheme}
              theme={resolvedTheme === "dark" ? githubDark : githubLight}
              editable={false}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLine: true,
              }}
              className="text-sm"
            />
          </ScrollArea>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {canTestSql && (
            <Button variant="secondary" onClick={handleTestSql}>
              <FlaskConical className="size-4" />
              Test SQL
            </Button>
          )}
          <Button onClick={handleDownload}>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CodePreview;
