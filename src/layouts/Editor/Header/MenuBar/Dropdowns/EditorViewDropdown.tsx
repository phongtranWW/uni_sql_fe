import { useAppDispatch } from "@/app/hooks";
import { toggleSider } from "@/features/view/viewSlice";
import { Button, Dropdown, type MenuProps } from "antd";
import EditorDropdownCommand from "./EditorDropdownCommand";

export default function EditorViewDropdown() {
  const dispatch = useAppDispatch();
  const items: MenuProps["items"] = [
    {
      key: "show-sider",
      label: <EditorDropdownCommand label="Show Sider" />,
      onClick: () => dispatch(toggleSider()),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} className="cursor-pointer">
      <Button size="small" type="text" variant="text">
        View
      </Button>
    </Dropdown>
  );
}
