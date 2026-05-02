import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import type { TemplateSummary } from "@/features/template/schemas";

interface TemplateCardProps {
  template: TemplateSummary;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const imageUrl = template.image
    ? `${import.meta.env.VITE_URL_BACKEND}/${template.image}`
    : undefined;

  const formattedDate = new Date(template.createdAt).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );

  return (
    <Card className="flex flex-col overflow-hidden pt-0">
      <img
        src={imageUrl}
        alt={template.name}
        className="w-full aspect-video object-cover"
      />
      <CardHeader>
        <CardTitle className="line-clamp-1">{template.name}</CardTitle>
        <CardDescription className="line-clamp-3">
          {template.description || "No description provided."}
        </CardDescription>
        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="size-3" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-1.5">
            <Avatar className="size-6">
              <AvatarImage src={template.author?.avatar || ""} />
              <AvatarFallback className="text-[10px]">
                {template.author?.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {template.author?.name || "Unknown"}
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
