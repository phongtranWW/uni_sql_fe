import { Flex } from "antd";
import EditorViewDropdown from "@/layouts/Editor/Header/MenuBar/Dropdowns/EditorViewDropdown";
import EditorFileDropdown from "@/layouts/Editor/Header/MenuBar/Dropdowns/EditorFileDropdown";
import EditorEditDropdown from "@/layouts/Editor/Header/MenuBar/Dropdowns/EditorEditDropdown";

export default function EditorMenuBar() {
  return (
    <Flex justify="center" align="center" className="max-w-50" gap={4}>
      <EditorFileDropdown />
      <EditorViewDropdown />
      <EditorEditDropdown />
    </Flex>
  );
}
