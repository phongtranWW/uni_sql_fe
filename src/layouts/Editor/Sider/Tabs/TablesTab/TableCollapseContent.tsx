import type { RootState } from "@/app/store";
import { selectFieldIdsByTableId } from "@/features/diagram/selector";
import { List } from "antd";
import { useSelector } from "react-redux";
import FieldItem from "./FieldItem";

interface TableCollapseItemProps {
  tableId: string;
}

export default function TableCollapseContent({
  tableId,
}: TableCollapseItemProps) {
  const fieldIds = useSelector((state: RootState) =>
    selectFieldIdsByTableId(state, tableId)
  );

  return (
    <List
      size="small"
      className="w-full"
      dataSource={fieldIds}
      renderItem={(fieldId) => <FieldItem fieldId={fieldId} />}
    />
  );
}
