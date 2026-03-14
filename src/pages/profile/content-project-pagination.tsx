import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProjectGetManyParams } from "@/services/project/params";

interface ContentProjectPaginationProps {
  params: ProjectGetManyParams;
  onParamsChange: React.Dispatch<React.SetStateAction<ProjectGetManyParams>>;
}

const ContentProjectPagination = ({
  params,
  onParamsChange,
}: ContentProjectPaginationProps) => {
  return (
    <div className="shrink-0 px-6 py-3 border-t flex items-center justify-end">
      <div className="flex items-center gap-4">
        <Select
          value={params.limit.toString()}
          onValueChange={(value) =>
            onParamsChange((prev) => ({
              ...prev,
              limit: Number(value),
              page: 1,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
          </SelectContent>
        </Select>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() =>
                  onParamsChange((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  onParamsChange((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ContentProjectPagination;
