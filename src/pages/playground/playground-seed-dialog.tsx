import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Copy,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  generateInserts,
  type FakeDataResult,
  type SeedTableConfig,
} from "@/lib/fake-data";
import { usePlayground } from "./playground-context";
import PlaygroundSeedTableRow from "./playground-seed-table-row";

interface PlaygroundSeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_ROW_COUNT = 10;
const PREVIEW_DEBOUNCE_MS = 200;

/**
 * Dialog for generating fake INSERT statements based on the live pglite
 * schema and faker.
 *
 * State machine:
 *  - on open → snapshot schema, pre-select all tables with DEFAULT_ROW_COUNT
 *  - on every config change → debounce 200 ms, regenerate preview
 *  - "Regenerate" forces a new faker seed
 *  - "Copy SQL" / "Run insert" act on the latest preview
 */
const PlaygroundSeedDialog = ({
  open,
  onOpenChange,
}: PlaygroundSeedDialogProps) => {
  const { engine } = usePlayground();
  const { resolvedTheme } = useTheme();

  // Per-table config: undefined means "not selected".
  const [rowCounts, setRowCounts] = useState<Map<string, number>>(new Map());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [autoIncludeParents, setAutoIncludeParents] = useState(true);
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1e9));
  const [previewOpen, setPreviewOpen] = useState(true);
  const [warningsOpen, setWarningsOpen] = useState(false);

  const [result, setResult] = useState<FakeDataResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // ── Initialise selection on open ──
  useEffect(() => {
    if (!open) return;
    const nextSel = new Set<string>();
    const nextCounts = new Map<string, number>();
    for (const t of engine.schema) {
      nextSel.add(t.name);
      nextCounts.set(t.name, DEFAULT_ROW_COUNT);
    }
    setSelected(nextSel);
    setRowCounts(nextCounts);
    setSeed(Math.floor(Math.random() * 1e9));
    setResult(null);
  }, [open, engine.schema]);

  // ── Build config object (memoised) ──
  const config = useMemo(() => {
    const tables: SeedTableConfig[] = [];
    for (const tableName of selected) {
      const rowCount = rowCounts.get(tableName) ?? DEFAULT_ROW_COUNT;
      tables.push({ table: tableName, rowCount });
    }
    return {
      tables,
      autoIncludeFkParents: autoIncludeParents,
      defaultRowCount: DEFAULT_ROW_COUNT,
      seed,
    };
  }, [selected, rowCounts, autoIncludeParents, seed]);

  // ── Debounced regen on every config change ──
  useEffect(() => {
    if (!open) return;
    if (config.tables.length === 0) {
      setResult({ sql: "", plan: [], warnings: [] });
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      setIsGenerating(true);
      generateInserts(engine.schema, config)
        .then((r) => {
          if (cancelled) return;
          setResult(r);
          if (r.warnings.length > 0) setWarningsOpen(true);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          toast.error(
            err instanceof Error
              ? `Failed to generate data: ${err.message}`
              : "Failed to generate data",
          );
        })
        .finally(() => {
          if (!cancelled) setIsGenerating(false);
        });
    }, PREVIEW_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [config, engine.schema, open]);

  // ── FK parent map for the per-row badge ──
  const fkParentsByTable = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const t of engine.schema) {
      const parents = Array.from(
        new Set(
          t.columns
            .filter((c) => c.fk)
            .map((c) => c.fk!.table)
            .filter((p) => p !== t.name),
        ),
      );
      map.set(t.name, parents);
    }
    return map;
  }, [engine.schema]);

  const handleToggleAll = useCallback(
    (checked: boolean) => {
      const next = new Set<string>();
      if (checked) for (const t of engine.schema) next.add(t.name);
      setSelected(next);
    },
    [engine.schema],
  );

  const handleRowCount = useCallback((table: string, count: number) => {
    setRowCounts((prev) => {
      const next = new Map(prev);
      next.set(table, count);
      return next;
    });
  }, []);

  const handleSelected = useCallback((table: string, next: boolean) => {
    setSelected((prev) => {
      const set = new Set(prev);
      if (next) set.add(table);
      else set.delete(table);
      return set;
    });
  }, []);

  const handleRegenerate = () => setSeed(Math.floor(Math.random() * 1e9));

  const handleCopy = async () => {
    if (!result?.sql) return;
    try {
      await navigator.clipboard.writeText(result.sql);
      toast.success("SQL copied to clipboard.");
    } catch {
      toast.error("Failed to copy.");
    }
  };

  const handleRun = async () => {
    if (!result?.sql) return;
    setIsRunning(true);
    try {
      const r = await engine.runScript(result.sql);
      const totalRows = result.plan.reduce((acc, p) => acc + p.rowCount, 0);
      toast.success(
        `Inserted ${totalRows} row${totalRows === 1 ? "" : "s"} across ${result.plan.length} table${result.plan.length === 1 ? "" : "s"} · ${r.durationMs}ms.`,
      );
      onOpenChange(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as { message: unknown }).message)
            : "Insert failed";
      toast.error(`Insert failed: ${msg}`);
    } finally {
      setIsRunning(false);
    }
  };

  const allSelected =
    selected.size > 0 && selected.size === engine.schema.length;
  const noTables = engine.schema.length === 0;
  const totalSelectedRows = useMemo(
    () =>
      Array.from(selected).reduce(
        (acc, t) => acc + (rowCounts.get(t) ?? DEFAULT_ROW_COUNT),
        0,
      ),
    [selected, rowCounts],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[80vw] max-w-none sm:max-w-none flex h-[85vh] flex-col gap-3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-amber-500" />
            Generate fake data
          </DialogTitle>
          <DialogDescription>
            Pick the tables you want to seed. Foreign keys are resolved
            automatically using previously inserted rows.
          </DialogDescription>
        </DialogHeader>

        {noTables ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm italic text-muted-foreground">
              No tables in the database yet.
            </p>
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            {/* ── Left: table list + options ── */}
            <div className="flex min-h-0 flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(c) => handleToggleAll(c === true)}
                  />
                  Select all ({engine.schema.length})
                </label>
                <span className="text-xs text-muted-foreground">
                  {selected.size} selected · ~{totalSelectedRows} rows
                </span>
              </div>

              <ScrollArea className="flex-1 rounded-md border border-border">
                <ul className="space-y-1 p-2">
                  {engine.schema.map((t) => (
                    <PlaygroundSeedTableRow
                      key={t.name}
                      table={t}
                      selected={selected.has(t.name)}
                      rowCount={rowCounts.get(t.name) ?? DEFAULT_ROW_COUNT}
                      fkParents={fkParentsByTable.get(t.name) ?? []}
                      onSelectedChange={(c) => handleSelected(t.name, c)}
                      onRowCountChange={(c) => handleRowCount(t.name, c)}
                    />
                  ))}
                </ul>
              </ScrollArea>

              <div className="flex flex-col gap-2 rounded-md border border-border bg-muted/20 p-3 text-sm">
                <label className="flex items-center gap-2">
                  <Checkbox
                    checked={autoIncludeParents}
                    onCheckedChange={(c) => setAutoIncludeParents(c === true)}
                  />
                  <span>
                    Auto-include FK parents
                    <span className="ml-1 text-xs text-muted-foreground">
                      (recommended)
                    </span>
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Random seed
                  </span>
                  <Input
                    type="number"
                    value={seed}
                    onChange={(e) => {
                      const n = Number.parseInt(e.target.value, 10);
                      if (!Number.isNaN(n)) setSeed(n);
                    }}
                    className="h-7 flex-1 text-xs"
                  />
                  <Button
                    type="button"
                    size="xs"
                    variant="outline"
                    onClick={handleRegenerate}
                    title="New random seed"
                  >
                    <RefreshCw className="size-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Right: preview + warnings ── */}
            <div className="flex min-h-0 flex-col gap-3">
              {result && result.warnings.length > 0 && (
                <Collapsible
                  open={warningsOpen}
                  onOpenChange={setWarningsOpen}
                >
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 transition-colors hover:bg-amber-500/15 dark:text-amber-300"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <AlertTriangle className="size-4 shrink-0" />
                        {result.warnings.length} warning
                        {result.warnings.length === 1 ? "" : "s"}
                      </span>
                      <ChevronDown
                        className={`size-4 shrink-0 transition-transform ${warningsOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <ScrollArea className="mt-1 max-h-32 rounded-md border border-amber-500/30 bg-amber-500/5 p-2">
                      <ul className="space-y-1">
                        {result.warnings.map((w, i) => (
                          <li
                            key={i}
                            className="text-xs text-amber-700 dark:text-amber-300"
                          >
                            <span className="font-semibold">[{w.code}]</span>{" "}
                            {w.message}
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CollapsibleContent>
                </Collapsible>
              )}

              <Collapsible
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                className="flex min-h-0 flex-1 flex-col"
              >
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      Preview SQL
                      {isGenerating && <Spinner className="size-3" />}
                      {result?.plan && result.plan.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          · {result.plan.length} INSERT
                          {result.plan.length === 1 ? "" : "s"}
                        </span>
                      )}
                    </span>
                    <ChevronDown
                      className={`size-4 transition-transform ${previewOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 flex min-h-0 flex-1 flex-col">
                  <div className="min-h-0 flex-1 overflow-hidden rounded-md border border-border">
                    {result?.sql ? (
                      <CodeMirror
                        value={result.sql}
                        height="100%"
                        extensions={[sql({ dialect: PostgreSQL })]}
                        theme={resolvedTheme === "dark" ? githubDark : githubLight}
                        key={resolvedTheme}
                        editable={false}
                        basicSetup={{
                          lineNumbers: true,
                          foldGutter: true,
                          highlightActiveLine: false,
                        }}
                        className="h-full text-xs"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center p-4">
                        <p className="text-sm italic text-muted-foreground">
                          {selected.size === 0
                            ? "Pick at least one table to preview the INSERT script."
                            : "Generating…"}
                        </p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!result?.sql}
          >
            <Copy className="size-3.5" />
            Copy SQL
          </Button>
          <Button
            onClick={handleRun}
            disabled={!result?.sql || isRunning || isGenerating}
          >
            {isRunning ? <Spinner className="size-3.5" /> : <Sparkles className="size-3.5" />}
            Run insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlaygroundSeedDialog;
