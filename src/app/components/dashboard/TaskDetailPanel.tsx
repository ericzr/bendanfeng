import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { DashboardTask } from "../../types";

const statusConfig = {
  running: { label: "运行中", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  done: { label: "已完成", color: "text-neutral-300 bg-white/10 border-white/20" },
  pending: { label: "等待中", color: "text-neutral-500 bg-white/5 border-white/10" },
};

interface TaskDetailPanelProps {
  task: DashboardTask;
}

export function TaskDetailPanel({ task }: TaskDetailPanelProps) {
  return (
    <div className="hidden md:flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-white truncate" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                {task.name}
              </h2>
              <div className="flex items-center gap-x-3 gap-y-1 mt-1 flex-wrap">
                <span className="text-neutral-500 text-sm">执行者：{task.agent}</span>
                <span className="text-neutral-500 text-sm">开始时间：{task.startTime}</span>
                <Badge variant="outline" className={`text-xs py-0 ${statusConfig[task.status].color}`}>
                  {statusConfig[task.status].label}
                </Badge>
              </div>
            </div>
            {task.status !== "done" && (
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

          {task.status !== "pending" && (
            <div>
              <div className="flex justify-between text-xs text-neutral-500 mb-1">
                <span>执行进度</span>
                <span>{task.progress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-neutral-500 text-sm mb-4" style={{ fontWeight: 600 }}>执行日志</h3>
        <div className="space-y-2">
          {task.logs.map((log, i) => (
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

      {/* Output */}
      {task.status === "done" && (
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
  );
}
