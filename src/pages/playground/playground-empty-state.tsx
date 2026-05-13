import { useNavigate } from "react-router";
import { DatabaseZap } from "lucide-react";
import { Button } from "@/components/ui/button";

const PlaygroundEmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="rounded-full border border-border bg-muted/30 p-4">
        <DatabaseZap className="size-8 text-muted-foreground" />
      </div>
      <div className="max-w-md space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">No SQL to run</h1>
        <p className="text-sm text-muted-foreground">
          The playground boots a sandboxed PostgreSQL instance from a project's
          export. Open a project, choose{" "}
          <span className="font-medium">File → Export to → Postgres</span> and
          click <span className="font-medium">Test SQL</span> to land back here
          with your schema preloaded.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go back
        </Button>
        <Button onClick={() => navigate("/profile")}>Open my projects</Button>
      </div>
    </div>
  );
};

export default PlaygroundEmptyState;
