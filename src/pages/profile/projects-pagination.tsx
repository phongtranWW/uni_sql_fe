import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ProjectsPaginationProps {
  totalPages: number;
  fetchPage: number;
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  onPrev: () => void;
  onNext: () => void;
}

export function ProjectsPagination({
  totalPages,
  fetchPage,
  fetchStatus,
  onPrev,
  onNext,
}: ProjectsPaginationProps) {
  if (fetchStatus === "failed") return null;
  const safeTotalPages = Math.max(1, totalPages);
  const pageLabel = `${fetchPage}/${safeTotalPages}`;
  const busy = fetchStatus === "loading";
  return (
    <div className="flex border-t border-border pt-4 justify-end">
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2"
          disabled={fetchPage <= 1 || busy}
          onClick={onPrev}
        >
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <span className="min-w-[3rem] px-2 text-center text-sm tabular-nums text-muted-foreground">
          {pageLabel}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 px-2"
          disabled={fetchPage >= safeTotalPages || busy}
          onClick={onNext}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
