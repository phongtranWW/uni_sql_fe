import { LayoutGrid } from "lucide-react";

interface TemplateEmptyProps {
  searchTerm: string;
}

export function TemplateEmpty({ searchTerm }: TemplateEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-32 text-center bg-muted/10 mt-8">
      <LayoutGrid className="size-12 text-muted-foreground/30 mb-4" />
      <h3 className="text-xl font-semibold text-foreground">No templates found</h3>
      <p className="mt-2 text-muted-foreground max-w-sm">
        {searchTerm
          ? `We couldn't find any templates matching "${searchTerm}". Try adjusting your search.`
          : "There are currently no templates available."}
      </p>
    </div>
  );
}