import { useState, useRef, useCallback, useEffect } from "react";
import {
  Bot,
  Users,
  ListChecks,
  ScrollText,
  Settings,
  ChevronRight,
  CheckCircle2,
  Circle,
  Search,
  Pen,
  Target,
  BarChart3,
  Activity,
  Menu,
  X,
  BookOpen,
  AppWindow,
  Brain,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { dashboardTasks } from "../data/mock-data";
import { motion } from "motion/react";
import { lazy, Suspense } from "react";

// ── Lazy-loaded dashboard sub-views ──
const AgentManageView = lazy(() => import("../components/dashboard/AgentManageView").then(m => ({ default: m.AgentManageView })));
const AgentDetailView = lazy(() => import("../components/dashboard/AgentDetailView").then(m => ({ default: m.AgentDetailView })));
const TeamManageView = lazy(() => import("../components/dashboard/TeamManageView").then(m => ({ default: m.TeamManageView })));
const ExecutionLogsView = lazy(() => import("../components/dashboard/ExecutionLogsView").then(m => ({ default: m.ExecutionLogsView })));
const SettingsView = lazy(() => import("../components/dashboard/SettingsView").then(m => ({ default: m.SettingsView })));
const KnowledgeBaseView = lazy(() => import("../components/dashboard/KnowledgeBaseView").then(m => ({ default: m.KnowledgeBaseView })));
const AppDashboardView = lazy(() => import("../components/dashboard/AppDashboardView").then(m => ({ default: m.AppDashboardView })));
const NewTaskView = lazy(() => import("../components/dashboard/NewTaskView").then(m => ({ default: m.NewTaskView })));
const GlobalBrainView = lazy(() => import("../components/dashboard/GlobalBrainView").then(m => ({ default: m.GlobalBrainView })));

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";

type DashboardView =
  | "brain"
  | "agents"
  | "teams"
  | "tasks"
  | "logs"
  | "knowledge"
  | "apps"
  | "settings"
  | { type: "agent-detail"; id: string };

const agentIcons: Record<string, React.ReactNode> = {
  "小研": <Search className="h-4 w-4" />,
  "小文": <Pen className="h-4 w-4" />,
  "小拓": <Target className="h-4 w-4" />,
  "小数": <BarChart3 className="h-4 w-4" />,
};

export function DashboardPage() {
  const [currentView, setCurrentView] = useState<DashboardView>("brain");
  const [selectedTaskId, setSelectedTaskId] = useState(dashboardTasks[0].id);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const selectedTask = dashboardTasks.find((t) => t.id === selectedTaskId)!;

  // Sidebar resize & collapse
  const [sidebarWidth, setSidebarWidth] = useState(224); // 14rem = 224px (w-56)
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isResizing = useRef(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const COLLAPSED_WIDTH = 60;
  const MIN_WIDTH = 160;
  const MAX_WIDTH = 360;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
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
        setSidebarWidth(COLLAPSED_WIDTH);
      } else {
        setIsCollapsed(false);
        setSidebarWidth(Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth)));
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
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      if (prev) {
        // Expand back
        setSidebarWidth(224);
        return false;
      } else {
        setSidebarWidth(COLLAPSED_WIDTH);
        return true;
      }
    });
  }, []);

  const activeKey = typeof currentView === "string" ? currentView : "agents";

  const sidebarItems = [
    { key: "brain" as const, icon: <Brain className="h-4 w-4" />, label: "全局大脑", special: true },
    { key: "agents" as const, icon: <Bot className="h-4 w-4" />, label: "员工管理" },
    { key: "teams" as const, icon: <Users className="h-4 w-4" />, label: "团队管理" },
    { key: "tasks" as const, icon: <ListChecks className="h-4 w-4" />, label: "任务中心" },
    { key: "apps" as const, icon: <AppWindow className="h-4 w-4" />, label: "应用看板" },
    { key: "knowledge" as const, icon: <BookOpen className="h-4 w-4" />, label: "知识库" },
    { key: "logs" as const, icon: <ScrollText className="h-4 w-4" />, label: "执行日志" },
    { key: "settings" as const, icon: <Settings className="h-4 w-4" />, label: "设置" },
  ];

  const statusConfig = {
    running: { label: "运行中", color: "text-green-400 bg-green-500/10 border-green-500/20" },
    done: { label: "已完成", color: "text-neutral-300 bg-white/10 border-white/20" },
    pending: { label: "等待中", color: "text-neutral-500 bg-white/5 border-white/10" },
  };

  const handleNavClick = (key: "brain" | "agents" | "teams" | "tasks" | "logs" | "knowledge" | "apps" | "settings") => {
    setCurrentView(key);
    setMobileMenuOpen(false);
    if (key !== "tasks") setShowNewTask(false);
  };

  return (
    <div className="bg-black text-white min-h-screen pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Desktop */}
        <aside
          className="hidden md:flex flex-col shrink-0 bg-neutral-950 relative"
          ref={sidebarRef}
          style={{ width: `${sidebarWidth}px`, transition: isDragging ? 'none' : 'width 0.2s ease' }}
        >
          {/* Header */}
          <div className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
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
          <nav className={`flex-1 ${isCollapsed ? 'px-1.5' : 'px-3'} space-y-1 overflow-y-auto`}>
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.key)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 ${isCollapsed ? 'px-0 py-2.5' : 'px-3 py-2'} rounded-lg text-sm transition-colors ${
                  "special" in item && item.special
                    ? activeKey === item.key
                      ? "bg-white text-black"
                      : "bg-white/5 text-neutral-300 border border-white/10 hover:bg-white/10 hover:text-white"
                    : activeKey === item.key
                      ? "bg-white/10 text-white"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                }`}
                style={"special" in item && item.special ? { fontWeight: 600 } : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {!isCollapsed && "special" in item && item.special && (
                  <span className={`ml-auto w-1.5 h-1.5 rounded-full ${activeKey === item.key ? "bg-green-500" : "bg-green-400"} animate-pulse shrink-0`} />
                )}
              </button>
            ))}
          </nav>

          {/* Online agents */}
          <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-white/10`}>
            {!isCollapsed && (
              <span className="text-neutral-600 text-xs block mb-3" style={{ fontWeight: 600 }}>
                在线员工
              </span>
            )}
            <div className="space-y-2">
              {["小研", "小文", "小拓", "小数"].map((name) => (
                <div
                  key={name}
                  title={isCollapsed ? name : undefined}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : ''} gap-2 ${isCollapsed ? 'px-0 py-1.5' : 'px-2 py-1.5'} rounded-lg hover:bg-white/5 transition-colors cursor-pointer`}
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
          <div className={`${isCollapsed ? 'p-2' : 'px-4 pb-4'} border-t border-white/10 pt-2`}>
            <button
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : ''} gap-3 ${isCollapsed ? 'px-0 py-2' : 'px-3 py-2'} rounded-lg text-sm transition-colors text-neutral-500 hover:text-neutral-300 hover:bg-white/5`}
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

        {/* Mobile top bar */}
        <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-neutral-950 border-b border-white/10 px-4 py-2 flex items-center justify-between">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-neutral-400 p-1">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="text-white text-sm" style={{ fontWeight: 600 }}>
            {sidebarItems.find((s) => s.key === activeKey)?.label || "控制台"}
          </span>
          <div className="w-7" />
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-20 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-56 h-full bg-neutral-950 border-r border-white/10 pt-28" onClick={(e) => e.stopPropagation()}>
              <nav className="px-3 space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavClick(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      "special" in item && item.special
                        ? activeKey === item.key
                          ? "bg-white text-black"
                          : "bg-white/10 text-white hover:bg-white/15"
                        : activeKey === item.key
                          ? "bg-white/10 text-white"
                          : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                    }`}
                    style={"special" in item && item.special ? { fontWeight: 600 } : undefined}
                  >
                    {item.icon}
                    {item.label}
                    {"special" in item && item.special && (
                      <span className={`ml-auto w-1.5 h-1.5 rounded-full ${activeKey === item.key ? "bg-green-500" : "bg-green-400"} animate-pulse`} />
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden md:mt-0 mt-10">
          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span className="text-neutral-600 text-xs">加载中...</span>
              </div>
            </div>
          }>
          {activeKey === "agents" && typeof currentView === "string" && (
            <AgentManageView onSelectAgent={(id) => setCurrentView({ type: "agent-detail", id })} />
          )}

          {typeof currentView === "object" && currentView.type === "agent-detail" && (
            <AgentDetailView agentId={currentView.id} onBack={() => setCurrentView("agents")} />
          )}

          {activeKey === "teams" && <TeamManageView />}

          {activeKey === "tasks" && (
            <>
              {showNewTask ? (
                <NewTaskView onBack={() => setShowNewTask(false)} />
              ) : (
                <>
                  <div className="w-full md:w-80 border-r border-white/10 overflow-y-auto shrink-0">
                    <div className="p-4 border-b border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-white" style={{ fontWeight: 600 }}>任务中心</h2>
                        <Button size="sm" className="bg-white text-black hover:bg-neutral-200 h-7 text-xs" onClick={() => setShowNewTask(true)}>
                          + 新任务
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "运行中", value: "2", color: "text-green-400" },
                          { label: "已完成", value: "1", color: "text-neutral-300" },
                          { label: "等待中", value: "1", color: "text-neutral-500" },
                        ].map((stat) => (
                          <div key={stat.label} className="text-center p-2 rounded-lg bg-white/5">
                            <div className={stat.color} style={{ fontWeight: 600 }}>{stat.value}</div>
                            <div className="text-neutral-600 text-xs">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-2">
                      {dashboardTasks.map((task) => {
                        const config = statusConfig[task.status];
                        return (
                          <button
                            key={task.id}
                            onClick={() => setSelectedTaskId(task.id)}
                            className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${
                              selectedTaskId === task.id
                                ? "bg-white/5 border border-white/10"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white text-sm" style={{ fontWeight: 500 }}>{task.name}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-neutral-600" />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-neutral-500 text-xs">{task.agent}</span>
                              <Badge variant="outline" className={`text-xs py-0 ${config.color}`}>
                                {config.label}
                              </Badge>
                            </div>
                            {task.status === "running" && (
                              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-white rounded-full transition-all"
                                  style={{ width: `${task.progress}%` }}
                                />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="hidden md:flex flex-1 flex-col overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="text-white truncate" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                              {selectedTask.name}
                            </h2>
                            <div className="flex items-center gap-x-3 gap-y-1 mt-1 flex-wrap">
                              <span className="text-neutral-500 text-sm">执行者：{selectedTask.agent}</span>
                              <span className="text-neutral-500 text-sm">开始时间：{selectedTask.startTime}</span>
                              <Badge variant="outline" className={`text-xs py-0 ${statusConfig[selectedTask.status].color}`}>
                                {statusConfig[selectedTask.status].label}
                              </Badge>
                            </div>
                          </div>
                          {selectedTask.status !== "done" && (
                            <div className="flex gap-2 shrink-0">
                              <Button variant="outline" size="sm" className="border-white/10 text-neutral-400 hover:text-white bg-transparent">
                                暂停
                              </Button>
                              <Button variant="outline" size="sm" className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent">
                                终止
                              </Button>
                            </div>
                          )}
                        </div>

                        {selectedTask.status !== "pending" && (
                          <div>
                            <div className="flex justify-between text-xs text-neutral-500 mb-1">
                              <span>执行进度</span>
                              <span>{selectedTask.progress}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-white rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${selectedTask.progress}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                      <h3 className="text-neutral-500 text-sm mb-4" style={{ fontWeight: 600 }}>执行日志</h3>
                      <div className="space-y-2">
                        {selectedTask.logs.map((log, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm ${
                              log.status === "running"
                                ? "bg-white/10 border border-white/20"
                                : log.status === "done"
                                ? "bg-white/5"
                                : "bg-white/[0.02]"
                            }`}
                          >
                            <span className="text-neutral-600 text-xs w-16 shrink-0">{log.time}</span>
                            <span
                              className={
                                log.status === "done"
                                  ? "text-neutral-300"
                                  : log.status === "running"
                                  ? "text-white"
                                  : "text-neutral-600"
                              }
                            >
                              {log.message}
                            </span>
                            <span className="ml-auto shrink-0">
                              {log.status === "done" && <CheckCircle2 className="h-4 w-4 text-white" />}
                              {log.status === "running" && (
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              )}
                              {log.status === "pending" && <Circle className="h-4 w-4 text-neutral-700" />}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {selectedTask.status === "done" && (
                      <div className="border-t border-white/10 p-4">
                        <h3 className="text-white mb-3" style={{ fontWeight: 600 }}>输出结果</h3>
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <p className="text-neutral-300 text-sm">
                            任务已完成。文章已生成（2,400字），SEO优化完成。
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" className="bg-white text-black hover:bg-neutral-200 h-7">
                              查看全文
                            </Button>
                            <Button variant="outline" size="sm" className="border-white/10 text-neutral-400 bg-transparent h-7">
                              下载
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {activeKey === "logs" && <ExecutionLogsView />}
          {activeKey === "knowledge" && <KnowledgeBaseView />}
          {activeKey === "apps" && <AppDashboardView />}
          {activeKey === "settings" && <SettingsView />}
          {activeKey === "brain" && <GlobalBrainView />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}