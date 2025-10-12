import {
  CheckOutlined,
  NotificationFilled,
  SwapOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Tabs, type TabsProps } from "antd";

import { useAppSelector } from "@/app/hooks";
import ResizableSider from "@/components/ResizableSider";

export default function EditorSider() {
  const showSider = useAppSelector((state) => state.view.showSider);

  const items: TabsProps["items"] = [
    { key: "1", label: <TableOutlined />, children: <div>Content 1</div> },
    { key: "2", label: <SwapOutlined />, children: <CheckOutlined /> },
    { key: "3", label: <NotificationFilled />, children: <CheckOutlined /> },
  ];

  return (
    <ResizableSider defaultWidth={320} collapsed={!showSider}>
      <Tabs size="small" items={items} tabPosition="left" className="h-full" />
    </ResizableSider>
  );
}
