import { useState } from "react";
import {
  Search,
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react";
import { executionLogs } from "../../data/mock-data";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

const levelConfig = {
  info: { label: "信息", icon: <Info className="h-3.5 w-3.5" />, color: "text-neutral-400", bg: "bg-white/5 border-white/10", dot: "bg-neutral-400" },
  success: { label: "成功", icon: <CheckCircle2 className="h-3.5 w-3.5" />, color: "text-white", bg: "bg-white/10 border-white/20", dot: "bg-white" },
  warning: { label: "警告", icon: <AlertTriangle className="h-3.5 w-3.5" />, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", dot: "bg-amber-400" },
  error: { label: "错误", icon: <XCircle className="h-3.5 w-3.5" />, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", dot: "bg-red-400" },
};

const levelFilters = ["全部", "info", "success", "warning", "error"] as const;

export function ExecutionLogsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("全部");
  const [agentFilter, setAgentFilter] = useState<string>("全部");

  const uniqueAgents = [...new Set(executionLogs.map((l) => l.agent))];

  const filtered = executionLogs.filter((log) => {
    const matchLevel = levelFilter === "全部" || log.level === levelFilter;
    const matchAgent = agentFilter === "全部" || log.agent === agentFilter;
    const matchSearch = !searchQuery || log.message.includes(searchQuery) || log.taskName.includes(searchQuery) || log.agent.includes(searchQuery);
    return matchLevel && matchAgent && matchSearch;
  });

  const infoCount = executionLogs.filter((l) => l.level === "info").length;
  const successCount = executionLogs.filter((l) => l.level === "success").length;
  const warningCount = executionLogs.filter((l) => l.level === "warning").length;
  const errorCount = executionLogs.filter((l) => l.level === "error").length;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>执行日志</h2>
            <p className="text-neutral-500 text-sm mt-1">查看所有 AI 员工的执行记录与状态</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-white/10 text-neutral-400 hover:text-white bg-transparent">
              <RefreshCw className="h-3.5 w-3.5" /> 刷新
            </Button>
            <Button variant="outline" size="sm" className="border-white/10 text-neutral-400 hover:text-white bg-transparent">
              <Download className="h-3.5 w-3.5" /> 导出
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: "信息", value: infoCount, color: "text-neutral-400", bg: "bg-white/5 border-white/10" },
            { label: "成功", value: successCount, color: "text-white", bg: "bg-white/10 border-white/20" },
            { label: "警告", value: warningCount, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
            { label: "错误", value: errorCount, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          ].map((s) => (
            <div key={s.label} className={`text-center p-3 rounded-xl border ${s.bg}`}>
              <div className={s.color} style={{ fontSize: "1.25rem", fontWeight: 700 }}>{s.value}</div>
              <div className="text-neutral-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              type="text"
              placeholder="搜索日志..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:border-white/30 focus-visible:ring-white/20"
            />
          </div>
          <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
            {levelFilters.map((f) => (
              <button
                key={f}
                onClick={() => setLevelFilter(f)}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  levelFilter === f ? "bg-white/10 text-white" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {f === "全部" ? "全部" : levelConfig[f].label}
              </button>
            ))}
          </div>
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 focus:outline-none text-sm appearance-none min-w-[100px]"
          >
            <option value="全部">全部员工</option>
            {uniqueAgents.map((a) => (<option key={a} value={a}>{a}</option>))}
          </select>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-1">
          {filtered.map((log, i) => {
            const lc = levelConfig[log.level];
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`px-3 sm:px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors group ${
                  log.level === "error" ? "bg-red-500/[0.03]" : log.level === "warning" ? "bg-amber-500/[0.02]" : ""
                }`}
              >
                {/* Desktop layout */}
                <div className="hidden sm:flex items-start gap-3">
                  <div className="flex flex-col items-center pt-1.5 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${lc.dot}`} />
                    {i < filtered.length - 1 && <div className="w-px h-full bg-white/5 mt-1" />}
                  </div>
                  <span className="text-neutral-600 text-xs font-mono w-36 shrink-0 pt-0.5">{log.timestamp}</span>
                  <Badge variant="outline" className={`${lc.bg} ${lc.color} gap-1 shrink-0`}>
                    {lc.icon}
                    {lc.label}
                  </Badge>
                  <span className="text-neutral-400 text-sm shrink-0 w-10">{log.agent}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-neutral-300 text-sm">{log.message}</span>
                    <span className="text-neutral-600 text-xs ml-2">— {log.taskName}</span>
                  </div>
                  {log.duration && (
                    <span className="text-neutral-600 text-xs shrink-0 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {log.duration}
                    </span>
                  )}
                </div>

                {/* Mobile layout */}
                <div className="flex sm:hidden gap-2.5">
                  <div className="flex flex-col items-center pt-1.5 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${lc.dot}`} />
                    {i < filtered.length - 1 && <div className="w-px h-full bg-white/5 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={`${lc.bg} ${lc.color} gap-1 text-[10px]`}>
                        {lc.icon}
                        {lc.label}
                      </Badge>
                      <span className="text-neutral-400 text-xs">{log.agent}</span>
                      {log.duration && (
                        <span className="text-neutral-600 text-[10px] flex items-center gap-1 ml-auto">
                          <Clock className="h-2.5 w-2.5" />
                          {log.duration}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-neutral-300 text-sm break-words">{log.message}</span>
                      <span className="text-neutral-600 text-xs ml-1">— {log.taskName}</span>
                    </div>
                    <span className="text-neutral-600 text-[10px] font-mono">{log.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
            <p className="text-neutral-500">没有匹配的日志记录</p>
          </div>
        )}
      </div>
    </div>
  );
}