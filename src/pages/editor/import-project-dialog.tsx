import { useRef, useState, type DragEvent } from "react";
import { AlertTriangle, Upload } from "lucide-react";
import { toast } from "sonner";
import { ActionCreators } from "redux-undo";
import { z } from "zod";
import { useAppDispatch } from "@/app/hook";
import { ProjectSchema, type Project } from "@/features/project/schemas/project.schema";
import { projectImported } from "@/features/project/slices/project.slice";
import { Button } from "@/components/ui/button";
import { TABLE_HEADER_COLORS } from "@/constants/table-header-colors";
import { REF_OPERATOR } from "@/features/project/schemas/ref.schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Importer = {
  id: string;
  label: string;
  extensions: string[];
  accept: string;
  parse: (content: string) => Project;
};

const IMPORTERS: Importer[] = [
  {
    id: "json",
    label: "JSON",
    extensions: ["json"],
    accept: ".json,application/json",
    parse: (content) => {
      const parsed = JSON.parse(content) as unknown;
      return ProjectSchema.parse(normalizeImportedProject(parsed));
    },
  },
];

const getRandomTableHeaderColor = () =>
  TABLE_HEADER_COLORS[
    Math.floor(Math.random() * TABLE_HEADER_COLORS.length)
  ];

const normalizeImportedProject = (raw: unknown) => {
  const input =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};

  const tablesRaw = Array.isArray(input.tables) ? input.tables : [];
  const refsRaw = Array.isArray(input.refs) ? input.refs : [];
  const indexesRaw = Array.isArray(input.indexes) ? input.indexes : [];

  return {
    name: input.name,
    tables: tablesRaw.map((table) => {
      const t = table && typeof table === "object" ? (table as Record<string, unknown>) : {};
      const fieldsRaw = Array.isArray(t.fields) ? t.fields : [];
      return {
        name: t.name,
        fields: fieldsRaw.map((field) => {
          const f =
            field && typeof field === "object"
              ? (field as Record<string, unknown>)
              : {};
          return {
            name: f.name,
            type: f.type,
            unique: Boolean(f.unique),
            pk: Boolean(f.pk),
            not_null: Boolean(f.not_null),
            increment: Boolean(f.increment),
          };
        }),
        headerColor:
          typeof t.headerColor === "string"
            ? t.headerColor
            : getRandomTableHeaderColor(),
        alias: typeof t.alias === "string" || t.alias === null ? t.alias : null,
        isSelected: Boolean(t.isSelected),
      };
    }),
    refs: refsRaw.map((ref) => {
      const r = ref && typeof ref === "object" ? (ref as Record<string, unknown>) : {};
      const endpointsRaw = Array.isArray(r.endpoints) ? r.endpoints : [];
      return {
        name: r.name,
        isSelected: Boolean(r.isSelected),
        operator:
          r.operator === REF_OPERATOR.ONE_TO_ONE ||
          r.operator === REF_OPERATOR.ONE_TO_MANY ||
          r.operator === REF_OPERATOR.MANY_TO_ONE
            ? r.operator
            : REF_OPERATOR.ONE_TO_ONE,
        endpoints: endpointsRaw.map((endpoint) => {
          const ep =
            endpoint && typeof endpoint === "object"
              ? (endpoint as Record<string, unknown>)
              : {};
          return {
            tableName: ep.tableName,
            fieldName: ep.fieldName,
          };
        }),
      };
    }),
    indexes: indexesRaw.map((index) => {
      const i =
        index && typeof index === "object" ? (index as Record<string, unknown>) : {};
      return {
        name: i.name,
        tableName: i.tableName,
        fields: Array.isArray(i.fields) ? i.fields : [],
        unique: Boolean(i.unique),
      };
    }),
  };
};

interface ImportProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportProjectDialog = ({ open, onOpenChange }: ImportProjectDialogProps) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const importer = IMPORTERS[0];

  const resetDialogState = () => {
    setSelectedFile(null);
    setIsDragOver(false);
    setIsImporting(false);
  };

  const closeDialog = () => {
    onOpenChange(false);
    resetDialogState();
  };

  const validateFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !importer.extensions.includes(extension)) {
      toast.error(`Invalid file type. Please choose a ${importer.extensions.join(", ")} file.`);
      return false;
    }
    return true;
  };

  const handleFilePicked = (file: File | null) => {
    if (!file) return;
    if (!validateFile(file)) return;
    setSelectedFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (selectedFile) return;
    setIsDragOver(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    handleFilePicked(file);
  };

  const parseWithImporter = async (file: File) => {
    const raw = await file.text();
    return importer.parse(raw);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please choose a file to import.");
      return;
    }

    setIsImporting(true);
    try {
      const project = await parseWithImporter(selectedFile);
      dispatch(projectImported(project));
      dispatch(ActionCreators.clearHistory());
      toast.success("Project imported. Current data has been replaced.");
      closeDialog();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0]?.message ?? "Invalid project file structure.");
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
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : closeDialog())}>
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
          onDragOver={(event) => {
            event.preventDefault();
            if (selectedFile) return;
            setIsDragOver(true);
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
          {!selectedFile ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => fileInputRef.current?.click()}
            >
              Choose file
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 border-rose-500/50 text-rose-700 hover:bg-rose-500/10 dark:text-rose-300"
              onClick={() => setSelectedFile(null)}
            >
              Cancel this file
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={importer.accept}
            className="hidden"
            onChange={(event) => handleFilePicked(event.target.files?.[0] ?? null)}
          />
          {selectedFile ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Ready: <span className="font-medium text-foreground">{selectedFile.name}</span>
            </p>
          ) : null}
        </div>

        <div className="rounded-md border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-300">
          <div className="flex items-center gap-2 font-medium">
            <AlertTriangle className="h-4 w-4" />
            Warning
          </div>
          <p className="mt-1">
            Import will overwrite all current tables, refs, indexes, and project name.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button type="button" onClick={handleImport} disabled={!selectedFile || isImporting}>
            {isImporting ? "Importing..." : "Import and overwrite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportProjectDialog;
