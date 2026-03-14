import { useState } from "react";
import {
  Plus,
  Pause,
  Trash2,
  Edit3,
  CheckCircle2,
  Users,
  ListChecks,
  ChevronDown,
  ChevronUp,
  Workflow,
  Send,
  Clock,
  Zap,
  AlertTriangle,
  ArrowUp,
  Minus,
  ArrowDown,
  Sparkles,
  X,
} from "lucide-react";
import { managedTeams, teams, type ManagedTeam } from "../../data/mock-data";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { WorkflowEditor } from "../WorkflowEditor";
import { CreateTeamView } from "./CreateTeamView";

const statusDot: Record<string, string> = {
  online: "bg-green-400",
  busy: "bg-amber-400",
  offline: "bg-neutral-500",
  error: "bg-red-400",
};

const teamStatusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active: { label: "运行中", color: "text-green-400 bg-green-500/10 border-green-500/20", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  paused: { label: "已暂停", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", icon: <Pause className="h-3.5 w-3.5" /> },
  draft: { label: "草稿", color: "text-neutral-400 bg-white/5 border-white/10", icon: <Edit3 className="h-3.5 w-3.5" /> },
};

export function TeamManageView() {
  const [expandedTeam, setExpandedTeam] = useState<string | null>(managedTeams[0].id);
  const [workflowEditorTeam, setWorkflowEditorTeam] = useState<{ name: string; workflow: { step: number; title: string; description: string }[] } | null>(null);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [assignTaskTeam, setAssignTaskTeam] = useState<typeof managedTeams[0] | null>(null);
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"urgent" | "high" | "medium" | "low">("medium");
  const [taskMode, setTaskMode] = useState<"now" | "schedule">("now");
  const [taskAssignees, setTaskAssignees] = useState<Set<string>>(new Set());
  const [taskSubmitted, setTaskSubmitted] = useState(false);

  const openAssignTask = (team: typeof managedTeams[0]) => {
    setAssignTaskTeam(team);
    setTaskDesc("");
    setTaskPriority("medium");
    setTaskMode("now");
    setTaskAssignees(new Set(team.members.map((m) => m.name)));
    setTaskSubmitted(false);
  };

  const closeAssignTask = () => {
    setAssignTaskTeam(null);
    setTaskSubmitted(false);
  };

  const handleSubmitTask = () => {
    setTaskSubmitted(true);
    setTimeout(() => closeAssignTask(), 1500);
  };

  const activeCount = managedTeams.filter((t) => t.status === "active").length;
  const totalMembers = managedTeams.reduce((s, t) => s + t.members.length, 0);
  const totalTasksToday = managedTeams.reduce((s, t) => s + t.tasksToday, 0);

  if (showCreateTeam) {
    return (
      <CreateTeamView
        onBack={() => setShowCreateTeam(false)}
        onCreateSuccess={() => setShowCreateTeam(false)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 border-b border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>团队管理</h2>
            <p className="text-neutral-500 text-sm mt-1">编排 AI 团队，管理成员与协作流程</p>
          </div>
          <Button className="bg-white text-black hover:bg-neutral-200 w-full sm:w-auto" onClick={() => setShowCreateTeam(true)}>
            <Plus className="h-4 w-4" />
            创建新团队
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: "活跃团队", value: activeCount, icon: <Users className="h-4 w-4 text-white" /> },
            { label: "团队成员", value: totalMembers, icon: <Users className="h-4 w-4 text-neutral-400" /> },
            { label: "今日任务", value: totalTasksToday, icon: <ListChecks className="h-4 w-4 text-neutral-400" /> },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-neutral-950">
              {s.icon}
              <div>
                <div className="text-white" style={{ fontWeight: 600 }}>{s.value}</div>
                <div className="text-neutral-500 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {managedTeams.map((team, i) => {
          const tst = teamStatusConfig[team.status];
          const isExpanded = expandedTeam === team.id;

          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="bg-neutral-950 border-white/10 overflow-hidden">
                <div
                  className="p-4 sm:p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedTeam(isExpanded ? null : team.id)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-2xl sm:text-3xl shrink-0">{team.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
                        <span className="text-white" style={{ fontSize: "1.125rem", fontWeight: 600 }}>{team.name}</span>
                        <Badge variant="outline" className={`${tst.color} gap-1`}>
                          {tst.icon}
                          {tst.label}
                        </Badge>
                      </div>
                      <p className="text-neutral-500 text-sm">{team.description}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-neutral-500">
                        <span>成员 <span className="text-neutral-300">{team.members.length}</span></span>
                        <span>今日任务 <span className="text-neutral-300">{team.tasksToday}</span></span>
                        <span className="hidden sm:inline">累计 <span className="text-neutral-300">{team.tasksTotal}</span></span>
                        <span className="hidden sm:inline">创建于 <span className="text-neutral-300">{team.createdAt}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <span className="hidden sm:inline-flex">
                      {team.status === "active" ? (
                        <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()} className="h-7 text-xs border-amber-500/20 text-amber-400 hover:bg-amber-500/10 bg-transparent">暂停</Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={(e) => e.stopPropagation()} className="h-7 text-xs border-green-500/20 text-green-400 hover:bg-green-500/10 bg-transparent">启动</Button>
                      )}
                      </span>
                      <Button variant="ghost" size="icon" onClick={(e) => {
                        e.stopPropagation();
                        const matchedTeam = teams.find((t) => t.name === team.name);
                        const workflow = matchedTeam
                          ? matchedTeam.teamWorkflow.map((w) => ({ step: w.step, title: w.title, description: w.description }))
                          : team.members.map((m, idx) => ({ step: idx + 1, title: m.name, description: m.role }));
                        setWorkflowEditorTeam({ name: team.name, workflow });
                      }} className="h-7 w-7 text-neutral-600 hover:text-neutral-400">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-neutral-600" /> : <ChevronDown className="h-4 w-4 text-neutral-600" />}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="px-5 pb-5 border-t border-white/5 pt-4">
                        <h4 className="text-neutral-500 text-xs mb-3" style={{ fontWeight: 600 }}>团队成员</h4>
                        <div className="space-y-2 mb-5">
                          {team.members.map((m) => (
                            <div key={m.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                              <span className={`w-2 h-2 rounded-full ${statusDot[m.status]}`} />
                              <div className="flex-1 min-w-0">
                                <span className="text-neutral-300 text-sm">{m.name}</span>
                                <span className="text-neutral-600 text-xs ml-2">{m.role}</span>
                              </div>
                              <button className="text-neutral-600 hover:text-red-400 text-xs transition-colors">移除</button>
                            </div>
                          ))}
                        </div>

                        <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-white/10 text-neutral-500 hover:text-neutral-300 hover:border-white/20 transition-colors w-full justify-center text-sm mb-5">
                          <Plus className="h-3.5 w-3.5" />
                          添加成员
                        </button>

                        <div className="flex gap-2">
                          <Button className="flex-1 bg-white text-black hover:bg-neutral-200" size="sm" onClick={() => openAssignTask(team)}>分配任务</Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-white/10 text-neutral-400 hover:text-white bg-transparent"
                            size="sm"
                            onClick={() => {
                              const matchedTeam = teams.find((t) => t.name === team.name);
                              const workflow = matchedTeam
                                ? matchedTeam.teamWorkflow.map((w) => ({ step: w.step, title: w.title, description: w.description }))
                                : team.members.map((m, idx) => ({ step: idx + 1, title: m.name, description: m.role }));
                              setWorkflowEditorTeam({ name: team.name, workflow });
                            }}
                          >
                            <Workflow className="h-3.5 w-3.5 mr-1" />
                            编辑工作流
                          </Button>
                          <Button variant="outline" size="icon" className="border-red-500/10 text-red-400/60 hover:bg-red-500/10 hover:text-red-400 bg-transparent h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Assign Task Dialog */}
      <AnimatePresence>
        {assignTaskTeam && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeAssignTask} />
            <motion.div
              className="relative w-full max-w-lg bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              {taskSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 px-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <CheckCircle2 className="h-12 w-12 text-green-400 mb-4" />
                  </motion.div>
                  <h3 className="text-white text-lg mb-1" style={{ fontWeight: 600 }}>任务已分配</h3>
                  <p className="text-neutral-500 text-sm">已成功分配给 {assignTaskTeam.name}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{assignTaskTeam.icon}</span>
                      <div>
                        <h3 className="text-white text-sm" style={{ fontWeight: 600 }}>分配任务</h3>
                        <p className="text-neutral-500 text-xs">{assignTaskTeam.name}</p>
                      </div>
                    </div>
                    <button onClick={closeAssignTask} className="text-neutral-500 hover:text-white transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Task Description */}
                    <div>
                      <label className="text-neutral-400 text-xs mb-2 block" style={{ fontWeight: 500 }}>任务描述</label>
                      <textarea
                        value={taskDesc}
                        onChange={(e) => setTaskDesc(e.target.value)}
                        placeholder="描述你希望团队完成的任务..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 resize-none focus:outline-none focus:border-white/20 transition-colors"
                        rows={3}
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="text-neutral-400 text-xs mb-2 block" style={{ fontWeight: 500 }}>优先级</label>
                      <div className="grid grid-cols-4 gap-2">
                        {([
                          { key: "urgent" as const, label: "紧急", icon: <AlertTriangle className="h-3.5 w-3.5" />, color: "text-red-400 border-red-500/30 bg-red-500/10" },
                          { key: "high" as const, label: "高", icon: <ArrowUp className="h-3.5 w-3.5" />, color: "text-orange-400 border-orange-500/30 bg-orange-500/10" },
                          { key: "medium" as const, label: "中", icon: <Minus className="h-3.5 w-3.5" />, color: "text-blue-400 border-blue-500/30 bg-blue-500/10" },
                          { key: "low" as const, label: "低", icon: <ArrowDown className="h-3.5 w-3.5" />, color: "text-neutral-400 border-white/10 bg-white/5" },
                        ]).map((p) => (
                          <button
                            key={p.key}
                            onClick={() => setTaskPriority(p.key)}
                            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all ${
                              taskPriority === p.key ? p.color : "text-neutral-500 border-white/5 bg-transparent hover:border-white/10"
                            }`}
                          >
                            {p.icon}
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Execution Mode */}
                    <div>
                      <label className="text-neutral-400 text-xs mb-2 block" style={{ fontWeight: 500 }}>执行方式</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setTaskMode("now")}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm transition-all ${
                            taskMode === "now"
                              ? "text-white border-white/20 bg-white/5"
                              : "text-neutral-500 border-white/5 hover:border-white/10"
                          }`}
                        >
                          <Zap className="h-4 w-4" />
                          <div className="text-left">
                            <div style={{ fontWeight: 500 }}>立即执行</div>
                            <div className="text-[10px] text-neutral-600">分配后自动开始</div>
                          </div>
                        </button>
                        <button
                          onClick={() => setTaskMode("schedule")}
                          className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm transition-all ${
                            taskMode === "schedule"
                              ? "text-white border-white/20 bg-white/5"
                              : "text-neutral-500 border-white/5 hover:border-white/10"
                          }`}
                        >
                          <Clock className="h-4 w-4" />
                          <div className="text-left">
                            <div style={{ fontWeight: 500 }}>定时执行</div>
                            <div className="text-[10px] text-neutral-600">设定执行时间</div>
                          </div>
                        </button>
                      </div>
                      {taskMode === "schedule" && (
                        <Input
                          type="datetime-local"
                          className="mt-2 bg-white/5 border-white/10 text-white text-sm"
                        />
                      )}
                    </div>

                    {/* Assignees */}
                    <div>
                      <label className="text-neutral-400 text-xs mb-2 block" style={{ fontWeight: 500 }}>
                        执行成员
                        <span className="text-neutral-600 ml-1">（已选 {taskAssignees.size}/{assignTaskTeam.members.length}）</span>
                      </label>
                      <div className="space-y-1.5">
                        {assignTaskTeam.members.map((m) => {
                          const checked = taskAssignees.has(m.name);
                          return (
                            <button
                              key={m.name}
                              onClick={() => {
                                const next = new Set(taskAssignees);
                                if (checked) next.delete(m.name);
                                else next.add(m.name);
                                setTaskAssignees(next);
                              }}
                              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border text-sm transition-all ${
                                checked
                                  ? "border-white/15 bg-white/5 text-white"
                                  : "border-white/5 text-neutral-500 hover:border-white/10"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                checked ? "bg-white border-white" : "border-neutral-600"
                              }`}>
                                {checked && <CheckCircle2 className="h-3 w-3 text-black" />}
                              </div>
                              <span className={`w-2 h-2 rounded-full ${statusDot[m.status]}`} />
                              <span>{m.name}</span>
                              <span className="text-neutral-600 text-xs">{m.role}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex gap-2 px-6 py-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      className="flex-1 border-white/10 text-neutral-400 hover:text-white bg-transparent"
                      onClick={closeAssignTask}
                    >
                      取消
                    </Button>
                    <Button
                      className="flex-1 bg-white text-black hover:bg-neutral-200"
                      disabled={!taskDesc.trim() || taskAssignees.size === 0}
                      onClick={handleSubmitTask}
                    >
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      分配任务
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {workflowEditorTeam && (
        <WorkflowEditor
          agentName={workflowEditorTeam.name}
          initialWorkflow={workflowEditorTeam.workflow}
          onClose={() => setWorkflowEditorTeam(null)}
        />
      )}
    </div>
  );
}