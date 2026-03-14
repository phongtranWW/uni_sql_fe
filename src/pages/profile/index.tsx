import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Sidebar from "./sidebar";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import ContentTabProject from "./content-tab-project";
import ContentTabTemplate from "./content-tab-template";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/custom/theme-toggle";

const LABELS = {
  projects: "Projects",
  templates: "Templates",
};

export const Profile = () => {
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <SidebarProvider>
      <Sidebar setActiveTab={setActiveTab} />
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col flex-1 min-w-0"
      >
        <SidebarInset>
          <div className="flex flex-col h-full">
            <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-4"
                />
                <span className="text-base font-semibold">
                  {LABELS[activeTab as keyof typeof LABELS]}
                </span>
              </div>
              <ThemeToggle />
            </header>
            <TabsContent value="projects">
              <ContentTabProject />
            </TabsContent>
            <TabsContent value="templates">
              <ContentTabTemplate />
            </TabsContent>
          </div>
        </SidebarInset>
      </Tabs>
    </SidebarProvider>
  );
};

export default Profile;
