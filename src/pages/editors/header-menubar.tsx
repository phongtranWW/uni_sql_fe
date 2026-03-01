import { useAppSelector } from "@/app/hook";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Exportor } from "@/utils/exporter";
import { useState } from "react";
import CodePreview from "./code-preview";
import { type CodeFormat } from "@/types/format";
import { CODE_FORMATS } from "@/constants/code-formats";
import { selectDatabaseState } from "@/features/database/selectors";

const HeaderMenubar = () => {
  const database = useAppSelector(selectDatabaseState);

  const [showCodePreview, setShowCodePreview] = useState(false);
  const [code, setCode] = useState("");
  const [previewType, setPreviewType] = useState<CodeFormat>(CODE_FORMATS.JSON);

  const handleExport = (type: "dbml" | "json" | "psql" | "mysql") => {
    const exporter = Exportor.fromDatabase(database);

    let result = "";

    switch (type) {
      case "dbml":
        result = exporter.toDbml();
        break;
      case "json":
        result = exporter.toJson();
        break;
      case "psql":
        result = exporter.toPsql();
        break;
      case "mysql":
        result = exporter.toMysql();
        break;
    }

    setPreviewType(type);
    setCode(result);
    setShowCodePreview(true);
  };

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
                <MenubarItem onClick={() => handleExport("dbml")}>
                  DBML
                </MenubarItem>
                <MenubarItem onClick={() => handleExport("json")}>
                  JSON
                </MenubarItem>
                <MenubarItem onClick={() => handleExport("mysql")}>
                  MySQL
                </MenubarItem>
                <MenubarItem onClick={() => handleExport("psql")}>
                  Postgres
                </MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <CodePreview
        open={showCodePreview}
        onOpenChange={setShowCodePreview}
        code={code}
        format={previewType}
      />
    </div>
  );
};

export default HeaderMenubar;
