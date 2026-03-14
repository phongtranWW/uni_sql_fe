import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Database, LayoutTemplate } from "lucide-react";

const ITEMS = [
  {
    title: "Projects",
    icon: Database,
    value: "projects",
  },
  {
    title: "Favorite Templates",
    icon: LayoutTemplate,
    value: "templates",
  },
];

interface SidebarNavMainProps {
  setActiveTab: (tab: string) => void;
}

const SidebarNavMain = ({ setActiveTab }: SidebarNavMainProps) => {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {ITEMS.map((item) => (
            <SidebarMenuItem
              key={item.title}
              onClick={() => setActiveTab(item.value)}
            >
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SidebarNavMain;
