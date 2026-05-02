import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TemplateFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  sortOrder: string;
  onSortChange: (value: string) => void;
}

export function TemplateFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
}: TemplateFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select
        value={`${sortBy}-${sortOrder}`}
        onValueChange={onSortChange}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt-desc">Newest First</SelectItem>
          <SelectItem value="createdAt-asc">Oldest First</SelectItem>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}