import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { useNavigate } from "react-router";
import { selectProfile } from "@/features/auth/selectors";
import { logout } from "@/features/auth/thunks";
import { useCallback } from "react";

export function ProfileUserMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const profile = useAppSelector(selectProfile);

  const handleLogout = useCallback(async () => {
    await dispatch(logout());
    navigate("/login", { replace: true });
  }, [dispatch, navigate]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 overflow-hidden rounded-full"
        >
          <Avatar className="size-full">
            {profile?.avatar ? (
              <AvatarImage src={profile.avatar} alt="" />
            ) : null}
            <AvatarFallback>{profile?.name}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" side="bottom">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{profile?.name ?? "—"}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {profile?.email ?? "—"}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={(e) => {
            e.preventDefault();
            handleLogout();
          }}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
