import { useAppDispatch } from "@/app/hook";
import { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  FieldPartSchema,
  type Field,
} from "@/features/project/schemas/field-schema";
import {
  fieldPartial,
  fieldRemoved,
} from "@/features/project/slices/project.slice";
import { ArrowUp, Ban, Fingerprint, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface SidebarFieldDetailProps {
  tableName: string;
  field: Field;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SidebarFieldDetail = ({
  field,
  tableName,
  open,
  onOpenChange,
}: SidebarFieldDetailProps) => {
  const dispatch = useAppDispatch();

  const handleToggle = useCallback(
    (key: "unique" | "not_null" | "increment", value: boolean) => {
      const result = FieldPartSchema.safeParse({
        [key]: value,
      });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      dispatch(
        fieldPartial({
          tableName,
          fieldName: field.name,
          data: { [key]: value },
        }),
      );
    },
    [dispatch, tableName, field.name],
  );

  const handleDelete = useCallback(() => {
    dispatch(fieldRemoved({ tableName, fieldName: field.name }));
    onOpenChange(false);
  }, [dispatch, tableName, field.name, onOpenChange]);

  const constraints = useMemo(
    () => [
      {
        key: "increment" as const,
        label: "Auto Increment",
        checked: field.increment,
        icon: <ArrowUp className="size-4" />,
        description: "Automatically increase value",
      },
      {
        key: "unique" as const,
        label: "Unique",
        checked: field.unique,
        icon: <Fingerprint className="size-4" />,
        description: "Ensure values are distinct",
      },
      {
        key: "not_null" as const,
        label: "Not Null",
        checked: field.not_null,
        icon: <Ban className="size-4" />,
        description: "Prevent null values",
      },
    ],
    [field.increment, field.unique, field.not_null],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Field Settings <Badge variant="outline">{field.name}</Badge>
          </DialogTitle>
          <DialogDescription>
            Configure constraints for this field.
          </DialogDescription>
        </DialogHeader>

        <div>
          {constraints.map(({ key, label, checked, icon, description }, i) => (
            <div key={key}>
              {i > 0 && <Separator />}

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {icon}
                  <div>
                    <Label htmlFor={`switch-${key}`} className="cursor-pointer">
                      {label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>

                <Switch
                  id={`switch-${key}`}
                  checked={checked}
                  onCheckedChange={(val) => handleToggle(key, Boolean(val))}
                />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="size-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SidebarFieldDetail;
