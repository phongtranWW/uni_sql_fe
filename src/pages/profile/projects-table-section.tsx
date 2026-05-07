import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import type { ProjectSummary } from "@/features/project/schemas/project.schema";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export interface ProjectsTableSectionProps {
  items: ProjectSummary[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  onDeleteRequest: (id: string) => void;
  isShared?: boolean;
}

export function ProjectsTableSection({
  items,
  fetchStatus,
  onDeleteRequest,
  isShared,
}: ProjectsTableSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {fetchStatus === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/60 backdrop-blur-[1px]">
          <Spinner className="size-8" />
        </div>
      )}
      {fetchStatus === "failed" ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Could not load projects.
          </p>
        </div>
      ) : items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No projects yet, or no results match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((row) => (
            <Card key={row.id}>
              <CardHeader>
                <CardTitle className="truncate" title={row.name}>
                  {row.name}
                </CardTitle>
                <CardDescription>
                  Created: {dateFmt.format(new Date(row.createdAt))}
                </CardDescription>
                <CardAction>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      title="Open in editor"
                      onClick={() => navigate(`/editor/projects/${row.id}`)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    {!isShared && (
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        title="Delete project"
                        onClick={() => onDeleteRequest(row.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </CardAction>
              </CardHeader>
              <CardFooter className="text-xs text-muted-foreground">
                Updated {formatDistanceToNow(new Date(row.updatedAt), { addSuffix: true })}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
