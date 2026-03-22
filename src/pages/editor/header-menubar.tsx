import { useAppDispatch } from "@/app/hook";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { useState } from "react";
import CodePreview from "./code-preview";
import { ActionCreators } from "redux-undo";

const HeaderMenubar = () => {
  const dispatch = useAppDispatch();
  const [showCodePreview, setShowCodePreview] = useState(false);
  return (
    <div>
      <Menubar className="border-0 shadow-none bg-transparent p-0">
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent hover:bg-accent data-[state=open]:bg-accent">
            File
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Import from</MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Export to</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>JSON</MenubarItem>
                <MenubarItem>MySQL</MenubarItem>
                <MenubarItem>Postgres</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="bg-transparent hover:bg-accent data-[state=open]:bg-accent">
            Edit
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => dispatch(ActionCreators.undo())}>
              Undo <MenubarShortcut>Ctrl + Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => dispatch(ActionCreators.redo())}>
              Redo <MenubarShortcut>Ctrl + Y</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Save <MenubarShortcut>Ctrl + S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Delete <MenubarShortcut>Del / Bac</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <CodePreview
        open={showCodePreview}
        onOpenChange={setShowCodePreview}
        code={""}
        format={"json"}
      />
    </div>
  );
};

export default HeaderMenubar;
