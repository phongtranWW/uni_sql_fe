import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import logo from "@/assets/logo.png";
import { Badge } from "@/components/ui/badge";
import { Lock, LogOut, User, LogIn } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { selectProject } from "@/features/project/selectors/project.selector";
import { useCallback, useEffect } from "react";
import { selectAuthState } from "@/features/auth/selectors";
import { handleAuthCallback, logout } from "@/features/auth/thunks";
import { authService } from "@/features/auth/service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggle from "@/components/custom/theme-toggle";
import { Button } from "@/components/ui/button";
import SharedHeaderMenubar from "./shared-header-menubar";

const SharedHeader = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const project = useAppSelector(selectProject);
  const { profile, status: authStatus } = useAppSelector(selectAuthState);
  const isLoggedIn = !!profile;

  const onAuthMessage = useCallback(
    (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "AUTH_CALLBACK" || !event.data?.token) return;
      dispatch(handleAuthCallback(event.data.token));
    },
    [dispatch],
  );

  useEffect(() => {
    window.addEventListener("message", onAuthMessage);
    return () => window.removeEventListener("message", onAuthMessage);
  }, [onAuthMessage]);

  return (
    <header className="relative h-10 flex items-center border-b border-border bg-background text-foreground px-6">
      <div className="flex items-center gap-2">
        <Avatar
          className="h-6 w-6 cursor-pointer rounded-none"
          onClick={() => navigate("/")}
        >
          <AvatarImage src={logo} alt="Logo" />
          <AvatarFallback>DB</AvatarFallback>
        </Avatar>
        <SharedHeaderMenubar />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <span className="text-sm font-medium truncate max-w-56 select-none">
          {project?.name ?? ""}
        </span>
        <ThemeToggle />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <Badge
          variant="outline"
          className="gap-1.5 border-amber-500/50 text-amber-600 dark:border-amber-400/50 dark:text-amber-400"
        >
          <Lock className="h-3 w-3" />
          Read-only
        </Badge>

        <div className="flex items-center gap-2 border-l border-border pl-3">
          {authStatus === "loading" ? (
            <div className="h-6 w-14 animate-pulse rounded-md bg-muted" />
          ) : isLoggedIn ? (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 px-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback className="text-[10px]">
                      {profile.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto min-w-48">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      ID: {profile.id}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href="/profile" target="_blank" rel="noopener noreferrer">
                    <User className="h-4 w-4" />
                    Profile
                  </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => dispatch(logout())}>
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs"
              onClick={() => authService.openGooglePopup()}
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default SharedHeader;
