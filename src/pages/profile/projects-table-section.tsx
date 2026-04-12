import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import type { ProjectSummary } from "@/features/project/schemas/project.schema";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export interface ProjectsTableSectionProps {
  items: ProjectSummary[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  onDeleteRequest: (id: string) => void;
}

export function ProjectsTableSection({
  items,
  fetchStatus,
  onDeleteRequest,
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Updated</TableHead>
              <TableHead className="w-[140px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {dateFmt.format(new Date(row.createdAt))}
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {formatDistanceToNow(new Date(row.updatedAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      title="Open in editor"
                      onClick={() => navigate(`/editor/projects/${row.id}`)}
                    >
                      <Pencil className="size-4" />
                    </Button>
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
