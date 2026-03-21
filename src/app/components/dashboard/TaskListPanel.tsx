import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { DashboardTask } from "../../types";

const statusConfig = {
  running: { label: "运行中", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  done: { label: "已完成", color: "text-neutral-300 bg-white/10 border-white/20" },
  pending: { label: "等待中", color: "text-neutral-500 bg-white/5 border-white/10" },
};

interface TaskListPanelProps {
  tasks: DashboardTask[];
  selectedTaskId: string;
  onSelectTask: (id: string) => void;
  onNewTask: () => void;
}

export function TaskListPanel({ tasks, selectedTaskId, onSelectTask, onNewTask }: TaskListPanelProps) {
  return (
    <div className="w-full md:w-80 border-r border-white/10 overflow-y-auto shrink-0">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white" style={{ fontWeight: 600 }}>任务中心</h2>
          <Button size="sm" className="bg-white text-black hover:bg-neutral-200 h-7 text-xs" onClick={onNewTask}>
            + 新任务
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "运行中", value: String(tasks.filter(t => t.status === "running").length), color: "text-green-400" },
            { label: "已完成", value: String(tasks.filter(t => t.status === "done").length), color: "text-neutral-300" },
            { label: "等待中", value: String(tasks.filter(t => t.status === "pending").length), color: "text-neutral-500" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-lg bg-white/5">
              <div className={stat.color} style={{ fontWeight: 600 }}>{stat.value}</div>
              <div className="text-neutral-600 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-2">
        {tasks.map((task) => {
          const config = statusConfig[task.status];
          return (
            <button
              key={task.id}
              onClick={() => onSelectTask(task.id)}
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
  );
}
