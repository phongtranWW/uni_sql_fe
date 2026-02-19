import logo from "@/assets/logo.png";
import HeaderMenubar from "./header-menubar";

const Header = () => {
  return (
    <header className="h-10 flex gap-2 items-center border-b border-border bg-background text-foreground px-6">
      <img src={logo} alt="Logo" className="h-6 w-auto" />
      <HeaderMenubar />
    </header>
  );
};

export default Header;
