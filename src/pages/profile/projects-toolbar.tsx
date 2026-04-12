import type { ProjectGetManyParams } from "@/features/project/services/project.service";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ProjectsToolbarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  sortBy: ProjectGetManyParams["sortBy"];
  onSortByChange: (value: ProjectGetManyParams["sortBy"]) => void;
  sortOrder: ProjectGetManyParams["sortOrder"];
  onSortOrderChange: (value: ProjectGetManyParams["sortOrder"]) => void;
}

export function ProjectsToolbar({
  searchInput,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
}: ProjectsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
      <div className="grid w-full gap-2 sm:max-w-xs lg:max-w-md lg:flex-1">
        <Label htmlFor="project-search">Search by name</Label>
        <Input
          id="project-search"
          placeholder="Filter projects…"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-4">
        <div className="grid gap-2">
          <Label>Sort by</Label>
          <Select
            value={sortBy}
            onValueChange={(v) =>
              onSortByChange(v as ProjectGetManyParams["sortBy"])
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt">Last updated</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Order</Label>
          <Select
            value={sortOrder}
            onValueChange={(v) =>
              onSortOrderChange(v as ProjectGetManyParams["sortOrder"])
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
