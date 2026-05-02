import { Link } from "react-router";
import { useAppSelector, useAppDispatch } from "@/app/hook";
import { selectAuthState } from "@/features/auth/selectors";
import { loginWithGoogle, logout } from "@/features/auth/thunks";
import {
  LogOut,
  User,
  ArrowRight,
  LayoutTemplate,
  House,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";
import ThemeToggle from "@/components/custom/theme-toggle";

export function HomeNavbar() {
  const { profile, status } = useAppSelector(selectAuthState);
  const dispatch = useAppDispatch();
  const isLoggedIn = !!profile;

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="UniSQL logo"
            className="size-9 rounded-lg object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-lg font-bold tracking-tight">UniSQL</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <House />
              Home
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/templates" className="text-muted-foreground hover:text-foreground">
              <LayoutTemplate />
              Templates
            </Link>
          </Button>
        </div>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          ) : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 px-2">
                  <Avatar size="sm">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>
                      {profile.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline-block">
                    {profile.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => dispatch(logout())}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={() => dispatch(loginWithGoogle())}
            >
              Login
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
