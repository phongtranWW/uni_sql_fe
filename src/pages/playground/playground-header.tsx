import { ArrowLeft, Database } from "lucide-react";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePlayground } from "./playground-context";

const DIALECT_LABEL: Record<string, string> = {
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  sqlite: "SQLite",
};

const PlaygroundHeader = () => {
  const { seed, engine } = usePlayground();
  const navigate = useNavigate();

  const goBack = () => {
    if (seed.projectId) {
      navigate(`/editor/projects/${seed.projectId}`);
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-2">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          aria-label="Back to editor"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <div className="flex items-center gap-2 text-sm">
          <Database className="size-4 text-muted-foreground" />
          <span className="font-medium">SQL Playground</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">
            {seed.projectName ?? "Unsaved project"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="font-mono">
          {DIALECT_LABEL[seed.dialect] ?? seed.dialect}
        </Badge>
        {engine.status === "ready" && engine.bootDurationMs !== null && (
          <span>booted in {engine.bootDurationMs}ms</span>
        )}
        {engine.status === "initializing" && <span>initialising…</span>}
        {engine.status === "error" && (
          <span className="text-destructive">init failed</span>
        )}
      </div>
    </header>
  );
};

export default PlaygroundHeader;
