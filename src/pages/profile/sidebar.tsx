import logo from "@/assets/logo.png";
import {
  Sidebar as SidebarShadcn,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenu,
} from "@/components/ui/sidebar";
import SidebarUser from "./sidebar-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarNavMain from "./sidebar-nav-main";
import { useNavigate } from "react-router";

interface SidebarProps {
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ setActiveTab }: SidebarProps) => {
  const navigate = useNavigate();

  return (
    <SidebarShadcn collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem onClick={() => navigate("/")}>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Avatar className="h-8 w-8 rounded-none" size="sm">
                <AvatarImage src={logo} alt="Logo" />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <span className="text-base font-semibold">Uni SQL</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavMain setActiveTab={setActiveTab} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
      <SidebarRail />
    </SidebarShadcn>
  );
};

export default Sidebar;
