import { cn } from "@/lib/utils";
import {
  REF_OPERATOR,
  RefPartSchema,
  type Ref,
  type RefPart,
} from "@/features/project/schemas/ref.schema";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useRef, useState } from "react";
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
  onBlur: (v: string) => void;
}) => {
  const [name, setName] = useState(value);

  return (
    <Input
      className="flex-1 min-w-0 h-7 text-xs rounded-sm px-1.5 py-0"
      value={name}
      onChange={(e) => setName(e.target.value)}
      onBlur={(e) => onBlur(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
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
      {Object.entries(REF_OPERATOR).map(([key, val]) => (
        <SelectItem key={val} value={val} className="text-xs">
          {key}
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

  const handleRefPartial = useCallback(
    (data: RefPart) => {
      const result = RefPartSchema.safeParse(data);
      if (!result.success) {
        toast.error(result.error.issues[0].message);
        return;
      }
      dispatch(refPartial({ refName: reference.name, data }));
    },
    [dispatch, reference.name],
  );

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
      <RefName
        value={reference.name}
        onBlur={(name) => {
          if (refs.find((r) => r.name === name) && name !== reference.name) {
            toast.error("Reference name already exists");
            return;
          }
          handleRefPartial({ name });
        }}
      />
      <TypeSelect
        value={reference.operator}
        onChange={(value) => {
          handleRefPartial({ operator: value as RefPart["operator"] });
        }}
      />
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 size-7"
        onClick={(e) => {
          e.stopPropagation();
          dispatch(refRemoved(reference.name));
        }}
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  );
};

export default SidebarRef;
