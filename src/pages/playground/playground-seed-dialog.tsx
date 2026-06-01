import { useCallback, useEffect, useState } from "react";
import { Copy, Minus, Plus, Sparkles } from "lucide-react";
import CodeMirror from "@uiw/react-codemirror";
import { sql, PostgreSQL } from "@codemirror/lang-sql";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { UseSqlEngineResult } from "@/hooks/use-sql-engine";
import PlaygroundSeedColumnRow from "./playground-seed-column-row";
import type { ColumnConfig } from "@/lib/fake-data/faker-options";
import { getDefaultFakerOption } from "@/lib/fake-data/faker-options";
import { generateSingleTableInserts } from "@/lib/fake-data/single-table-generator";

interface PlaygroundSeedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  engine: UseSqlEngineResult;
}

const DEFAULT_ROW_COUNT = 10;

/**
 * Dialog for generating fake INSERT statements for a single table at a time.
 * Uses tabs to switch between tables, and allows per-column configuration.
 */
const PlaygroundSeedDialog = ({
  open,
  onOpenChange,
  engine,
}: PlaygroundSeedDialogProps) => {
  const { resolvedTheme } = useTheme();

  const [activeTable, setActiveTable] = useState<string>("");
  const [rowCount, setRowCount] = useState(DEFAULT_ROW_COUNT);
  const [columnConfigs, setColumnConfigs] = useState<Map<string, ColumnConfig>>(
    new Map(),
  );
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set(),
  );
  const [seed, setSeed] = useState<number>(() =>
    Math.floor(Math.random() * 1e9),
  );

  const [sqlPreview, setSqlPreview] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Initialize active table and column configs when dialog opens
  useEffect(() => {
    if (!open) return;
    if (engine.schema.length === 0) return;

    const firstTable = engine.schema[0].name;
    setActiveTable(firstTable);
    setSeed(Math.floor(Math.random() * 1e9));
    setRowCount(DEFAULT_ROW_COUNT);

    // Initialize default configs for first table
    const table = engine.schema.find((t) => t.name === firstTable);
    if (table) {
      const configs = new Map<string, ColumnConfig>();
      const selected = new Set<string>();
      for (const col of table.columns) {
        const defaultFakerId = getDefaultFakerOption(col.dataType);
        configs.set(col.name, {
          mode: defaultFakerId === "default" ? "default" : "faker",
          fakerId: defaultFakerId !== "default" ? defaultFakerId : undefined,
          defaultValue: defaultFakerId === "default" ? "" : undefined,
        });
        // Select all columns by default except identity columns
        if (!col.isIdentity) {
          selected.add(col.name);
        }
      }
      setColumnConfigs(configs);
      setSelectedColumns(selected);
    }
  }, [open, engine.schema]);

  // Switch table: reset configs for new table
  const handleTableChange = useCallback(
    (tableName: string) => {
      setActiveTable(tableName);
      const table = engine.schema.find((t) => t.name === tableName);
      if (table) {
        const configs = new Map<string, ColumnConfig>();
        const selected = new Set<string>();
        for (const col of table.columns) {
          const defaultFakerId = getDefaultFakerOption(col.dataType);
          configs.set(col.name, {
            mode: defaultFakerId === "default" ? "default" : "faker",
            fakerId:
              defaultFakerId !== "default" ? defaultFakerId : undefined,
            defaultValue: defaultFakerId === "default" ? "" : undefined,
          });
          // Select all columns by default except identity columns
          if (!col.isIdentity) {
            selected.add(col.name);
          }
        }
        setColumnConfigs(configs);
        setSelectedColumns(selected);
      }
    },
    [engine.schema],
  );

  // Generate SQL preview whenever config changes
  useEffect(() => {
    if (!open || !activeTable) return;

    const table = engine.schema.find((t) => t.name === activeTable);
    if (!table) return;

    let cancelled = false;
    const timer = setTimeout(() => {
      setIsGenerating(true);
      try {
        // Filter configs to only include selected columns
        const filteredConfigs = new Map<string, ColumnConfig>();
        for (const [colName, config] of columnConfigs.entries()) {
          if (selectedColumns.has(colName)) {
            filteredConfigs.set(colName, config);
          }
        }

        const result = generateSingleTableInserts(
          table,
          rowCount,
          filteredConfigs,
          seed,
        );
        if (!cancelled) {
          setSqlPreview(result.sql);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          toast.error(
            err instanceof Error
              ? `Failed to generate: ${err.message}`
              : "Failed to generate data",
          );
          setSqlPreview("");
        }
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [
    open,
    activeTable,
    rowCount,
    columnConfigs,
    selectedColumns,
    seed,
    engine.schema,
  ]);

  const handleColumnConfigChange = useCallback(
    (columnName: string, config: ColumnConfig) => {
      setColumnConfigs((prev) => {
        const next = new Map(prev);
        next.set(columnName, config);
        return next;
      });
    },
    [],
  );

  const handleColumnSelectionChange = useCallback(
    (columnName: string, selected: boolean) => {
      setSelectedColumns((prev) => {
        const next = new Set(prev);
        if (selected) {
          next.add(columnName);
        } else {
          next.delete(columnName);
        }
        return next;
      });
    },
    [],
  );

  const handleCopy = async () => {
    if (!sqlPreview) return;
    try {
      await navigator.clipboard.writeText(sqlPreview);
      toast.success("SQL copied to clipboard.");
    } catch {
      toast.error("Failed to copy.");
    }
  };

  const handleRun = async () => {
    if (!sqlPreview) return;
    setIsRunning(true);
    try {
      const r = await engine.runScript(sqlPreview);
      toast.success(
        `Inserted ${rowCount} row${rowCount === 1 ? "" : "s"} into ${activeTable} · ${r.durationMs}ms.`,
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

  const currentTable = engine.schema.find((t) => t.name === activeTable);
  const noTables = engine.schema.length === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex flex-col gap-3 p-0 overflow-hidden"
        style={{
          width: "90vw",
          maxWidth: "90vw",
          height: "90vh",
          maxHeight: "90vh",
        }}
      >
        <div className="px-4 py-3 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-amber-500" />
            Generate fake data
          </DialogTitle>
          <DialogDescription>
            Configure each column to use a faker function or a default value.
          </DialogDescription>
        </div>

        {noTables ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm italic text-muted-foreground">
              No tables in the database yet.
            </p>
          </div>
        ) : (
          <Tabs
            value={activeTable}
            onValueChange={handleTableChange}
            className="flex flex-1 min-h-0 flex-col"
          >
            {/* Toolbar: tabs + row count on same line */}
            <div className="flex items-center gap-3 px-4 py-2 border-b shrink-0">
              <div className="min-w-0 flex-1">
                <div className="overflow-x-auto overflow-y-hidden">
                  <TabsList className="w-auto">
                    {engine.schema.map((t) => (
                      <TabsTrigger key={t.name} value={t.name} className="text-xs shrink-0">
                        {t.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs font-medium text-muted-foreground">Rows:</span>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setRowCount(Math.max(1, rowCount - 10))}
                >
                  <Minus className="size-3" />
                </Button>
                <Badge variant="secondary" className="font-mono text-sm w-12 justify-center">
                  {rowCount}
                </Badge>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="h-7 w-7"
                  onClick={() => setRowCount(Math.min(1000, rowCount + 10))}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>

            {engine.schema.map((table) => (
              <TabsContent
                key={table.name}
                value={table.name}
                className="flex flex-1 min-h-0 mt-0 px-4 pb-4"
              >
                <div className="grid min-h-0 flex-1 grid-cols-[420px_1fr] gap-4">
                  {/* Left: column configuration */}
                  <div className="flex min-h-0 flex-col gap-2 overflow-hidden">
                    <div className="flex items-center justify-between px-1 shrink-0">
                      <span className="text-xs font-medium text-muted-foreground">
                        {selectedColumns.size} of {currentTable?.columns.length ?? 0} columns selected
                      </span>
                    </div>

                    <div className="flex-1 min-h-0 rounded-lg border border-border bg-muted/20 overflow-hidden">
                      <ScrollArea className="h-full" type="always">
                        <div className="p-3 space-y-2 pr-4">
                          {currentTable?.columns.map((col) => {
                            const defaultFakerId = getDefaultFakerOption(
                              col.dataType,
                            );
                            const defaultConfig: ColumnConfig =
                              defaultFakerId === "default"
                                ? { mode: "default", defaultValue: "" }
                                : { mode: "faker", fakerId: defaultFakerId };

                            return (
                              <PlaygroundSeedColumnRow
                                key={col.name}
                                column={col}
                                selected={selectedColumns.has(col.name)}
                                config={
                                  columnConfigs.get(col.name) ?? defaultConfig
                                }
                                onSelectedChange={(sel) =>
                                  handleColumnSelectionChange(col.name, sel)
                                }
                                onConfigChange={(cfg) =>
                                  handleColumnConfigChange(col.name, cfg)
                                }
                              />
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>

                  {/* Right: SQL preview */}
                  <div className="flex min-h-0 flex-col gap-2">
                    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">SQL Preview</span>
                        {isGenerating && <Spinner className="size-3.5" />}
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {sqlPreview.split('\n').length} lines
                      </Badge>
                    </div>
                    <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border shadow-sm">
                      {sqlPreview ? (
                        <CodeMirror
                          value={sqlPreview}
                          height="100%"
                          extensions={[sql({ dialect: PostgreSQL })]}
                          theme={
                            resolvedTheme === "dark" ? githubDark : githubLight
                          }
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
                          <div className="flex flex-col items-center gap-2">
                            <Spinner className="size-5" />
                            <p className="text-sm text-muted-foreground">
                              Generating SQL...
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        <div className="px-4 py-3 border-t shrink-0">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              disabled={!sqlPreview}
            >
              <Copy className="size-3.5" />
              Copy SQL
            </Button>
            <Button
              onClick={handleRun}
              disabled={!sqlPreview || isRunning || isGenerating}
            >
              {isRunning ? (
                <Spinner className="size-3.5" />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              Run insert
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaygroundSeedDialog;
