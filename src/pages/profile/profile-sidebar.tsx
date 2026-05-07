import { FolderKanban, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProfileProjectsHandle } from "../../hooks/use-profile-projects";

export interface ProfileSidebarProps {
  projects: ProfileProjectsHandle;
}

export function ProfileSidebar({ projects }: ProfileSidebarProps) {
  const { tab, setTab } = projects;

  return (
    <aside
      className={cn(
        "flex w-60 shrink-0 flex-col border-r border-sidebar-border",
        "bg-sidebar text-sidebar-foreground",
      )}
    >
      <nav className="flex flex-col gap-0.5 p-3" aria-label="Profile">
        <button
          type="button"
          onClick={() => setTab("my-projects")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
            tab === "my-projects"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <FolderKanban className="size-4 shrink-0 opacity-90" />
          My Projects
        </button>
        <button
          type="button"
          onClick={() => setTab("shared-with-me")}
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left",
            tab === "shared-with-me"
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
          )}
        >
          <Users className="size-4 shrink-0 opacity-90" />
          Shared with me
        </button>
      </nav>
    </aside>
  );
}
