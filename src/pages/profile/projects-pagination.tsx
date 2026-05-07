import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export interface ProjectsPaginationProps {
  totalPages: number;
  fetchPage: number;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  onPageChange: (page: number) => void;
}

export function ProjectsPagination({
  totalPages,
  fetchPage,
  fetchStatus,
  onPageChange,
}: ProjectsPaginationProps) {
  if (fetchStatus === "failed" || totalPages <= 1) return null;
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {[...Array(safeTotalPages)].map((_, i) => {
          const p = i + 1;
          return (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (fetchStatus !== "loading") onPageChange(p);
                }}
                isActive={fetchPage === p}
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
