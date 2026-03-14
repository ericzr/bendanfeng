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
} from "lucide-react";
import { managedTeams, teams } from "../../data/mock-data";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
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
                          <Button className="flex-1 bg-white text-black hover:bg-neutral-200" size="sm">分配任务</Button>
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