import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { ProjectGetManyParams } from "@/services/project/params";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Plus,
  Search,
} from "lucide-react";

interface ContentProjectToolbarProps {
  params: ProjectGetManyParams;
  total: number;
  onParamsChange: React.Dispatch<React.SetStateAction<ProjectGetManyParams>>;
}

const ContentProjectToolbar = ({
  params,
  total,
  onParamsChange,
}: ContentProjectToolbarProps) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamsChange((prev) => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleSort = (column: "name" | "createdAt" | "updatedAt") => {
    onParamsChange((prev) => ({
      ...prev,
      sortBy: column,
      sortOrder:
        prev.sortBy === column && prev.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    }));
  };

  return (
    <div className="flex items-center justify-between py-2 px-6">
      <div className="flex items-center gap-2">
        <InputGroup className="max-w-xs">
          <InputGroupInput
            placeholder="Search..."
            onChange={handleSearchChange}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">{total} projects</InputGroupAddon>
        </InputGroup>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ArrowUpDown />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Sort by
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(
              [
                { key: "name", label: "Name" },
                { key: "createdAt", label: "Created At" },
                { key: "updatedAt", label: "Updated At" },
              ] as const
            ).map(({ key, label }) => (
              <DropdownMenuItem
                key={key}
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleSort(key)}
              >
                <span>{label}</span>
                {params.sortBy === key &&
                  (params.sortOrder === "asc" ? (
                    <ArrowUp className="text-primary" />
                  ) : (
                    <ArrowDown className="text-primary" />
                  ))}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Order
            </DropdownMenuLabel>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() =>
                onParamsChange((prev) => ({ ...prev, sortOrder: "asc" }))
              }
            >
              <ArrowUp className="h-3.5 w-3.5" />
              Ascending
              {params.sortOrder === "asc" && (
                <Check className="h-3.5 w-3.5 ml-auto text-primary" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={() =>
                onParamsChange((prev) => ({ ...prev, sortOrder: "desc" }))
              }
            >
              <ArrowDown className="h-3.5 w-3.5" />
              Descending
              {params.sortOrder === "desc" && (
                <Check className="h-3.5 w-3.5 ml-auto text-primary" />
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Button>
        <Plus />
        New Project
      </Button>
    </div>
  );
};

export default ContentProjectToolbar;
