import { useRef, useState, type DragEvent } from "react";
import { AlertTriangle, Upload } from "lucide-react";
import { toast } from "sonner";
import { ActionCreators } from "redux-undo";
import { z } from "zod";
import { useAppDispatch } from "@/app/hook";
import {
  ProjectSchema,
  type Project,
} from "@/features/project/schemas/project.schema";
import { projectImported } from "@/features/project/slices/project.slice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ACCEPTED_EXTENSIONS = ["json"];
const ACCEPTED_ACCEPT = ".json,application/json";

const parseProjectFile = async (file: File): Promise<Project> => {
  const raw = await file.text();
  return ProjectSchema.parse(JSON.parse(raw));
};

interface ImportProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportProjectDialog = ({
  open,
  onOpenChange,
}: ImportProjectDialogProps) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const closeDialog = () => {
    onOpenChange(false);
    setSelectedFile(null);
    setIsDragOver(false);
    setIsImporting(false);
  };

  const validateAndPickFile = (file: File | null) => {
    if (!file) return;
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !ACCEPTED_EXTENSIONS.includes(extension)) {
      toast.error(
        `Invalid file type. Please choose a ${ACCEPTED_EXTENSIONS.join(", ")} file.`,
      );
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (selectedFile) return;
    setIsDragOver(false);
    validateAndPickFile(e.dataTransfer.files?.[0] ?? null);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please choose a file to import.");
      return;
    }

    setIsImporting(true);
    try {
      const project = await parseProjectFile(selectedFile);
      dispatch(projectImported(project));
      dispatch(ActionCreators.clearHistory());
      toast.success("Project imported. Current data has been replaced.");
      closeDialog();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(
          error.issues[0]?.message ?? "Invalid project file structure.",
        );
      } else if (error instanceof SyntaxError) {
        toast.error("Invalid JSON file.");
      } else {
        toast.error(error instanceof Error ? error.message : "Import failed.");
      }
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) =>
        nextOpen ? onOpenChange(true) : closeDialog()
      }
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import project</DialogTitle>
          <DialogDescription>
            Import from file and replace current project data.
          </DialogDescription>
        </DialogHeader>

        <div
          className={`rounded-md border border-dashed p-5 text-center transition-colors ${
            selectedFile
              ? "border-emerald-500/50 bg-emerald-500/10"
              : isDragOver
                ? "border-cyan-500/60 bg-cyan-500/10"
                : "border-slate-400/40 bg-slate-500/5"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            if (!selectedFile) setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload
            className={`mx-auto mb-2 h-5 w-5 ${
              selectedFile
                ? "text-emerald-700 dark:text-emerald-300"
                : "text-cyan-700 dark:text-cyan-300"
            }`}
          />
          <p className="text-sm font-medium">
            {selectedFile ? "File imported to dialog" : "Drop JSON file here"}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedFile
              ? "You can import this file now, or cancel it to choose another."
              : "Or choose from disk. Accepted: .json"}
          </p>

          {selectedFile ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 border-rose-500/50 text-rose-700 hover:bg-rose-500/10 dark:text-rose-300"
              onClick={() => setSelectedFile(null)}
            >
              Cancel this file
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose file
            </Button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_ACCEPT}
            className="hidden"
            onChange={(e) => validateAndPickFile(e.target.files?.[0] ?? null)}
          />

          {selectedFile && (
            <p className="mt-3 text-xs text-muted-foreground">
              Ready:{" "}
              <span className="font-medium text-foreground">
                {selectedFile.name}
              </span>
            </p>
          )}
        </div>

        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4" />
            Warning
          </div>
          <p className="mt-1">
            Import will overwrite all current tables, refs, indexes, and project
            name.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!selectedFile || isImporting}
          >
            {isImporting ? "Importing..." : "Import and overwrite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportProjectDialog;
