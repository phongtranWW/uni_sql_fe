import type { UseSqlEngineResult } from "@/hooks/use-sql-engine";
import PlaygroundEditor from "./playground-editor";
import PlaygroundResults from "./playground-results";
import PlaygroundSchemaPanel from "./playground-schema-panel";

interface PlaygroundWorkspaceLayoutProps {
  engine: UseSqlEngineResult;
}

const PlaygroundWorkspaceLayout = ({
  engine,
}: PlaygroundWorkspaceLayoutProps) => {
  return (
    <div className="flex h-full w-full">
      <div className="w-64 shrink-0 border-r">
        <PlaygroundSchemaPanel engine={engine} />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex-1">
          <PlaygroundEditor engine={engine} />
        </div>
        <div className="h-80 overflow-hidden">
          <PlaygroundResults />
        </div>
      </div>
    </div>
  );
};

export default PlaygroundWorkspaceLayout;
