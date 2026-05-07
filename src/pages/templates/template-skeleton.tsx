import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function TemplateSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden pt-0">
          <Skeleton className="aspect-video w-full rounded-none" />
          <CardHeader>
            <Skeleton className="mb-2 h-5 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                <Skeleton className="size-3 rounded-sm" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton className="size-6 rounded-full" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
