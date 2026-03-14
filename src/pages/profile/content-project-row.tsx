import { TableCell, TableRow } from "@/components/ui/table";
import type { ProjectSummary } from "@/features/projects/schemas";
import { Copy, Database, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { formatDate, formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ContentProjectTableRowProps {
  project: ProjectSummary;
}

const ContentProjectRow = ({ project }: ContentProjectTableRowProps) => {
  return (
    <TableRow className="group cursor-pointer">
      <TableCell>
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Database className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-medium text-sm">{project.name}</span>
        </div>
      </TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {formatDate(project.createdAt, "MMM dd, yyyy")}
      </TableCell>

      <TableCell className="text-sm text-muted-foreground">
        {formatDistanceToNow(project.updatedAt, { addSuffix: true })}
      </TableCell>

      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Copy />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer text-destructive focus:text-destructive">
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default ContentProjectRow;
