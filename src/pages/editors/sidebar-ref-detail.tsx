import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  REF_OPERATOR,
  type Ref,
  type RefOperator,
} from "@/features/database/schemas/ref";
import {
  ArrowDown,
  ArrowUp,
  MoreHorizontal,
  SeparatorHorizontal,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import type { RootState } from "@/app/store";
import { Separator } from "@/components/ui/separator";
import { removeRef, updateRef } from "@/features/database/slice";

const OPERATOR_ICONS = {
  [REF_OPERATOR.ONE_TO_ONE]: SeparatorHorizontal,
  [REF_OPERATOR.ONE_TO_MANY]: ArrowUp,
  [REF_OPERATOR.MANY_TO_ONE]: ArrowDown,
};

interface SidebarEndpointProps {
  tableName: string;
  fieldName: string;
  onTableChange: (val: string) => void;
  onFieldChange: (val: string) => void;
}

const SidebarEndpoint = ({
  tableName,
  fieldName,
  onTableChange,
  onFieldChange,
}: SidebarEndpointProps) => {
  const tables = useAppSelector((state: RootState) => state.database.tables);
  const table = tables.find((t) => t.name === tableName);

  return (
    <div className="w-full flex items-center gap-2">
      <Select value={tableName} onValueChange={onTableChange}>
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Table" />
        </SelectTrigger>
        <SelectContent>
          {tables.map((t) => (
            <SelectItem key={t.name} value={t.name}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={fieldName}
        onValueChange={onFieldChange}
        disabled={!tableName}
      >
        <SelectTrigger className="flex-1">
          <SelectValue placeholder="Field" />
        </SelectTrigger>
        <SelectContent>
          {table?.fields.map((f) => (
            <SelectItem key={f.name} value={f.name}>
              {f.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

interface SidebarRefOperatorProps {
  value: RefOperator;
  onChange: (val: RefOperator) => void;
}

const SidebarRefOperator = ({ value, onChange }: SidebarRefOperatorProps) => {
  const Icon = OPERATOR_ICONS[value];

  return (
    <div className="w-full flex items-center gap-2">
      <Separator className="flex-1" />
      <Select
        value={value}
        onValueChange={(val) => onChange(val as RefOperator)}
      >
        <SelectTrigger className="w-auto">
          <SelectValue>
            <Icon />
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem key={"oneToOne"} value={REF_OPERATOR.ONE_TO_ONE}>
            <SeparatorHorizontal /> One To One
          </SelectItem>
          <SelectItem key={"oneToMany"} value={REF_OPERATOR.ONE_TO_MANY}>
            <ArrowUp /> One To Many
          </SelectItem>
          <SelectItem key={"manyToOne"} value={REF_OPERATOR.MANY_TO_ONE}>
            <ArrowDown /> Many To One
          </SelectItem>
        </SelectContent>
      </Select>
      <Separator className="flex-1" />
    </div>
  );
};

interface SidebarRefDetailProps {
  reference: Ref;
}

const SidebarRefDetail = ({ reference }: SidebarRefDetailProps) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState(reference.name);
  const [operator, setOperator] = useState<RefOperator>(reference.operator);

  const [primaryTableName, setPrimaryTableName] = useState<string>(
    reference.endpoints[0].tableName,
  );
  const [primaryFieldName, setPrimaryFieldName] = useState<string>(
    reference.endpoints[0].fieldName,
  );
  const [foreignTableName, setForeignTableName] = useState<string>(
    reference.endpoints[1].tableName,
  );
  const [foreignFieldName, setForeignFieldName] = useState<string>(
    reference.endpoints[1].fieldName,
  );

  const handleSave = () => {
    dispatch(
      updateRef({
        name: reference.name,
        refUpdate: {
          name,
          operator,
          endpoints: [
            {
              tableName: primaryTableName,
              fieldName: primaryFieldName,
            },
            {
              tableName: foreignTableName,
              fieldName: foreignFieldName,
            },
          ],
        },
      }),
    );
    toast.success("Reference updated successfully");
  };

  const handleDelete = () => {
    dispatch(removeRef(reference.name));
    toast.success("Reference deleted successfully");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reference Info</DialogTitle>
          <DialogDescription>Make changes to your reference.</DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="ref-name">Name</FieldLabel>
            <Input
              id="ref-name"
              autoComplete="off"
              placeholder="Reference name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel>Endpoints</FieldLabel>
            <div className="flex flex-col items-center gap-2">
              <SidebarEndpoint
                tableName={primaryTableName}
                fieldName={primaryFieldName}
                onTableChange={setPrimaryTableName}
                onFieldChange={setPrimaryFieldName}
              />
              <SidebarRefOperator value={operator} onChange={setOperator} />
              <SidebarEndpoint
                tableName={foreignTableName}
                fieldName={foreignFieldName}
                onTableChange={setForeignTableName}
                onFieldChange={setForeignFieldName}
              />
            </div>
          </Field>
        </FieldGroup>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SidebarRefDetail;
