import {
  CheckOutlined,
  NotificationFilled,
  SwapOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Tabs, type TabsProps } from "antd";

import { useAppSelector } from "@/app/hooks";
import ResizableSider from "@/components/ResizableSider";
import TablesTabs from "./Tabs/TablesTab/TablesTabs";

export default function EditorSider() {
  const showSider = useAppSelector((state) => state.view.showSider);

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: <TableOutlined className="!text-2xl" />,
      children: <TablesTabs />,
    },
    {
      key: "2",
      label: <SwapOutlined className="!text-2xl" />,
      children: <CheckOutlined />,
    },
    {
      key: "3",
      label: <NotificationFilled className="!text-2xl" />,
      children: <CheckOutlined />,
    },
  ];

  return (
    <ResizableSider defaultWidth={320} collapsed={!showSider}>
      <Tabs size="small" items={items} tabPosition="left" className="h-full" />
    </ResizableSider>
  );
}
