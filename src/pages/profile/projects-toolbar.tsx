import { Search, SlidersHorizontal } from "lucide-react";
import type { ProjectGetManyParams } from "@/features/project/services/project.service";
import { Input } from "@/components/ui/input";
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
  const handleSortChange = (value: string) => {
    const [by, order] = value.split("-");
    onSortByChange(by as ProjectGetManyParams["sortBy"]);
    onSortOrderChange(order as ProjectGetManyParams["sortOrder"]);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-9"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select
        value={`${sortBy}-${sortOrder}`}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
          <SelectItem value="updatedAt-asc">Oldest Updated</SelectItem>
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
