import React, { useState, useRef, useEffect, type MouseEvent } from "react";
import { Layout } from "antd";
import clsx from "clsx";

const { Sider } = Layout;

interface ResizableSiderProps {
  collapsed?: boolean;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onResize?: (width: number) => void;
  side?: "left" | "right";
  children?: React.ReactNode;
}

export default function ResizableSider({
  collapsed = false,
  defaultWidth = 220,
  minWidth = 150,
  maxWidth = 400,
  onResize,
  side = "left",
  children,
}: ResizableSiderProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startXRef = useRef(0);
  const startWidthRef = useRef(defaultWidth);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
  };

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isResizing) return;

      const delta =
        side === "left"
          ? e.clientX - startXRef.current
          : startXRef.current - e.clientX;

      const newWidth = Math.min(
        maxWidth,
        Math.max(minWidth, startWidthRef.current + delta)
      );

      setWidth(newWidth);
      onResize?.(newWidth);
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, onResize, side]);

  return (
    <Sider
      width={collapsed ? 0 : width}
      collapsedWidth={0}
      className={clsx(
        "relative bg-white border-gray-200 ease-in-out",
        side === "left" ? "border-r" : "border-l",
        collapsed && "overflow-hidden"
      )}
      style={{
        transition: isResizing ? "none" : "width 0.15s ease",
        userSelect: isResizing ? "none" : "auto",
      }}
    >
      {!collapsed && (
        <div
          onMouseDown={handleMouseDown}
          className={clsx(
            "absolute top-0 h-full w-1 cursor-col-resize bg-transparent hover:bg-gray-300/40 select-none",
            side === "left" ? "right-0" : "left-0"
          )}
        />
      )}
      <div className="h-full overflow-auto">{children}</div>
    </Sider>
  );
}
