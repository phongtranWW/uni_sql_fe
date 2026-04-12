import { FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProfileSidebar() {
  return (
    <aside
      className={cn(
        "flex w-60 shrink-0 flex-col border-r border-sidebar-border",
        "bg-sidebar text-sidebar-foreground",
      )}
    >
      <nav className="flex flex-col gap-0.5 p-3" aria-label="Profile">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
            "bg-sidebar-accent text-sidebar-accent-foreground",
          )}
        >
          <FolderKanban className="size-4 shrink-0 opacity-90" />
          My Projects
        </div>
      </nav>
    </aside>
  );
}
