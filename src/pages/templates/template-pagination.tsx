import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

interface TemplatePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TemplatePagination({
  page,
  totalPages,
  onPageChange,
}: TemplatePaginationProps) {
  return (
    <Pagination className="mt-12">
      <PaginationContent>
        {[...Array(totalPages)].map((_, i) => {
          const p = i + 1;
          return (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(p);
                }}
                isActive={page === p}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
}
