import { useState, useMemo, useRef, useCallback } from "react";
import {
  Search,
  Star,
  Download,
  CheckCircle2,
  GripVertical,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Zap,
  BarChart3,
  FileText,
  Globe,
  BookOpen,
  ShoppingCart,
  Brain,
  ScanLine,
  Layers,
  Swords,
  TrendingUp,
  Activity,
  GitBranch,
  Network,
  Briefcase,
  Calculator,
  Users,
  PieChart,
  Link,
  Truck,
  MapPin,
  Home,
  UserCheck,
  Package,
  UserCircle,
  Palette,
  MessageSquare,
  Rss,
  Building2,
  Eye,
  Bell,
  Monitor,
  Wifi,
  AlertTriangle,
  Map,
  Scale,
  Heart,
  Compass,
  Wallet,
  Filter,
  Leaf,
  Sprout,
  Hexagon,
  Clock,
  Play,
  Settings,
  ExternalLink,
  ArrowLeft,
  PanelLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import {
  appItems,
  appProductTypeConfig,
  type AppItem,
} from "../../data/app-data";

const iconMap: Record<string, React.ReactNode> = {
  BarChart3: <BarChart3 className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  Globe: <Globe className="h-4 w-4" />,
  Search: <Search className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  ShoppingCart: <ShoppingCart className="h-4 w-4" />,
  Brain: <Brain className="h-4 w-4" />,
  ScanLine: <ScanLine className="h-4 w-4" />,
  Layers: <Layers className="h-4 w-4" />,
  Swords: <Swords className="h-4 w-4" />,
  TrendingUp: <TrendingUp className="h-4 w-4" />,
  Activity: <Activity className="h-4 w-4" />,
  GitBranch: <GitBranch className="h-4 w-4" />,
  Network: <Network className="h-4 w-4" />,
  Briefcase: <Briefcase className="h-4 w-4" />,
  Calculator: <Calculator className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  PieChart: <PieChart className="h-4 w-4" />,
  Link: <Link className="h-4 w-4" />,
  Truck: <Truck className="h-4 w-4" />,
  MapPin: <MapPin className="h-4 w-4" />,
  Home: <Home className="h-4 w-4" />,
  UserCheck: <UserCheck className="h-4 w-4" />,
  Package: <Package className="h-4 w-4" />,
  UserCircle: <UserCircle className="h-4 w-4" />,
  Palette: <Palette className="h-4 w-4" />,
  MessageSquare: <MessageSquare className="h-4 w-4" />,
  Rss: <Rss className="h-4 w-4" />,
  Building2: <Building2 className="h-4 w-4" />,
  Eye: <Eye className="h-4 w-4" />,
  Bell: <Bell className="h-4 w-4" />,
  Monitor: <Monitor className="h-4 w-4" />,
  Wifi: <Wifi className="h-4 w-4" />,
  AlertTriangle: <AlertTriangle className="h-4 w-4" />,
  Map: <Map className="h-4 w-4" />,
  Scale: <Scale className="h-4 w-4" />,
  Heart: <Heart className="h-4 w-4" />,
  Compass: <Compass className="h-4 w-4" />,
  Wallet: <Wallet className="h-4 w-4" />,
  Filter: <Filter className="h-4 w-4" />,
  Star: <Star className="h-4 w-4" />,
  Leaf: <Leaf className="h-4 w-4" />,
  Sprout: <Sprout className="h-4 w-4" />,
  Hexagon: <Hexagon className="h-4 w-4" />,
};

// Mock active app sessions
interface AppSession {
  appId: string;
  startedAt: string;
  status: "running" | "idle" | "paused";
}

const mockSessions: AppSession[] = [
  { appId: "app-33", startedAt: "10:32", status: "running" },
  { appId: "app-15", startedAt: "09:15", status: "running" },
  { appId: "app-38", startedAt: "08:45", status: "idle" },
  { appId: "app-40", startedAt: "昨天 16:20", status: "running" },
  { appId: "app-2", startedAt: "昨天 14:30", status: "idle" },
];

export function AppDashboardView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<string>(mockSessions[0].appId);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileShowContent, setMobileShowContent] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const dragItemRef = useRef<string | null>(null);

  const installedApps = useMemo(
    () => appItems.filter((a) => a.status === "installed"),
    []
  );

  const filteredApps = useMemo(() => {
    if (!searchQuery) return installedApps;
    return installedApps.filter(
      (a) =>
        a.name.includes(searchQuery) ||
        a.description.includes(searchQuery) ||
        a.tags.some((t) => t.includes(searchQuery))
    );
  }, [searchQuery, installedApps]);

  // All apps for sidebar (installed first, then available)
  const allAppsForList = useMemo(() => {
    if (!searchQuery) return appItems;
    return appItems.filter(
      (a) =>
        a.name.includes(searchQuery) ||
        a.description.includes(searchQuery) ||
        a.tags.some((t) => t.includes(searchQuery))
    );
  }, [searchQuery]);

  const selectedApp = appItems.find((a) => a.id === selectedAppId);
  const selectedSession = mockSessions.find((s) => s.appId === selectedAppId);

  const handleDragStart = useCallback((appId: string) => {
    dragItemRef.current = appId;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, appId: string) => {
    e.preventDefault();
    setDragOverId(appId);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (dragItemRef.current) {
      setSelectedAppId(dragItemRef.current);
    }
    setDragOverId(null);
    dragItemRef.current = null;
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragOverId(null);
    dragItemRef.current = null;
  }, []);

  const runningCount = mockSessions.filter((s) => s.status === "running").length;

  // Mobile: select app and switch to content view
  const handleSelectApp = useCallback((appId: string) => {
    setSelectedAppId(appId);
    setMobileShowContent(true);
  }, []);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left: App List Sidebar */}
      <div
        className={`border-r border-white/10 flex flex-col shrink-0 transition-all duration-200 ${
          mobileShowContent ? "hidden md:flex" : "flex w-full md:w-auto"
        } ${
          sidebarCollapsed ? "md:w-14" : "md:w-72"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-white/10 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <h3 className="text-white text-sm" style={{ fontWeight: 600 }}>
                应用列表
              </h3>
              <Badge
                variant="outline"
                className="text-[10px] py-0 text-green-400 bg-green-500/10 border-green-500/20"
              >
                {runningCount} 运行中
              </Badge>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-neutral-500 hover:text-white p-1 rounded transition-colors"
          >
            {sidebarCollapsed ? (
              <Maximize2 className="h-3.5 w-3.5" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* Search */}
        {!sidebarCollapsed && (
          <div className="p-2 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <Input
                placeholder="搜索应用..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-neutral-600 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* App List */}
        <div
          className="flex-1 overflow-y-auto"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* Active Sessions Section */}
          <div className={`px-2 pt-2 ${sidebarCollapsed ? "md:hidden" : ""}`}>
            <span
              className="text-neutral-600 text-[10px] px-2 uppercase tracking-wider"
              style={{ fontWeight: 600 }}
            >
              活跃会话
            </span>
          </div>
          <div className="p-1">
            {mockSessions.map((session) => {
              const app = appItems.find((a) => a.id === session.appId);
              if (!app) return null;
              const isSelected = selectedAppId === session.appId;
              const ptCfg = appProductTypeConfig[app.productType];
              return (
                <button
                  key={session.appId}
                  draggable
                  onDragStart={() => handleDragStart(session.appId)}
                  onDragOver={(e) => handleDragOver(e, session.appId)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleSelectApp(session.appId)}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors mb-0.5 ${
                    isSelected
                      ? "bg-white/10 border border-white/10"
                      : dragOverId === session.appId
                      ? "bg-white/5 border border-dashed border-white/20"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                  title={sidebarCollapsed ? app.name : undefined}
                >
                  <GripVertical className={`h-3 w-3 text-neutral-700 shrink-0 cursor-grab ${sidebarCollapsed ? "md:hidden" : ""}`} />
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${ptCfg?.color || "text-neutral-400 bg-white/5"}`}
                  >
                    {iconMap[app.icon] || <Zap className="h-4 w-4" />}
                  </div>
                  <div className={`flex-1 min-w-0 ${sidebarCollapsed ? "md:hidden" : ""}`}>
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-white text-xs truncate"
                        style={{ fontWeight: 500 }}
                      >
                        {app.name}
                      </span>
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          session.status === "running"
                            ? "bg-green-400 animate-pulse"
                            : session.status === "paused"
                            ? "bg-amber-400"
                            : "bg-neutral-600"
                        }`}
                      />
                    </div>
                    <span className="text-neutral-600 text-[10px]">
                      {session.startedAt}
                    </span>
                  </div>
                  <ChevronRight className={`h-3 w-3 text-neutral-700 shrink-0 ${sidebarCollapsed ? "md:hidden" : ""}`} />
                </button>
              );
            })}
          </div>

          {/* All Apps Section */}
          <div className={sidebarCollapsed ? "md:hidden" : ""}>
            <div className="px-2 pt-3">
              <span
                className="text-neutral-600 text-[10px] px-2 uppercase tracking-wider"
                style={{ fontWeight: 600 }}
              >
                已安装应用 ({installedApps.length})
              </span>
            </div>
            <div className="p-1">
              {filteredApps
                .filter(
                  (a) => !mockSessions.find((s) => s.appId === a.id)
                )
                .map((app) => {
                  const isSelected = selectedAppId === app.id;
                  const ptCfg = appProductTypeConfig[app.productType];
                  return (
                    <button
                      key={app.id}
                      draggable
                      onDragStart={() => handleDragStart(app.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => handleSelectApp(app.id)}
                      className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors mb-0.5 ${
                        isSelected
                          ? "bg-white/10 border border-white/10"
                          : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <GripVertical className="h-3 w-3 text-neutral-700 shrink-0 cursor-grab" />
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${ptCfg?.color || "text-neutral-400 bg-white/5"}`}
                      >
                        {iconMap[app.icon] || <Zap className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-neutral-400 text-xs truncate block"
                          style={{ fontWeight: 500 }}
                        >
                          {app.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Right: App Content Area */}
      <div className={`flex-1 flex flex-col overflow-hidden ${
        mobileShowContent ? "flex" : "hidden md:flex"
      }`}>
        <AnimatePresence mode="wait">
          {selectedApp ? (
            <motion.div
              key={selectedApp.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* App Top Bar */}
              <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Mobile back button */}
                  <button
                    className="md:hidden text-neutral-400 hover:text-white p-1.5 -ml-1 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                    onClick={() => setMobileShowContent(false)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      appProductTypeConfig[selectedApp.productType]?.color ||
                      "text-neutral-400 bg-white/5"
                    }`}
                  >
                    {iconMap[selectedApp.icon] || (
                      <Zap className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2
                        className="text-white text-sm truncate"
                        style={{ fontWeight: 600 }}
                      >
                        {selectedApp.name}
                      </h2>
                      <Badge
                        variant="outline"
                        className={`text-[10px] py-0 hidden sm:inline-flex ${
                          appProductTypeConfig[selectedApp.productType]
                            ?.color || ""
                        }`}
                      >
                        {appProductTypeConfig[selectedApp.productType]
                          ?.label || ""}
                      </Badge>
                      {selectedSession && (
                        <Badge
                          variant="outline"
                          className={`text-[10px] py-0 ${
                            selectedSession.status === "running"
                              ? "text-green-400 bg-green-500/10 border-green-500/20"
                              : "text-neutral-500 bg-white/5 border-white/10"
                          }`}
                        >
                          {selectedSession.status === "running"
                            ? "运行中"
                            : selectedSession.status === "paused"
                            ? "已暂停"
                            : "空闲"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-neutral-500 text-xs mt-0.5 truncate">
                      {selectedApp.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {selectedApp.status === "installed" ? (
                    <>
                      {selectedSession?.status === "running" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/10 text-neutral-400 bg-transparent hover:text-white h-8 text-xs"
                        >
                          <Settings className="h-3.5 w-3.5 mr-1.5" />
                          配置
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="bg-white text-black hover:bg-neutral-200 h-8 text-xs"
                        >
                          <Play className="h-3.5 w-3.5 mr-1.5" />
                          启动
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-neutral-200 h-8 text-xs"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      安装
                    </Button>
                  )}
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="max-w-3xl mx-auto">
                  {/* Status Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                      {
                        label: "状态",
                        value: selectedSession?.status === "running" ? "运行中" : selectedApp.status === "installed" ? "已安装" : "未安装",
                        color: selectedSession?.status === "running" ? "text-green-400" : "text-neutral-400",
                      },
                      {
                        label: "评分",
                        value: selectedApp.rating.toString(),
                        color: "text-amber-400",
                      },
                      {
                        label: "安装量",
                        value: (selectedApp.downloads / 1000).toFixed(1) + "K",
                        color: "text-white",
                      },
                      {
                        label: "版本",
                        value: "v" + selectedApp.version,
                        color: "text-neutral-400",
                      },
                    ].map((stat) => (
                      <Card
                        key={stat.label}
                        className="bg-white/5 border-white/10 text-white"
                      >
                        <CardContent className="p-3">
                          <div className="text-neutral-600 text-[10px] mb-0.5">
                            {stat.label}
                          </div>
                          <div
                            className={`text-sm ${stat.color}`}
                            style={{ fontWeight: 600 }}
                          >
                            {stat.value}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* App Interface Placeholder */}
                  <Card className="bg-white/[0.03] border-white/10 text-white mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3
                          className="text-white text-sm"
                          style={{ fontWeight: 600 }}
                        >
                          应用界面
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-neutral-500 hover:text-white h-7 text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          新窗口打开
                        </Button>
                      </div>

                      {/* Mock App Interface */}
                      <div className="rounded-lg border border-white/10 bg-black/50 min-h-[320px] flex flex-col items-center justify-center gap-4 p-8">
                        <div
                          className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                            appProductTypeConfig[selectedApp.productType]
                              ?.color || "text-neutral-400 bg-white/5"
                          }`}
                        >
                          {iconMap[selectedApp.icon] ? (
                            <div className="scale-150">
                              {iconMap[selectedApp.icon]}
                            </div>
                          ) : (
                            <Zap className="h-8 w-8" />
                          )}
                        </div>
                        <div className="text-center">
                          <h4
                            className="text-white text-sm mb-1"
                            style={{ fontWeight: 500 }}
                          >
                            {selectedApp.name}
                          </h4>
                          <p className="text-neutral-600 text-xs max-w-sm">
                            {selectedSession?.status === "running"
                              ? "应用正在运行中，点击下方按钮开始交互"
                              : "点击「启动」按钮开始使用此应用"}
                          </p>
                        </div>
                        {selectedSession?.status === "running" && (
                          <Button
                            size="sm"
                            className="bg-white text-black hover:bg-neutral-200 text-xs mt-2"
                          >
                            开始交互
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Features & Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-white/[0.03] border-white/10 text-white">
                      <CardContent className="p-5">
                        <h3
                          className="text-white text-sm mb-3"
                          style={{ fontWeight: 600 }}
                        >
                          核心功能
                        </h3>
                        <div className="space-y-2">
                          {selectedApp.features.map((f) => (
                            <div
                              key={f}
                              className="flex items-center gap-2 text-sm"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                              <span className="text-neutral-300">{f}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-white/[0.03] border-white/10 text-white">
                      <CardContent className="p-5">
                        <h3
                          className="text-white text-sm mb-3"
                          style={{ fontWeight: 600 }}
                        >
                          应用信息
                        </h3>
                        <div className="space-y-2.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-500">
                              业务形态
                            </span>
                            <span className="text-neutral-300">
                              {selectedApp.businessType}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-500">作者</span>
                            <span className="text-neutral-300">
                              {selectedApp.author}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-500">版本</span>
                            <span className="text-neutral-300">
                              v{selectedApp.version}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-500">
                              最后更新
                            </span>
                            <span className="text-neutral-300">
                              {selectedApp.lastUpdated}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-neutral-500">
                              评价
                            </span>
                            <span className="text-neutral-300 flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-400" />
                              {selectedApp.rating} ({selectedApp.ratingCount})
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/5">
                          <div className="flex flex-wrap gap-1">
                            {selectedApp.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-600">
              <div className="text-center">
                <Zap className="h-10 w-10 mx-auto mb-3 text-neutral-700" />
                <p className="text-sm">从左侧选择一个应用开始使用</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}