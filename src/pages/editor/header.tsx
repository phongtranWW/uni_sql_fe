import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import logo from "@/assets/logo.png";
import HeaderMenubar from "./header-menubar";
import HeaderProjectStatus from "./header-project-status";
import HeaderProjectName from "./header-project-name";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Undo2, Redo2, Share2, Lock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { ActionCreators } from "redux-undo";
import {
  selectCanRedo,
  selectCanUndo,
  selectIsOwner,
} from "@/features/project/selectors/project.selector";
import { useState } from "react";
import ShareProjectDialog from "./share-project-dialog";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const isOwner = useAppSelector(selectIsOwner);
  const [shareOpen, setShareOpen] = useState(false);

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
        <HeaderMenubar />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => dispatch(ActionCreators.undo())}
          disabled={!canUndo || isOwner === false}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => dispatch(ActionCreators.redo())}
          disabled={!canRedo || isOwner === false}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <HeaderProjectName />
      </div>

      <div className="ml-auto flex items-center gap-3">
        {isOwner === false && (
          <Badge
            variant="outline"
            className="gap-1.5 border-amber-500/50 text-amber-600 dark:border-amber-400/50 dark:text-amber-400"
          >
            <Lock className="h-3 w-3" />
            Read-only
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 px-2 text-xs"
          onClick={() => setShareOpen(true)}
        >
          <Share2 className="h-3.5 w-3.5" />
          Share
        </Button>
        <HeaderProjectStatus />
      </div>

      <ShareProjectDialog open={shareOpen} onOpenChange={setShareOpen} />
    </header>
  );
};

export default Header;
