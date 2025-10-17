import { useAppDispatch } from "@/app/hooks";
import type { RootState } from "@/app/store";
import { tableUpdated } from "@/features/diagram/diagramSlice";
import { selectTableById } from "@/features/diagram/selector";
import { Button, Flex, Input } from "antd";
import { useSelector } from "react-redux";

interface TableInfoProps {
  tableId: string;
}

export default function TableInfo({ tableId }: TableInfoProps) {
  const table = useSelector((state: RootState) =>
    selectTableById(state, tableId)
  );
  const dispatch = useAppDispatch();

  return (
    <Flex justify="start" align="start" vertical className="w-80" gap={8}>
      <Flex justify="space-between" align="center" className="w-full">
        <p className="text-sm font-semibold w-1/4">Name: </p>
        <Input
          defaultValue={table.name}
          size="small"
          onChange={(e) =>
            dispatch(tableUpdated({ id: table.id, name: e.target.value }))
          }
        />
      </Flex>
      <Flex justify="space-between" align="center" className="w-full">
        <p className="text-sm font-semibold w-1/4">Alias: </p>
        <Input
          defaultValue={table.alias || ""}
          size="small"
          onChange={(e) =>
            dispatch(tableUpdated({ id: table.id, alias: e.target.value }))
          }
        />
      </Flex>
      <Button variant="solid" size="small" color="danger" className="w-full">
        Delete Table
      </Button>
    </Flex>
  );
}
