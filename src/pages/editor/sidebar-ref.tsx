import { cn } from "@/lib/utils";
import { REF_OPERATOR_LABELS } from "@/constants/ref-operator";
import { RefPartSchema, type Ref } from "@/features/project/schemas/ref.schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useRef } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/app/hook";
import { selectRefs } from "@/features/project/selectors/project.selector";
import {
  refPartial,
  refRemoved,
  refsSelected,
  refsSelectionCleared,
  tablesSelectionCleared,
} from "@/features/project/slices/project.slice";
import { Button } from "@/components/ui/button";
import { Trash2Icon } from "lucide-react";

const RefName = ({
  value,
  onBlur,
}: {
  value: string;
  onBlur: (v: string, reset: () => void) => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const reset = useCallback(() => {
    if (ref.current) ref.current.value = value;
  }, [value]);

  return (
    <Input
      ref={ref}
      className="flex-2 min-w-0 h-7 text-xs rounded-sm px-1.5 py-0"
      defaultValue={value}
      onBlur={(e) => onBlur(e.target.value, reset)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onBlur((e.target as HTMLInputElement).value, reset);
          e.currentTarget.blur();
        }
      }}
    />
  );
};

const TypeSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger
      size="sm"
      className="flex-1 min-w-0 h-7! text-xs rounded-sm px-1.5 py-0"
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent position="popper" align="end">
      {Object.entries(REF_OPERATOR_LABELS).map(([operator, label]) => (
        <SelectItem key={operator} value={operator} className="text-xs">
          {label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

interface SidebarRefProps {
  reference: Ref;
}

const SidebarRef = ({ reference }: SidebarRefProps) => {
  const dispatch = useAppDispatch();
  const refs = useAppSelector(selectRefs);
  const rowRef = useRef<HTMLDivElement>(null);

  const syncBoardSelectThisRef = useCallback(() => {
    dispatch(tablesSelectionCleared());
    dispatch(refsSelectionCleared());
    dispatch(refsSelected({ name: [reference.name], value: true }));
  }, [dispatch, reference.name]);

  const handleBlurRow = useCallback(() => {
    window.requestAnimationFrame(() => {
      const active = document.activeElement as HTMLElement | null;
      if (active?.closest("[data-sidebar-ref]")) return;
      if (active?.closest('[data-slot="select-content"]')) return;
      if (rowRef.current && active && rowRef.current.contains(active)) return;
      dispatch(refsSelectionCleared());
    });
  }, [dispatch]);

  const handleUpdateName = useCallback(
    (name: string, reset: () => void) => {
      if (name === reference.name) {
        reset();
        return;
      }

      const result = RefPartSchema.safeParse({ name });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        reset();
        return;
      }

      if (refs.some((r) => r.name === result.data.name)) {
        toast.error("Reference name already exists");
        reset();
        return;
      }

      dispatch(refPartial({ refName: reference.name, data: result.data }));
    },
    [dispatch, reference.name, refs],
  );

  const handleUpdateOperator = useCallback(
    (operator: string) => {
      const result = RefPartSchema.safeParse({ operator });
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      dispatch(refPartial({ refName: reference.name, data: result.data }));
    },
    [dispatch, reference.name],
  );

  const handleDelete = useCallback(() => {
    dispatch(refRemoved(reference.name));
  }, [dispatch, reference.name]);

  return (
    <div
      ref={rowRef}
      data-sidebar-ref=""
      tabIndex={-1}
      className={cn(
        "group flex items-center justify-between gap-1 border-l-4 pl-1 outline-none focus-visible:ring-1 focus-visible:ring-ring",
        reference.isSelected ? "border-primary" : "border-muted-foreground/50",
      )}
      onPointerDownCapture={syncBoardSelectThisRef}
      onFocusCapture={syncBoardSelectThisRef}
      onBlur={handleBlurRow}
    >
      <RefName value={reference.name} onBlur={handleUpdateName} />
      <TypeSelect value={reference.operator} onChange={handleUpdateOperator} />
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 size-7"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  );
};

export default SidebarRef;
