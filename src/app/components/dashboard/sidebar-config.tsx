import {
  Bot,
  Users,
  ListChecks,
  ScrollText,
  Settings,
  BookOpen,
  AppWindow,
  Brain,
  Search,
  Pen,
  Target,
  BarChart3,
} from "lucide-react";

export type SidebarItemKey =
  | "brain"
  | "agents"
  | "teams"
  | "tasks"
  | "apps"
  | "knowledge"
  | "logs"
  | "settings";

export interface SidebarItem {
  key: SidebarItemKey;
  icon: React.ReactNode;
  label: string;
  path: string;
  special?: boolean;
}

export const sidebarItems: SidebarItem[] = [
  { key: "brain", icon: <Brain className="h-4 w-4" />, label: "全局大脑", path: "/dashboard/brain", special: true },
  { key: "agents", icon: <Bot className="h-4 w-4" />, label: "员工管理", path: "/dashboard/agents" },
  { key: "teams", icon: <Users className="h-4 w-4" />, label: "团队管理", path: "/dashboard/teams" },
  { key: "tasks", icon: <ListChecks className="h-4 w-4" />, label: "任务中心", path: "/dashboard/tasks" },
  { key: "apps", icon: <AppWindow className="h-4 w-4" />, label: "应用看板", path: "/dashboard/apps" },
  { key: "knowledge", icon: <BookOpen className="h-4 w-4" />, label: "知识库", path: "/dashboard/knowledge" },
  { key: "logs", icon: <ScrollText className="h-4 w-4" />, label: "执行日志", path: "/dashboard/logs" },
  { key: "settings", icon: <Settings className="h-4 w-4" />, label: "设置", path: "/dashboard/settings" },
];

export const agentIcons: Record<string, React.ReactNode> = {
  "小研": <Search className="h-4 w-4" />,
  "小文": <Pen className="h-4 w-4" />,
  "小拓": <Target className="h-4 w-4" />,
  "小数": <BarChart3 className="h-4 w-4" />,
};

export const onlineAgents = ["小研", "小文", "小拓", "小数"];
