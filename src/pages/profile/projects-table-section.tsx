import { Pencil, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router";
import type { ProjectSummary } from "@/features/project/schemas/project.schema";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export interface ProjectsTableSectionProps {
  items: ProjectSummary[];
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  onDeleteRequest: (id: string) => void;
  onRevokeShare?: (projectId: string, userId: string) => void;
  isShared?: boolean;
}

export function ProjectsTableSection({
  items,
  fetchStatus,
  onDeleteRequest,
  onRevokeShare,
  isShared,
}: ProjectsTableSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden">
      {fetchStatus === "loading" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md bg-background/60 backdrop-blur-[1px]">
          <Spinner className="size-8" />
        </div>
      )}
      {fetchStatus === "failed" ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            Could not load projects.
          </p>
        </div>
      ) : items.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No projects yet, or no results match your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {items.map((row) => (
            <Card key={row.id}>
              <CardHeader>
                <CardTitle className="truncate" title={row.name}>
                  {row.name}
                </CardTitle>
                <CardDescription>
                  Created: {dateFmt.format(new Date(row.createdAt))}
                </CardDescription>
                <CardAction>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="ghost"
                      title={isShared ? "Open viewer" : "Open in editor"}
                      onClick={() =>
                        navigate(
                          isShared
                            ? `/shared/projects/${row.id}`
                            : `/editor/projects/${row.id}`,
                        )
                      }
                    >
                      <Pencil className="size-4" />
                    </Button>
                    {!isShared && (
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        title="Delete project"
                        onClick={() => onDeleteRequest(row.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </CardAction>
              </CardHeader>
              <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Updated{" "}
                  {formatDistanceToNow(new Date(row.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
                {row.sharedUsers &&
                  row.sharedUsers.length > 0 &&
                  (isShared ? (
                    <AvatarGroup>
                      {row.sharedUsers.slice(0, 3).map((user) => (
                        <Tooltip key={user.id}>
                          <TooltipTrigger asChild>
                            <Avatar size="sm">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name?.charAt(0).toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            {user.name || "Unknown User"}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                      {row.sharedUsers.length > 3 && (
                        <AvatarGroupCount>
                          +{row.sharedUsers.length - 3}
                        </AvatarGroupCount>
                      )}
                    </AvatarGroup>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-full outline-hidden ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <AvatarGroup className="cursor-pointer">
                            {row.sharedUsers.slice(0, 3).map((user) => (
                              <Tooltip key={user.id}>
                                <TooltipTrigger asChild>
                                  <Avatar size="sm">
                                    <AvatarImage
                                      src={user.avatar}
                                      alt={user.name}
                                    />
                                    <AvatarFallback>
                                      {user.name?.charAt(0).toUpperCase() ||
                                        "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {user.name || "Unknown User"}
                                </TooltipContent>
                              </Tooltip>
                            ))}
                            {row.sharedUsers.length > 3 && (
                              <AvatarGroupCount>
                                +{row.sharedUsers.length - 3}
                              </AvatarGroupCount>
                            )}
                          </AvatarGroup>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Shared Users</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {row.sharedUsers.map((user) => (
                          <DropdownMenuItem
                            key={user.id}
                            className="group/item flex items-center justify-between"
                            onSelect={() => undefined}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Avatar size="sm" className="size-6">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>
                                  {user.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="truncate text-sm">
                                {user.name || "Unknown User"}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="size-6 opacity-0 transition-opacity hover:text-destructive group-hover/item:opacity-100 text-muted-foreground"
                              title="Revoke access"
                              onClick={(e) => {
                                e.stopPropagation(); // prevent triggering item select
                                onRevokeShare?.(row.id, user.id);
                              }}
                            >
                              <X className="size-3" />
                            </Button>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
