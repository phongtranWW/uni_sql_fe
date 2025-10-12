import { Flex } from "antd";

interface EditorDropdownCommandProps {
  label: string;
  shortcut?: string;
}

export default function EditorDropdownCommand({
  label,
  shortcut,
}: EditorDropdownCommandProps) {
  return (
    <Flex justify="space-between" align="center" className="w-60">
      <p>{label}</p>
      {shortcut && <p>{shortcut}</p>}
    </Flex>
  );
}
