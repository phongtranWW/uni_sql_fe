import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { sql } from "@codemirror/lang-sql";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
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

const EXTENSIONS = {
  [CODE_FORMATS.JSON]: [json()],
  [CODE_FORMATS.MySQL]: [sql()],
  [CODE_FORMATS.PostgreSQL]: [sql()],
  [CODE_FORMATS.DBML]: [],
};

interface CodePreviewProps {
  code: string;
  format: CodeFormat;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CodePreview = ({
  code,
  format,
  open,
  onOpenChange,
}: CodePreviewProps) => {
  const { resolvedTheme } = useTheme();

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export.${FILE_EXTENSIONS[format]}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, format]);

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
          <Button onClick={handleDownload}>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CodePreview;
