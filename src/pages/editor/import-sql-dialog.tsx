import { useEffect, useRef, useState, type DragEvent } from "react";
import { AlertTriangle, ChevronDown, Upload } from "lucide-react";
import { toast } from "sonner";
import { ActionCreators } from "redux-undo";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { projectImported } from "@/features/project/slices/project.slice";
import { selectProject } from "@/features/project/selectors/project.selector";
import {
  importSqlToProject,
  type SqlDialect,
  type ImportWarning,
  type SqlImportOutput,
} from "@/utils/sql-importer";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const ACCEPTED_EXTENSION = "sql";
const ACCEPTED_ACCEPT = ".sql,application/sql,text/plain";

const DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
];

interface ParsedResult {
  output: SqlImportOutput;
  warnings: ImportWarning[];
}

interface ImportSqlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportSqlDialog = ({ open, onOpenChange }: ImportSqlDialogProps) => {
  const dispatch = useAppDispatch();
  const project = useAppSelector(selectProject);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [dialect, setDialect] = useState<SqlDialect>("postgresql");
  const [parsed, setParsed] = useState<ParsedResult | null>(null);
  const [warningsOpen, setWarningsOpen] = useState(false);

  // Re-parse whenever file or dialect changes so warnings update in real time.
  useEffect(() => {
    if (!selectedFile || !project) {
      setParsed(null);
      return;
    }
    let cancelled = false;
    void selectedFile.text().then((sql) => {
      if (cancelled) return;
      const result = importSqlToProject(sql, dialect, project.name);
      setParsed(result);
      // Auto-expand warnings panel if there are any.
      setWarningsOpen(result.warnings.length > 0);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedFile, dialect, project]);

  const closeDialog = () => {
    onOpenChange(false);
    setSelectedFile(null);
    setIsDragOver(false);
    setIsImporting(false);
    setParsed(null);
    setWarningsOpen(false);
  };

  const validateAndPickFile = (file: File | null) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== ACCEPTED_EXTENSION) {
      toast.error("Invalid file type. Please choose a .sql file.");
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

  const handleImport = () => {
    if (!parsed || !project) return;

    setIsImporting(true);
    try {
      // Merge the parsed output with the current project id so the existing
      // projectImported reducer can replace tables/refs/indexes/name in place.
      dispatch(projectImported({ ...parsed.output, id: project.id }));
      dispatch(ActionCreators.clearHistory());

      const wCount = parsed.warnings.length;
      toast.success(
        wCount > 0
          ? `SQL imported with ${wCount} warning${wCount === 1 ? "" : "s"}. Check the Issues panel.`
          : "SQL imported. Current data has been replaced.",
      );
      closeDialog();
    } finally {
      setIsImporting(false);
    }
  };

  const warningCount = parsed?.warnings.length ?? 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => (nextOpen ? onOpenChange(true) : closeDialog())}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import from SQL</DialogTitle>
          <DialogDescription>
            Import a .sql file and replace the current project data.
          </DialogDescription>
        </DialogHeader>

        {/* ── Dialect selector ── */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium">SQL Dialect</p>
          <div className="flex gap-2">
            {DIALECTS.map(({ value, label }) => (
              <Button
                key={value}
                type="button"
                variant={dialect === value ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setDialect(value)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* ── Drop zone ── */}
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
            {selectedFile ? "File loaded" : "Drop .sql file here"}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedFile
              ? "You can import this file now, or cancel it to choose another."
              : "Or choose from disk. Accepted: .sql"}
          </p>

          {selectedFile ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-3 border-rose-500/50 text-rose-700 hover:bg-rose-500/10 dark:text-rose-300"
              onClick={() => {
                setSelectedFile(null);
                setParsed(null);
              }}
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

        {/* ── Warnings (only when there are any) ── */}
        {warningCount > 0 && (
          <Collapsible open={warningsOpen} onOpenChange={setWarningsOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 transition-colors hover:bg-amber-500/15 dark:text-amber-300"
              >
                <span className="flex items-center gap-2 font-medium">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {warningCount} warning{warningCount === 1 ? "" : "s"} — import will still proceed
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${warningsOpen ? "rotate-180" : ""}`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ScrollArea className="mt-1 max-h-40 rounded-md border border-amber-500/30 bg-amber-500/5 p-2">
                <ul className="space-y-1">
                  {parsed?.warnings.map((w, i) => (
                    <li key={i} className="text-xs text-amber-700 dark:text-amber-300">
                      <span className="font-semibold">[{w.code}]</span>{" "}
                      {w.message}
                      {w.statement && (
                        <span className="ml-1 font-mono text-amber-600/80 dark:text-amber-400/80">
                          — {w.statement}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* ── Danger banner ── */}
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
          <Button
            type="button"
            onClick={handleImport}
            disabled={!parsed || isImporting}
          >
            {isImporting ? "Importing..." : "Import and overwrite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportSqlDialog;
