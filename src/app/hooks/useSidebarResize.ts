import { useState, useRef, useCallback } from "react";

interface UseSidebarResizeOptions {
  defaultWidth?: number;
  collapsedWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function useSidebarResize(options: UseSidebarResizeOptions = {}) {
  const {
    defaultWidth = 224,
    collapsedWidth = 60,
    minWidth = 160,
    maxWidth = 360,
  } = options;

  const [sidebarWidth, setSidebarWidth] = useState(defaultWidth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isResizing = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizing.current = true;
      setIsDragging(true);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const handleMouseMove = (ev: MouseEvent) => {
        if (!isResizing.current) return;
        const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
        const newWidth = ev.clientX - sidebarLeft;
        if (newWidth < 80) {
          setIsCollapsed(true);
          setSidebarWidth(collapsedWidth);
        } else {
          setIsCollapsed(false);
          setSidebarWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)));
        }
      };

      const handleMouseUp = () => {
        isResizing.current = false;
        setIsDragging(false);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [collapsedWidth, minWidth, maxWidth],
  );

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      if (prev) {
        setSidebarWidth(defaultWidth);
        return false;
      } else {
        setSidebarWidth(collapsedWidth);
        return true;
      }
    });
  }, [defaultWidth, collapsedWidth]);

  return {
    sidebarWidth,
    isCollapsed,
    isDragging,
    sidebarRef,
    handleMouseDown,
    toggleCollapse,
  };
}
