import { useAppDispatch } from "@/app/hook";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type Field } from "@/features/project/schemas/field-schema";
import {
  fieldPartial,
  fieldRemoved,
} from "@/features/project/slices/project.slice";
import { ArrowUp, Ban, Fingerprint, Trash2 } from "lucide-react";
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
  const [defaultDraft, setDefaultDraft] = useState(() => field.default ?? "");

  const commitDefault = useCallback(() => {
    const next = defaultDraft.trim() === "" ? null : defaultDraft;
    const prev = field.default ?? null;
    if (next === prev) return;

    dispatch(
      fieldPartial({
        tableName,
        fieldName: field.name,
        data: { default: next },
      }),
    );
  }, [defaultDraft, dispatch, field.default, field.name, tableName]);
  const handleIncrementChange = useCallback(
    (value: boolean) => {
      dispatch(
        fieldPartial({
          tableName,
          fieldName: field.name,
          data: { increment: value },
        }),
      );
    },
    [dispatch, tableName, field.name],
  );

  const handleUniqueChange = useCallback(
    (value: boolean) => {
      dispatch(
        fieldPartial({
          tableName,
          fieldName: field.name,
          data: { unique: value },
        }),
      );
    },
    [dispatch, tableName, field.name],
  );

  const handleNotNullChange = useCallback(
    (value: boolean) => {
      dispatch(
        fieldPartial({
          tableName,
          fieldName: field.name,
          data: { not_null: value },
        }),
      );
    },
    [dispatch, tableName, field.name],
  );

  const handleDelete = useCallback(() => {
    dispatch(fieldRemoved({ tableName, fieldName: field.name }));
    onOpenChange(false);
  }, [dispatch, tableName, field.name, onOpenChange]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) commitDefault();
        onOpenChange(next);
      }}
    >
      <DialogContent key={`${open}-${tableName}-${field.name}`}>
        <DialogHeader>
          <DialogTitle>
            Field Settings <Badge variant="outline">{field.name}</Badge>
          </DialogTitle>
          <DialogDescription>
            Toggle constraints, then set an optional SQL default at the bottom.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col divide-y divide-border">
          {/* Auto Increment */}
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <ArrowUp className="size-4" />
              <div className="min-w-0">
                <Label htmlFor="switch-increment" className="cursor-pointer">
                  Auto Increment
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically increase value
                </p>
              </div>
            </div>
            <Switch
              id="switch-increment"
              checked={field.increment}
              onCheckedChange={handleIncrementChange}
            />
          </div>

          {/* Unique */}
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Fingerprint className="size-4" />
              <div className="min-w-0">
                <Label htmlFor="switch-unique" className="cursor-pointer">
                  Unique
                </Label>
                <p className="text-xs text-muted-foreground">
                  Ensure values are distinct
                </p>
              </div>
            </div>
            <Switch
              id="switch-unique"
              checked={field.unique}
              onCheckedChange={handleUniqueChange}
            />
          </div>

          {/* Not Null */}
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Ban className="size-4" />
              <div className="min-w-0">
                <Label htmlFor="switch-not-null" className="cursor-pointer">
                  Not Null
                </Label>
                <p className="text-xs text-muted-foreground">
                  Prevent null values
                </p>
              </div>
            </div>
            <Switch
              id="switch-not-null"
              checked={field.not_null}
              onCheckedChange={handleNotNullChange}
            />
          </div>

          {/* Default Value */}
          <div className="space-y-1.5 py-3">
            <Label htmlFor="field-default">Default value</Label>
            <Textarea
              id="field-default"
              value={defaultDraft}
              onChange={(e) => setDefaultDraft(e.target.value)}
              onBlur={commitDefault}
              placeholder="e.g. 0, CURRENT_TIMESTAMP, or NULL — leave empty for no default"
              className="min-h-[88px] resize-y font-mono text-xs leading-relaxed"
              rows={4}
            />
          </div>
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
