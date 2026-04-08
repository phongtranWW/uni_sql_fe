import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router";
import logo from "@/assets/logo.png";
import HeaderMenubar from "./header-menubar";
import HeaderProjectStatus from "./header-project-status";
import HeaderProjectName from "./header-project-name";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { ActionCreators } from "redux-undo";
import {
  selectCanRedo,
  selectCanUndo,
} from "@/features/project/selectors/project.selector";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);

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
          disabled={!canUndo}
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => dispatch(ActionCreators.redo())}
          disabled={!canRedo}
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <HeaderProjectName />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <HeaderProjectStatus />
      </div>
    </header>
  );
};

export default Header;
