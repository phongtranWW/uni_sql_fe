import { useState } from "react";
import { ChevronDown } from "lucide-react";
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
import { Button } from "@/components/ui/button";
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
  const [expanded, setExpanded] = useState(true);

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

  return (
    <div className="rounded-md border border-border bg-muted/10">
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="flex w-full items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted/40"
      >
        <Checkbox
          checked={selected}
          onCheckedChange={(checked) => {
            onSelectedChange(checked === true);
          }}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0"
        />
        <ChevronDown
          className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${expanded ? "" : "-rotate-90"}`}
        />
        <span className="flex-1 font-mono text-xs font-medium">{column.name}</span>
        <span className="text-xs text-muted-foreground">{column.dataType}</span>
        {column.hasDefault && (
          <span className="text-[10px] text-amber-600 dark:text-amber-400">HAS DEFAULT</span>
        )}
      </button>

      {expanded && (
        <div className="border-t border-border bg-muted/20 p-2 space-y-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={isFakerMode ? "default" : "outline"}
              onClick={handleModeToggle}
              className="flex-1 text-xs"
            >
              Faker
            </Button>
            <Button
              type="button"
              size="sm"
              variant={!isFakerMode ? "default" : "outline"}
              onClick={handleModeToggle}
              className="flex-1 text-xs"
            >
              Default
            </Button>
          </div>

          {isFakerMode ? (
            <div className="space-y-1">
              <Label className="text-xs">Faker function</Label>
              {hasFakerOptions ? (
                <Select value={config.fakerId} onValueChange={handleFakerChange}>
                  <SelectTrigger className="h-8 text-xs w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fakerOptions.map(opt => (
                      <SelectItem key={opt.id} value={opt.id} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No faker options available for this type
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <Label className="text-xs">Default value</Label>
              <Input
                type="text"
                value={config.defaultValue ?? ""}
                onChange={(e) => handleDefaultChange(e.target.value)}
                placeholder="Enter default value"
                className="h-8 text-xs w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaygroundSeedColumnRow;
