import { useState } from "react";
import {
  Search,
  Pen,
  Target,
  BarChart3,
  Sparkles,
  Bot,
  Plus,
  Power,
  MoreVertical,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { deployedAgents } from "../../data/mock-data";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { DeployAgentView } from "./DeployAgentView";

const agentIcons: Record<string, React.ReactNode> = {
  "小研": <Search className="h-5 w-5" />,
  "小文": <Pen className="h-5 w-5" />,
  "小拓": <Target className="h-5 w-5" />,
  "小数": <BarChart3 className="h-5 w-5" />,
  "小媒": <Sparkles className="h-5 w-5" />,
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  online: { label: "在线", color: "text-green-400 bg-green-500/10 border-green-500/20", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  busy: { label: "忙碌", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: <Clock className="h-3.5 w-3.5" /> },
  offline: { label: "离线", color: "text-neutral-500 bg-white/5 border-white/10", icon: <Power className="h-3.5 w-3.5" /> },
  error: { label: "异常", color: "text-red-400 bg-red-500/10 border-red-500/20", icon: <XCircle className="h-3.5 w-3.5" /> },
};

export function AgentManageView({ onSelectAgent }: { onSelectAgent: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeploy, setShowDeploy] = useState(false);

  const filtered = deployedAgents.filter(
    (a) => !searchQuery || a.name.includes(searchQuery) || a.role.includes(searchQuery)
  );

  const onlineCount = deployedAgents.filter((a) => a.status === "online").length;
  const busyCount = deployedAgents.filter((a) => a.status === "busy").length;
  const errorCount = deployedAgents.filter((a) => a.status === "error").length;
  const totalTasks = deployedAgents.reduce((s, a) => s + a.tasksCompleted, 0);

  if (showDeploy) {
    return (
      <DeployAgentView
        onBack={() => setShowDeploy(false)}
        onDeploySuccess={() => setShowDeploy(false)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>员工管理</h2>
            <p className="text-neutral-500 text-sm mt-1">管理已部署的 AI 员工，监控状态与配置</p>
          </div>
          <Button className="bg-white text-black hover:bg-neutral-200 w-full sm:w-auto" onClick={() => setShowDeploy(true)}>
            <Plus className="h-4 w-4" />
            部署新员工
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "总员工数", value: deployedAgents.length, icon: <Bot className="h-4 w-4 text-white" />, bg: "bg-white/5 border-white/10" },
            { label: "在线/忙碌", value: `${onlineCount}/${busyCount}`, icon: <CheckCircle2 className="h-4 w-4 text-green-400" />, bg: "bg-green-500/5 border-green-500/20" },
            { label: "异常", value: errorCount, icon: <AlertTriangle className="h-4 w-4 text-red-400" />, bg: "bg-red-500/5 border-red-500/20" },
            { label: "累计任务", value: totalTasks, icon: <TrendingUp className="h-4 w-4 text-neutral-400" />, bg: "bg-white/5 border-white/10" },
          ].map((stat) => (
            <div key={stat.label} className={`flex items-center gap-3 p-3 rounded-xl border ${stat.bg}`}>
              {stat.icon}
              <div>
                <div className="text-white" style={{ fontWeight: 600 }}>{stat.value}</div>
                <div className="text-neutral-500 text-xs">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 pb-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            type="text"
            placeholder="搜索员工..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:border-white/30 focus-visible:ring-white/20"
          />
        </div>
      </div>

      <div className="p-6 space-y-3">
        {filtered.map((agent, i) => {
          const st = statusConfig[agent.status];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectAgent(agent.id)}
              className="group rounded-xl border border-white/10 bg-neutral-950 p-4 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                  {agentIcons[agent.name] || <Bot className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                    <span className="text-white" style={{ fontWeight: 600 }}>{agent.name}</span>
                    <span className="text-neutral-500 text-sm hidden sm:inline">{agent.role}</span>
                    <Badge variant="outline" className={`${st.color} gap-1`}>
                      {st.icon}
                      {st.label}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 text-xs text-neutral-500 mt-2">
                    <span>已完成 <span className="text-neutral-300">{agent.tasksCompleted}</span> 个任务</span>
                    <span>执行中 <span className="text-neutral-300">{agent.tasksRunning}</span></span>
                    <span className="hidden sm:inline">成功率 <span className="text-neutral-300">{agent.successRate}%</span></span>
                    <span className="hidden sm:inline">平均耗时 <span className="text-neutral-300">{agent.avgResponseTime}</span></span>
                    <span className="hidden md:inline">最后活跃 <span className="text-neutral-300">{agent.lastActive}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  {agent.status === "offline" ? (
                    <Button size="sm" variant="outline" className="h-7 text-xs border-green-500/20 text-green-400 hover:bg-green-500/10 bg-transparent">启动</Button>
                  ) : agent.status === "error" ? (
                    <Button size="sm" variant="outline" className="h-7 text-xs border-amber-500/20 text-amber-400 hover:bg-amber-500/10 bg-transparent">重启</Button>
                  ) : (
                    <Button size="sm" variant="outline" className="h-7 text-xs border-white/10 text-neutral-400 hover:text-white bg-transparent">暂停</Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-500 hover:text-neutral-300">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 ml-14 sm:ml-16">
                <div className="flex justify-between text-xs text-neutral-600 mb-1">
                  <span>成功率</span>
                  <span className="text-neutral-400">{agent.successRate}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${agent.successRate}%`, opacity: agent.successRate >= 98 ? 1 : agent.successRate >= 95 ? 0.7 : 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}