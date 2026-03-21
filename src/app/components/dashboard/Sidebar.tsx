import { useLocation, useNavigate } from "react-router";
import { Activity, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { sidebarItems, agentIcons, onlineAgents } from "./sidebar-config";
import type { useSidebarResize } from "../../hooks/useSidebarResize";

interface SidebarProps {
  resize: ReturnType<typeof useSidebarResize>;
}

export function Sidebar({ resize }: SidebarProps) {
  const { sidebarWidth, isCollapsed, isDragging, sidebarRef, handleMouseDown, toggleCollapse } = resize;
  const location = useLocation();
  const navigate = useNavigate();

  const activePath = location.pathname;

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 bg-neutral-950 relative"
      ref={sidebarRef}
      style={{ width: `${sidebarWidth}px`, transition: isDragging ? "none" : "width 0.2s ease" }}
    >
      {/* Header */}
      <div className={isCollapsed ? "p-2" : "p-4"}>
        {isCollapsed ? (
          <div className="flex items-center justify-center py-2">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <Activity className="h-4 w-4 text-white" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 mb-4">
            <Activity className="h-4 w-4 text-white shrink-0" />
            <div className="min-w-0 overflow-hidden">
              <span className="text-white text-sm whitespace-nowrap" style={{ fontWeight: 600 }}>
                我的AI团队
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                <span className="text-green-400 text-xs whitespace-nowrap">运行中</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 ${isCollapsed ? "px-1.5" : "px-3"} space-y-1 overflow-y-auto`}>
        {sidebarItems.map((item) => {
          const isActive = activePath.startsWith(item.path);
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsed ? "justify-center" : ""} gap-3 ${isCollapsed ? "px-0 py-2.5" : "px-3 py-2"} rounded-lg text-sm transition-colors ${
                item.special
                  ? isActive
                    ? "bg-white text-black"
                    : "bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10 hover:text-white"
                  : isActive
                    ? "bg-white/10 text-white"
                    : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
              }`}
              style={item.special ? { fontWeight: 600 } : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="truncate">{item.label}</span>}
              {!isCollapsed && item.special && (
                <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-green-400"} animate-pulse shrink-0`} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Online agents */}
      <div className={`${isCollapsed ? "p-2" : "p-4"} border-t border-white/10`}>
        {!isCollapsed && (
          <span className="text-neutral-600 text-xs block mb-3" style={{ fontWeight: 600 }}>
            在线员工
          </span>
        )}
        <div className="space-y-2">
          {onlineAgents.map((name) => (
            <div
              key={name}
              title={isCollapsed ? name : undefined}
              className={`flex items-center ${isCollapsed ? "justify-center" : ""} gap-2 ${isCollapsed ? "px-0 py-1.5" : "px-2 py-1.5"} rounded-lg hover:bg-white/5 transition-colors cursor-pointer`}
            >
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white relative shrink-0">
                {agentIcons[name]}
                {isCollapsed && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-neutral-950" />
                )}
              </div>
              {!isCollapsed && (
                <>
                  <span className="text-neutral-400 text-sm truncate">{name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-auto shrink-0" />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Collapse toggle */}
      <div className={`${isCollapsed ? "p-2" : "px-4 pb-4"} border-t border-white/10 pt-2`}>
        <button
          className={`w-full flex items-center ${isCollapsed ? "justify-center" : ""} gap-3 ${isCollapsed ? "px-0 py-2" : "px-3 py-2"} rounded-lg text-sm transition-colors text-neutral-500 hover:text-neutral-300 hover:bg-white/5`}
          onClick={toggleCollapse}
          title={isCollapsed ? "展开侧边栏" : "折叠侧边栏"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" />
              <span className="text-neutral-500 text-sm truncate">折叠侧边栏</span>
            </>
          )}
        </button>
      </div>

      {/* Resize drag handle */}
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-white/20 active:bg-white/30 transition-colors z-10 group"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -left-1 -right-1" />
      </div>

      {/* Right border */}
      <div className="absolute top-0 right-0 w-px h-full bg-white/10 pointer-events-none" />
    </aside>
  );
}
