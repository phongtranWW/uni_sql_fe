import { useEffect, useState } from "react";
import { TemplateDetailDialog } from "./template-detail-dialog";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { fetchTemplates } from "@/features/template/thunks";
import {
  selectSummaryTemplate,
  selectSummaryTemplateStatus,
  selectSummaryTemplateError,
} from "@/features/template/selectors";

import { MainNavbar } from "@/components/custom/main-navbar";
import { MainFooter } from "@/components/custom/main-footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { TemplateHeader } from "./template-header";
import { TemplateFilters } from "./template-filters";
import { TemplateSkeleton } from "./template-skeleton";
import { TemplateEmpty } from "./template-empty";
import { TemplateCard } from "./template-card";
import { TemplatePagination } from "./template-pagination";

export default function TemplatesPage() {
  const dispatch = useAppDispatch();
  const templateData = useAppSelector(selectSummaryTemplate);
  const status = useAppSelector(selectSummaryTemplateStatus);
  const error = useAppSelector(selectSummaryTemplateError);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "updatedAt">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== searchTerm) setPage(1);
        return searchTerm;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(
      fetchTemplates({
        search: debouncedSearch || undefined,
        page,
        limit: 8,
        sortBy,
        sortOrder,
      }),
    );
  }, [dispatch, debouncedSearch, page, sortBy, sortOrder]);

  const templates = templateData?.data ?? [];
  const totalPages = templateData?.totalPages ?? 1;

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-") as [
      "createdAt" | "name" | "updatedAt",
      "asc" | "desc",
    ];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MainNavbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <TemplateHeader />
            <TemplateFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>

          {status === "loading" && <TemplateSkeleton />}

          {status === "failed" && (
            <Alert variant="destructive" className="my-8">
              <AlertCircle className="size-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error || "Failed to load templates. Please try again later."}
              </AlertDescription>
            </Alert>
          )}

          {status === "succeeded" && templates.length === 0 && (
            <TemplateEmpty searchTerm={searchTerm} />
          )}

          {status === "succeeded" && templates.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onClick={setSelectedTemplateId}
                />
              ))}
            </div>
          )}

          {status === "succeeded" && totalPages > 1 && (
            <TemplatePagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </main>

      <MainFooter />

      <TemplateDetailDialog
        templateId={selectedTemplateId}
        open={selectedTemplateId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedTemplateId(null);
        }}
      />
    </div>
  );
}
