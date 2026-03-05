import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, Github, MessageCircle } from "lucide-react";
import { Link } from "react-router";
import HeaderThemeToggle from "./header-theme-toggle";
import { NAV_LINKS, isNavLinkRoute } from "./constants";

const Header = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 h-20 flex items-center gap-4">
        <div className="flex items-center gap-2 min-w-[220px]">
          <img src={logo} alt="UNI-SQL logo" className="h-10 w-auto" />
          <p className="text-[34px] sm:text-[42px] md:text-[52px] leading-none font-black tracking-tight text-primary">
            UNI-SQL
          </p>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {NAV_LINKS.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <NavigationMenuLink
                    asChild
                    className={navigationMenuTriggerStyle()}
                  >
                    {isNavLinkRoute(item) ? (
                      <Link to={item.to}>{item.label}</Link>
                    ) : (
                      <a href={item.href}>{item.label}</a>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <HeaderThemeToggle />
          <Button variant="ghost" size="icon" className="rounded-full">
            <Github className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-xl font-semibold"
          >
            X
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MessageCircle className="size-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-10">
              <nav className="flex flex-col gap-4 text-lg font-semibold ml-4">
                {NAV_LINKS.map((item) =>
                  isNavLinkRoute(item) ? (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="hover:text-primary transition-colors py-1"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.label}
                      href={item.href}
                      className="hover:text-primary transition-colors py-1"
                    >
                      {item.label}
                    </a>
                  )
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
