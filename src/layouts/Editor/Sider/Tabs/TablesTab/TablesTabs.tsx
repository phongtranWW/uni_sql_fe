import { Button, Collapse, Flex, Popover } from "antd";
import TableCollapseContent from "./TableCollapseContent";
import { selectAllTables } from "@/features/diagram/selector";
import { useSelector } from "react-redux";
import { MoreOutlined } from "@ant-design/icons";
import TableInfo from "./TableInfo";

export default function TablesTabs() {
  const tables = useSelector(selectAllTables);

  return (
    <Flex justify="start" align="start" vertical className="w-full">
      <Flex
        justify="start"
        align="start"
        className="!px-3 !py-2 w-full"
        vertical
      >
        <p className="text-sm">TABLES</p>
      </Flex>
      <Collapse
        accordion
        className="w-full"
        bordered={false}
        size="small"
        items={tables.map((table) => ({
          key: table.id,
          label: <p>{table.name}</p>,
          children: <TableCollapseContent tableId={table.id} />,
          extra: (
            <Popover
              content={<TableInfo tableId={table.id} />}
              title="Table Attributes"
              placement="right"
              trigger="click"
            >
              <Button
                type="text"
                variant="text"
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreOutlined />
              </Button>
            </Popover>
          ),
        }))}
      />
    </Flex>
  );
}
