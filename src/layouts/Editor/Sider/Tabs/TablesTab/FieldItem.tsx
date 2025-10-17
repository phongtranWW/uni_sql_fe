import { useAppDispatch } from "@/app/hooks";
import type { RootState } from "@/app/store";
import { FIELD_TYPE } from "@/data/field-type";
import { fieldUpdated } from "@/features/diagram/diagramSlice";
import { selectFieldById } from "@/features/diagram/selector";
import parseFieldLabel from "@/utils/parseFieldLabel";
import parseFieldType from "@/utils/parseFieldType";
import { AutoComplete, Flex } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";

interface FieldItemProps {
  fieldId: string;
}

export default function FieldItem({ fieldId }: FieldItemProps) {
  const field = useSelector((state: RootState) =>
    selectFieldById(state, fieldId)
  );
  const databaseType = useSelector(
    (state: RootState) => state.diagram.setting.databaseType
  );
  const [fieldType, setFieldType] = useState<string | null>(
    parseFieldLabel(field.type, databaseType)
  );
  const dispatch = useAppDispatch();

  return (
    <Flex justify="space-between" align="center" className="w-full !px-3 !py-2">
      <p className="text-sm w-1/2 truncate">{field.name}</p>
      <AutoComplete
        size="small"
        className="flex-1"
        options={FIELD_TYPE[databaseType].map((type) => ({
          label: type.type_name,
          value: type.type_name,
        }))}
        onChange={(value) => setFieldType(value)}
        value={fieldType ?? ""}
        onBlur={() => {
          const newFieldType = parseFieldType(fieldType, databaseType);
          if (!newFieldType) {
            setFieldType(parseFieldLabel(field.type, databaseType));
            return;
          }
          dispatch(
            fieldUpdated({
              id: field.id,
              type: newFieldType,
            })
          );
          setFieldType(parseFieldLabel(newFieldType, databaseType));
        }}
      />
    </Flex>
  );
}
