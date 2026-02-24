import logo from "@/assets/logo.png";
import HeaderMenubar from "./header-menubar";
import HeaderThemeToggle from "./header-theme-toggle";

const Header = () => {
  return (
    <header className="h-10 flex items-center border-b border-border bg-background text-foreground px-6">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-6 w-auto" />
        <HeaderMenubar />
      </div>

      <div className="ml-auto">
        <HeaderThemeToggle />
      </div>
    </header>
  );
};

export default Header;
