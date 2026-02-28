import { TABLE_HEADER_COLORS } from "@/constants/table-header-colors";
import type { TableHeaderColor } from "@/features/database/schemas/table";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value: TableHeaderColor;
  onChange: (color: TableHeaderColor) => void;
}

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(TABLE_HEADER_COLORS).map(([key, color]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(color as TableHeaderColor)}
          className={cn(
            "w-7 h-7 rounded-full border-2 transition-all hover:scale-110",
            value === color
              ? "border-white ring-2 ring-offset-1 ring-gray-400 scale-110"
              : "border-transparent",
          )}
          style={{ backgroundColor: color }}
          title={key}
        />
      ))}
    </div>
  );
};

export default ColorPicker;
