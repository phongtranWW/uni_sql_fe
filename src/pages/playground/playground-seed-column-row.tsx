import { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { SchemaColumn } from "@/lib/sql-engine";
import type { ColumnConfig } from "@/lib/fake-data/faker-options";
import { FAKER_OPTIONS_BY_TYPE } from "@/lib/fake-data/faker-options";

interface PlaygroundSeedColumnRowProps {
  column: SchemaColumn;
  selected: boolean;
  config: ColumnConfig;
  onSelectedChange: (selected: boolean) => void;
  onConfigChange: (config: ColumnConfig) => void;
}

const PlaygroundSeedColumnRow = ({
  column,
  selected,
  config,
  onSelectedChange,
  onConfigChange,
}: PlaygroundSeedColumnRowProps) => {
  const [expanded, setExpanded] = useState(false);

  const fakerOptions = FAKER_OPTIONS_BY_TYPE[column.dataType.toLowerCase()] ?? [];
  const isFakerMode = config.mode === "faker";
  const hasFakerOptions = fakerOptions.length > 0;

  const handleModeToggle = () => {
    if (isFakerMode) {
      onConfigChange({ mode: "default", defaultValue: "" });
    } else {
      onConfigChange({
        mode: "faker",
        fakerId: hasFakerOptions ? fakerOptions[0].id : "default",
      });
    }
  };

  const handleFakerChange = (fakerId: string) => {
    onConfigChange({ mode: "faker", fakerId });
  };

  const handleDefaultChange = (value: string) => {
    onConfigChange({ mode: "default", defaultValue: value });
  };

  const currentFakerOption = isFakerMode && config.fakerId
    ? fakerOptions.find(opt => opt.id === config.fakerId)
    : null;

  return (
    <Collapsible open={expanded} onOpenChange={setExpanded}>
      <div className="rounded-lg border border-border bg-card transition-colors hover:border-primary/30 overflow-hidden">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
          >
            <Checkbox
              checked={selected}
              onCheckedChange={(checked) => {
                onSelectedChange(checked === true);
              }}
              onClick={(e) => e.stopPropagation()}
              className="shrink-0"
              disabled={column.isIdentity}
            />
            <ChevronRight
              className={`size-4 shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-90" : ""}`}
            />
            <div className="flex flex-1 items-center gap-2 min-w-0">
              <span className="font-mono text-sm font-medium truncate">{column.name}</span>
              <Badge variant="outline" className="text-[10px] shrink-0">
                {column.dataType}
              </Badge>
            </div>
            {column.isIdentity && (
              <Badge variant="secondary" className="text-[10px] shrink-0">
                AUTO
              </Badge>
            )}
            {column.hasDefault && !column.isIdentity && (
              <Badge variant="secondary" className="text-[10px] shrink-0 bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20">
                DEFAULT
              </Badge>
            )}
            {isFakerMode && currentFakerOption && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Sparkles className="size-3" />
                <span className="hidden sm:inline truncate max-w-[100px]">{currentFakerOption.label}</span>
              </div>
            )}
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden">
          <div className="border-t border-border bg-muted/30 p-3 space-y-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleModeToggle}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                  isFakerMode
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  Faker
                </div>
              </button>
              <button
                type="button"
                onClick={handleModeToggle}
                className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                  !isFakerMode
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                }`}
              >
                Default Value
              </button>
            </div>

            {isFakerMode ? (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Faker Function</Label>
                {hasFakerOptions ? (
                  <Select value={config.fakerId} onValueChange={handleFakerChange}>
                    <SelectTrigger className="h-9 text-xs w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fakerOptions.map(opt => (
                        <SelectItem key={opt.id} value={opt.id} className="text-xs">
                          <div className="flex items-center gap-2">
                            <Sparkles className="size-3 text-primary" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-xs text-muted-foreground italic px-2 py-1.5 bg-muted/50 rounded-md">
                    No faker options available for this type
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Default Value</Label>
                <Input
                  type="text"
                  value={config.defaultValue ?? ""}
                  onChange={(e) => handleDefaultChange(e.target.value)}
                  placeholder="Enter default value or leave empty"
                  className="h-9 text-xs w-full"
                />
                <p className="text-[10px] text-muted-foreground">
                  Use SQL syntax (e.g., 'text', 42, NOW(), NULL)
                </p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default PlaygroundSeedColumnRow;
