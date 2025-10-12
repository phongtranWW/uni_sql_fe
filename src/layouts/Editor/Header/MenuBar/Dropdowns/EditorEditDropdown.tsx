import { Button, Dropdown, type MenuProps } from "antd";

export default function EditorEditDropdown() {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "Option 1",
    },
    {
      key: "2",
      label: "Option 2",
    },
    {
      key: "3",
      label: "Option 3",
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} className="cursor-pointer">
      <Button size="small" type="text" variant="text">
        Edit
      </Button>
    </Dropdown>
  );
}
