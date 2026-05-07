
import { useAppSelector } from "@/app/hook";
import type { ProfileProjectsHandle } from "../../hooks/use-profile-projects";
import { ProjectsToolbar } from "./projects-toolbar";
import { ProjectsTableSection } from "./projects-table-section";
import { ProjectsPagination } from "./projects-pagination";

export interface ProjectsPanelProps {
  projects: ProfileProjectsHandle;
}

export function ProjectsPanel({ projects }: ProjectsPanelProps) {
  const {
    items,
    totalPages,
    fetchStatus,
  } = useAppSelector((s) => s.projects);

  const {
    searchInput,
    setSearchInput,
    sortBy,
    setSortByAndResetPage,
    sortOrder,
    setSortOrderAndResetPage,
    fetchPage,
    setFetchPage,
    setDeleteTargetId,
  } = projects;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col p-6">
      <div className="flex flex-col gap-4">
        <ProjectsToolbar
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          sortBy={sortBy}
          onSortByChange={setSortByAndResetPage}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrderAndResetPage}
        />
        <ProjectsTableSection
          items={items}
          fetchStatus={fetchStatus}
          onDeleteRequest={setDeleteTargetId}
          onRevokeShare={projects.revokeShare}
          isShared={projects.tab === "shared-with-me"}
        />
        <ProjectsPagination
          totalPages={totalPages}
          fetchPage={fetchPage}
          fetchStatus={fetchStatus}
          onPageChange={setFetchPage}
        />
      </div>
    </div>
  );
}
