import { useAppSelector } from "@/app/hook";
import type { RootState } from "@/app/store";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Exportor } from "@/utils/exporter";

const HeaderMenubar = () => {
  const database = useAppSelector((state: RootState) => state.database);

  return (
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
              <MenubarItem
                onClick={() => {
                  const exporter = Exportor.fromDatabase(database);
                  console.log(exporter.toDbml());
                }}
              >
                DBML
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  const exporter = Exportor.fromDatabase(database);
                  console.log(exporter.toJson());
                }}
              >
                JSON
              </MenubarItem>
              <MenubarItem
                onClick={() => {
                  const exporter = Exportor.fromDatabase(database);
                  console.log(exporter.toPsql());
                }}
              >
                Postgres
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="bg-transparent hover:bg-accent data-[state=open]:bg-accent">
          Edit
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Find</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Find...</MenubarItem>
              <MenubarItem>Find Next</MenubarItem>
              <MenubarItem>Find Previous</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default HeaderMenubar;
