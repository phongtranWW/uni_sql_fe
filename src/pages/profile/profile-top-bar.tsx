import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ProfileUserMenu } from "./profile-user-menu";

export function ProfileTopBar() {
  const navigate = useNavigate();

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-2 text-muted-foreground hover:text-foreground"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="size-4 shrink-0" />
        Back to home
      </Button>
      <div className="flex items-center gap-2">
        <ProfileUserMenu />
      </div>
    </header>
  );
}
