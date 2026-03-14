import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Users,
  Bot,
  Search,
  Pen,
  Target,
  BarChart3,
  Sparkles,
  Package,
  Heart,
  Globe,
  Plus,
  X,
  Workflow,
  Rocket,
  Zap,
  GripVertical,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { agents, deployedAgents } from "../../data/mock-data";
import { WorkflowEditor } from "../WorkflowEditor";

const agentIcons: Record<string, React.ReactNode> = {
  "小研": <Search className="h-4 w-4" />,
  "小文": <Pen className="h-4 w-4" />,
  "小拓": <Target className="h-4 w-4" />,
  "小数": <BarChart3 className="h-4 w-4" />,
  "小媒": <Sparkles className="h-4 w-4" />,
  "小产": <Package className="h-4 w-4" />,
  "小客": <Heart className="h-4 w-4" />,
  "小搜": <Globe className="h-4 w-4" />,
};

const teamEmojis = ["🚀", "📈", "✍️", "💼", "🔬", "🎯", "🛠️", "🧠", "⚡", "🌐", "📊", "🤖"];

type Step = 1 | 2 | 3;

interface WorkflowStep {
  step: number;
  title: string;
  description: string;
}

export function CreateTeamView({ onBack, onCreateSuccess }: { onBack: () => void; onCreateSuccess?: () => void }) {
  const [step, setStep] = useState<Step>(1);

  // Step 1: Team info
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamIcon, setTeamIcon] = useState("🚀");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Step 2: Workflow
  const [teamWorkflow, setTeamWorkflow] = useState<WorkflowStep[]>([
    { step: 1, title: "任务接收", description: "接收并解析任务指令" },
    { step: 2, title: "协同处理", description: "团队成员协同执行" },
    { step: 3, title: "结果汇总", description: "汇总输出最终结果" },
  ]);
  const [showWorkflowEditor, setShowWorkflowEditor] = useState(false);

  // Step 3: Deploy
  const [creating, setCreating] = useState(false);
  const [createDone, setCreateDone] = useState(false);

  // Deployed agent lookup
  const deployedAgentMap = new Map(deployedAgents.map((a) => [a.agentId, a]));
  const availableMembers = agents.filter((a) => deployedAgentMap.has(a.id));

  const filteredMembers = availableMembers.filter((a) => {
    if (memberSearch && !a.name.includes(memberSearch) && !a.role.includes(memberSearch)) return false;
    return true;
  });

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedAgentDetails = agents.filter((a) => selectedMembers.includes(a.id));

  const canProceedStep1 = teamName.trim().length > 0 && selectedMembers.length >= 2;

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      setCreateDone(true);
    }, 2000);
  };

  const handleAddWorkflowStep = () => {
    setTeamWorkflow((prev) => [
      ...prev,
      { step: prev.length + 1, title: "新步骤", description: "描述此步骤的职责" },
    ]);
  };

  const handleRemoveWorkflowStep = (idx: number) => {
    setTeamWorkflow((prev) =>
      prev.filter((_, i) => i !== idx).map((w, i) => ({ ...w, step: i + 1 }))
    );
  };

  const handleUpdateWorkflowStep = (idx: number, field: "title" | "description", value: string) => {
    setTeamWorkflow((prev) =>
      prev.map((w, i) => (i === idx ? { ...w, [field]: value } : w))
    );
  };

  const steps = [
    { num: 1, label: "团队信息" },
    { num: 2, label: "工作流配置" },
    { num: 3, label: "确认创建" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-neutral-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>创建新团队</h2>
            <p className="text-neutral-500 text-sm mt-0.5">组建 AI 员工团队，编排协作工作流</p>
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (s.num === 1) setStep(1);
                  if (s.num === 2 && canProceedStep1) setStep(2);
                  if (s.num === 3 && canProceedStep1) setStep(3);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  step === s.num
                    ? "bg-white text-black"
                    : step > s.num
                      ? "bg-white/10 text-white"
                      : "bg-white/5 text-neutral-600"
                }`}
                style={{ fontWeight: step === s.num ? 600 : 400 }}
              >
                {step > s.num ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">{s.num}</span>
                )}
                {s.label}
              </button>
              {i < steps.length - 1 && (
                <div className={`w-8 h-px ${step > s.num ? "bg-white/30" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ Step 1: Team Info & Members ═══ */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {/* Team basic info */}
            <Card className="bg-white/[0.03] border-white/10 text-white mb-6">
              <CardContent className="p-5">
                <h3 className="text-neutral-400 text-sm mb-4 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                  <Users className="h-4 w-4" />
                  团队信息
                </h3>

                <div className="flex gap-4 mb-4">
                  {/* Emoji picker */}
                  <div className="relative">
                    <label className="text-neutral-500 text-xs mb-1.5 block">图标</label>
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-2xl transition-colors"
                    >
                      {teamIcon}
                    </button>
                    <AnimatePresence>
                      {showEmojiPicker && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-20 top-full left-0 mt-1 p-2 rounded-lg bg-neutral-900 border border-white/10 shadow-2xl grid grid-cols-6 gap-1"
                        >
                          {teamEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => {
                                setTeamIcon(emoji);
                                setShowEmojiPicker(false);
                              }}
                              className={`w-9 h-9 rounded-md flex items-center justify-center text-lg transition-colors ${
                                teamIcon === emoji ? "bg-white/10" : "hover:bg-white/5"
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-neutral-500 text-xs mb-1.5 block">团队名称 <span className="text-red-400">*</span></label>
                      <Input
                        type="text"
                        placeholder="如：AI增长团队、AI内容团队..."
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-500 text-xs mb-1.5 block">团队描述</label>
                      <textarea
                        placeholder="描述团队的目标和核心职能..."
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        rows={2}
                        className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20 focus:outline-none px-3 py-2 text-sm resize-none"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected members */}
            {selectedMembers.length > 0 && (
              <div className="mb-4">
                <label className="text-neutral-500 text-xs mb-2 block">
                  已选成员 <span className="text-neutral-400">({selectedMembers.length})</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedAgentDetails.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/15"
                    >
                      <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-white shrink-0">
                        {agentIcons[agent.name] || <Bot className="h-3.5 w-3.5" />}
                      </div>
                      <span className="text-white text-sm" style={{ fontWeight: 500 }}>{agent.name}</span>
                      <span className="text-neutral-500 text-xs">{agent.role}</span>
                      <button
                        onClick={() => toggleMember(agent.id)}
                        className="p-0.5 rounded hover:bg-white/10 text-neutral-500 hover:text-white transition-colors ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Member selection */}
            <Card className="bg-white/[0.03] border-white/10 text-white">
              <CardContent className="p-5">
                <h3 className="text-neutral-400 text-sm mb-4 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                  <Bot className="h-4 w-4" />
                  选择团队成员
                  <span className="text-neutral-600 ml-1" style={{ fontWeight: 400 }}>（至少 2 名已部署员工）</span>
                </h3>

                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                  <Input
                    type="text"
                    placeholder="搜索员工..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:border-white/30 focus-visible:ring-white/20"
                  />
                </div>

                {availableMembers.length === 0 ? (
                  <div className="text-center py-10">
                    <Bot className="h-8 w-8 text-neutral-700 mx-auto mb-2" />
                    <p className="text-neutral-500 text-sm">暂无已部署的员工</p>
                    <p className="text-neutral-600 text-xs mt-1">请先在「员工管理」中部署 AI 员工</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredMembers.map((agent, i) => {
                      const isSelected = selectedMembers.includes(agent.id);
                      const deployed = deployedAgentMap.get(agent.id);
                      return (
                        <motion.button
                          key={agent.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => toggleMember(agent.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                            isSelected
                              ? "bg-white/[0.06] border border-white/20"
                              : "bg-white/[0.02] border border-white/5 hover:border-white/15"
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? "bg-white text-black" : "bg-white/10 text-white"
                          }`}>
                            {agentIcons[agent.name] || <Bot className="h-4 w-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-sm" style={{ fontWeight: 500 }}>{agent.name}</span>
                              <span className="text-neutral-500 text-xs">{agent.role}</span>
                              {deployed && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-green-400 bg-green-500/10 border-green-500/20">
                                  {deployed.status === "online" ? "在线" : deployed.status === "busy" ? "忙碌" : "离线"}
                                </Badge>
                              )}
                            </div>
                            <div className="flex gap-1.5 mt-1">
                              {agent.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[10px] py-0 px-1.5 text-neutral-500 bg-white/5 border-white/5">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-white border-white"
                              : "border-white/20 bg-transparent"
                          }`}>
                            {isSelected && <Check className="h-3 w-3 text-black" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bottom action */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-neutral-600 text-sm">
                已选 <span className="text-neutral-400">{selectedMembers.length}</span> 名成员
                {selectedMembers.length < 2 && (
                  <span className="ml-2 text-neutral-600">（还需至少 {2 - selectedMembers.length} 名）</span>
                )}
              </span>
              <Button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="bg-white text-black hover:bg-neutral-200 disabled:bg-white/10 disabled:text-neutral-600"
              >
                下一步
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ═══ Step 2: Workflow Configuration ═══ */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {/* Team summary bar */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-6">
              <span className="text-2xl">{teamIcon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white" style={{ fontWeight: 600 }}>{teamName}</span>
                  <span className="text-neutral-500 text-sm">{selectedMembers.length} 名成员</span>
                </div>
                <div className="flex gap-1.5 mt-1">
                  {selectedAgentDetails.map((a) => (
                    <Badge key={a.id} variant="outline" className="text-[10px] py-0 px-1.5 text-neutral-400 bg-white/5 border-white/10">
                      {a.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-neutral-500 hover:text-white text-xs transition-colors"
              >
                修改
              </button>
            </div>

            {/* Inline workflow steps editor */}
            <Card className="bg-white/[0.03] border-white/10 text-white mb-4">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-neutral-400 text-sm flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                    <Zap className="h-4 w-4" />
                    协作工作流
                  </h3>
                  <button
                    onClick={handleAddWorkflowStep}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-neutral-400 hover:text-white bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    添加步骤
                  </button>
                </div>

                <div className="space-y-0">
                  {teamWorkflow.map((w, i) => (
                    <div key={i} className="flex gap-3 group">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs text-neutral-400 shrink-0" style={{ fontWeight: 500 }}>
                          {w.step}
                        </div>
                        {i < teamWorkflow.length - 1 && (
                          <div className="w-px flex-1 min-h-[2rem] bg-white/10" />
                        )}
                      </div>

                      {/* Step content */}
                      <div className="flex-1 pb-4">
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                          <GripVertical className="h-4 w-4 text-neutral-700 mt-0.5 shrink-0 cursor-grab" />
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={w.title}
                              onChange={(e) => handleUpdateWorkflowStep(i, "title", e.target.value)}
                              className="w-full bg-transparent text-white text-sm border-none outline-none placeholder:text-neutral-600"
                              style={{ fontWeight: 500 }}
                              placeholder="步骤名称"
                            />
                            <input
                              type="text"
                              value={w.description}
                              onChange={(e) => handleUpdateWorkflowStep(i, "description", e.target.value)}
                              className="w-full bg-transparent text-neutral-500 text-xs border-none outline-none placeholder:text-neutral-700"
                              placeholder="步骤描述"
                            />
                          </div>
                          {teamWorkflow.length > 1 && (
                            <button
                              onClick={() => handleRemoveWorkflowStep(i)}
                              className="p-1 rounded hover:bg-red-500/10 text-neutral-700 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Visual workflow editor entry */}
            <Card className="bg-white/[0.03] border-white/10 text-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white text-sm flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                      <Workflow className="h-4 w-4 text-neutral-400" />
                      可视化工作流编辑器
                    </h4>
                    <p className="text-neutral-500 text-xs mt-0.5">
                      使用拖拽式节点编辑器进行更精细的工作流编排
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowWorkflowEditor(true)}
                    className="bg-white text-black hover:bg-neutral-200 gap-1.5"
                  >
                    <Workflow className="h-4 w-4" />
                    打开编辑器
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bottom action */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="border-white/10 text-neutral-400 hover:text-white bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                上一步
              </Button>
              <Button
                onClick={() => setStep(3)}
                className="bg-white text-black hover:bg-neutral-200"
              >
                下一步
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* ═══ Step 3: Confirm & Create ═══ */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {createDone ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-white mb-2" style={{ fontSize: "1.25rem", fontWeight: 700 }}>团队创建成功！</h3>
                <p className="text-neutral-500 text-sm text-center max-w-md mb-2">
                  <span className="text-white" style={{ fontWeight: 500 }}>{teamIcon} {teamName}</span> 已创建完毕，
                  {selectedMembers.length} 名成员已加入团队
                </p>
                <p className="text-neutral-600 text-xs mb-8">团队初始化完成，随时可以分配任务</p>

                <div className="flex gap-3">
                  <Button
                    onClick={() => onCreateSuccess?.()}
                    className="bg-white text-black hover:bg-neutral-200"
                  >
                    返回团队列表
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(1);
                      setTeamName("");
                      setTeamDescription("");
                      setTeamIcon("🚀");
                      setSelectedMembers([]);
                      setTeamWorkflow([
                        { step: 1, title: "任务接收", description: "接收并解析任务指令" },
                        { step: 2, title: "协同处理", description: "团队成员协同执行" },
                        { step: 3, title: "结果汇总", description: "汇总输出最终结果" },
                      ]);
                      setCreateDone(false);
                    }}
                    className="border-white/10 text-neutral-400 hover:text-white bg-transparent"
                  >
                    继续创建
                  </Button>
                </div>
              </motion.div>
            ) : (
              <>
                <h3 className="text-white mb-6" style={{ fontWeight: 600 }}>确认团队信息</h3>

                <div className="space-y-4">
                  {/* Team info card */}
                  <Card className="bg-white/[0.03] border-white/10 text-white">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-3xl shrink-0">
                          {teamIcon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{teamName}</span>
                          </div>
                          <p className="text-neutral-500 text-sm mb-3">{teamDescription || "暂无描述"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Members card */}
                  <Card className="bg-white/[0.03] border-white/10 text-white">
                    <CardContent className="p-5">
                      <h4 className="text-neutral-400 text-sm mb-4 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                        <Users className="h-4 w-4" />
                        团队成员 ({selectedMembers.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedAgentDetails.map((agent) => {
                          const deployed = deployedAgentMap.get(agent.id);
                          return (
                            <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                                {agentIcons[agent.name] || <Bot className="h-4 w-4" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-white text-sm" style={{ fontWeight: 500 }}>{agent.name}</span>
                                <span className="text-neutral-500 text-xs ml-2">{agent.role}</span>
                              </div>
                              {deployed && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-green-400 bg-green-500/10 border-green-500/20">
                                  {deployed.status === "online" ? "在线" : deployed.status === "busy" ? "忙碌" : "离线"}
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Workflow summary card */}
                  <Card className="bg-white/[0.03] border-white/10 text-white">
                    <CardContent className="p-5">
                      <h4 className="text-neutral-400 text-sm mb-4 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                        <Workflow className="h-4 w-4" />
                        协作工作流 ({teamWorkflow.length} 步)
                      </h4>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {teamWorkflow.map((w, i) => (
                          <div key={w.step} className="flex items-center gap-2 shrink-0">
                            <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                              <div className="text-white text-xs" style={{ fontWeight: 500 }}>{w.title}</div>
                              <div className="text-neutral-600 text-[10px]">{w.description}</div>
                            </div>
                            {i < teamWorkflow.length - 1 && (
                              <ArrowRight className="h-3 w-3 text-neutral-600 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Estimated info */}
                  <Card className="bg-white/[0.03] border-white/10 text-white">
                    <CardContent className="p-5">
                      <h4 className="text-neutral-400 text-sm mb-3 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                        <Rocket className="h-4 w-4" />
                        创建预估
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-neutral-500 text-xs">初始化时间</div>
                          <div className="text-white text-sm mt-0.5" style={{ fontWeight: 500 }}>~15 秒</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-xs">团队并发容量</div>
                          <div className="text-white text-sm mt-0.5" style={{ fontWeight: 500 }}>{selectedMembers.length * 3} 任务/小时</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-xs">工作流步骤</div>
                          <div className="text-white text-sm mt-0.5" style={{ fontWeight: 500 }}>{teamWorkflow.length} 步</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bottom action */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="border-white/10 text-neutral-400 hover:text-white bg-transparent"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    上一步
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={creating}
                    className="bg-white text-black hover:bg-neutral-200 disabled:bg-white/20 disabled:text-neutral-500 gap-2"
                  >
                    {creating ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                        创建中...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4" />
                        确认创建
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Workflow Editor Overlay ═══ */}
      {showWorkflowEditor && (
        <WorkflowEditor
          agentName={teamName || "新团队"}
          initialWorkflow={teamWorkflow}
          onClose={() => setShowWorkflowEditor(false)}
        />
      )}
    </div>
  );
}
