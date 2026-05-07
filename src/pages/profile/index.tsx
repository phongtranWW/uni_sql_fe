import { ProfileSidebar } from "./profile-sidebar";
import { MainNavbar } from "@/components/custom/main-navbar";
import { ProjectsPanel } from "./projects-panel";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { useProfileProjects } from "../../hooks/use-profile-projects";

export const Profile = () => {
  const projects = useProfileProjects();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MainNavbar />
      <div className="flex min-h-0 flex-1 pt-16">
        <ProfileSidebar projects={projects} />
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-background">
          <ProjectsPanel projects={projects} />
        </div>
      </div>
      <DeleteProjectDialog
        open={!!projects.deleteTargetId}
        deleting={projects.deleting}
        onOpenChange={(open) => {
          if (!open && !projects.deleting) projects.setDeleteTargetId(null);
        }}
        onConfirm={projects.confirmDelete}
      />
    </div>
  );
};

export default Profile;
