import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import logo from "@/assets/logo.png";
import HeaderMenubar from "./header-menubar";
import HeaderProjectStatus from "./header-project-status";
import HeaderThemeToggle from "./header-theme-toggle";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="h-10 flex items-center border-b border-border bg-background text-foreground px-6">
      <div className="flex items-center gap-2">
        <Avatar
          className="h-6 w-6 cursor-pointer rounded-none"
          onClick={() => navigate("/")}
        >
          <AvatarImage src={logo} alt="Logo" />
          <AvatarFallback>DB</AvatarFallback>
        </Avatar>
        <HeaderMenubar />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <HeaderProjectStatus />
        <HeaderThemeToggle />
      </div>
    </header>
  );
};

export default Header;
