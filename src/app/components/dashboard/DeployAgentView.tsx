import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Pen,
  Target,
  BarChart3,
  Sparkles,
  Bot,
  Package,
  Heart,
  Globe,
  Cpu,
  ChevronDown,
  CheckCircle2,
  Thermometer,
  Hash,
  RotateCcw,
  Settings2,
  Rocket,
  ArrowRight,
  Check,
  Zap,
  Plus,
  Workflow,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { agents, deployedAgents } from "../../data/mock-data";
import { WorkflowEditor } from "../WorkflowEditor";

// ── Models (shared with NewTaskView) ──
const availableModels = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", desc: "最强综合能力，推荐复杂任务", tag: "推荐" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", desc: "高性价比，适合简单任务", tag: "" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", desc: "强逻辑推理与长文本", tag: "" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", desc: "极速响应，轻量任务", tag: "" },
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", desc: "国产大模型，中文理解优秀", tag: "国产" },
  { id: "qwen-max", name: "通义千问 Max", provider: "阿里云", desc: "阿里旗舰模型，企业级稳定", tag: "国产" },
  { id: "glm-4", name: "GLM-4", provider: "智谱AI", desc: "中文场景深度优化", tag: "国产" },
];

const agentIcons: Record<string, React.ReactNode> = {
  "小研": <Search className="h-5 w-5" />,
  "小文": <Pen className="h-5 w-5" />,
  "小拓": <Target className="h-5 w-5" />,
  "小数": <BarChart3 className="h-5 w-5" />,
  "小媒": <Sparkles className="h-5 w-5" />,
  "小产": <Package className="h-5 w-5" />,
  "小客": <Heart className="h-5 w-5" />,
  "小搜": <Globe className="h-5 w-5" />,
};

const categoryColors: Record<string, string> = {
  "市场": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "内容": "text-purple-400 bg-purple-500/10 border-purple-500/20",
  "销售": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "数据": "text-green-400 bg-green-500/10 border-green-500/20",
  "产品": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

type Step = 1 | 2 | 3;

const defaultCustomWorkflow = [
  { step: 1, title: "接收输入", description: "获取用户指令或外部数据" },
  { step: 2, title: "AI 处理", description: "调用大模型进行分析处理" },
  { step: 3, title: "输出结果", description: "返回处理结果" },
];

export function DeployAgentView({ onBack, onDeploySuccess }: { onBack: () => void; onDeploySuccess?: () => void }) {
  const [step, setStep] = useState<Step>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // Custom agent
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customTags, setCustomTags] = useState("");
  const [customWorkflow, setCustomWorkflow] = useState(defaultCustomWorkflow);
  const [showWorkflowEditor, setShowWorkflowEditor] = useState(false);

  // Config
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState(0.5);
  const [maxTokens, setMaxTokens] = useState(8192);
  const [autoRetry, setAutoRetry] = useState(true);

  // Model dropdown
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Deploy state
  const [deploying, setDeploying] = useState(false);
  const [deployDone, setDeployDone] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const deployedIds = new Set(deployedAgents.map((a) => a.agentId));
  const categories = ["全部", ...Array.from(new Set(agents.map((a) => a.category)))];

  const filteredAgents = agents.filter((a) => {
    if (deployedIds.has(a.id)) return false;
    if (selectedCategory !== "全部" && a.category !== selectedCategory) return false;
    if (searchQuery && !a.name.includes(searchQuery) && !a.role.includes(searchQuery) && !a.tags.some((t) => t.includes(searchQuery))) return false;
    return true;
  });

  const selectedAgent = agents.find((a) => a.id === selectedAgentId);
  const currentModel = availableModels.find((m) => m.id === selectedModel)!;

  // Determine display info for steps 2 & 3
  const displayAgent = isCustom
    ? {
        name: customName || "自定义员工",
        role: customRole || "自定义角色",
        description: customDescription || "通过工作流编辑器自定义的 AI 员工",
        tags: customTags ? customTags.split(/[,，、\s]+/).filter(Boolean) : ["自定义"],
        workflow: customWorkflow,
        knowledgeBases: [] as { id: string }[],
      }
    : selectedAgent;

  const canProceedStep1 = isCustom || !!selectedAgentId;

  const handleSelectCustom = () => {
    setIsCustom(true);
    setSelectedAgentId(null);
  };

  const handleSelectAgent = (id: string) => {
    setIsCustom(false);
    setSelectedAgentId(id);
  };

  const handleDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      setDeployDone(true);
    }, 2000);
  };

  const steps = [
    { num: 1, label: "选择员工" },
    { num: 2, label: "配置参数" },
    { num: 3, label: "确认部署" },
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
            <h2 className="text-white" style={{ fontSize: "1.25rem", fontWeight: 700 }}>部署新员工</h2>
            <p className="text-neutral-500 text-sm mt-0.5">从员工库中选择 AI 员工，配置参数后部署上线</p>
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
        {/* ═══ Step 1: Select Agent ═══ */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input
                  type="text"
                  placeholder="搜索员工名称、角色或技能..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:border-white/30 focus-visible:ring-white/20"
                />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-1 flex gap-0.5 shrink-0 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? "bg-white text-black"
                        : "text-neutral-400 hover:text-white"
                    }`}
                    style={{ fontWeight: selectedCategory === cat ? 600 : 400 }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* ── Custom Agent Entry ── */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <button
                  onClick={handleSelectCustom}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    isCustom
                      ? "border-white/40 bg-white/[0.06] ring-1 ring-white/20"
                      : "border-dashed border-white/20 bg-neutral-950 hover:border-white/30 hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isCustom ? "bg-white text-black" : "bg-white/5 border border-white/10 text-neutral-400"
                    }`}>
                      <Plus className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white" style={{ fontWeight: 600 }}>自定义员工</span>
                        <span className="text-neutral-500 text-sm">从零搭建工作流</span>
                        {isCustom && <CheckCircle2 className="h-4 w-4 text-white ml-auto shrink-0" />}
                      </div>
                      <p className="text-neutral-500 text-xs mb-2">使用可视化工作流编辑器，自由拖拽节点组合，打造专属 AI 员工</p>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-white/60 bg-white/5 border-white/10">
                          <Workflow className="h-2.5 w-2.5 mr-0.5" />
                          可视化编排
                        </Badge>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-white/60 bg-white/5 border-white/10">
                          自由组合
                        </Badge>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-white/60 bg-white/5 border-white/10">
                          高度灵活
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              </motion.div>

              {/* ── Existing agents ── */}
              {filteredAgents.length === 0 && !isCustom ? (
                <div className="text-center py-20 col-span-full">
                  <Bot className="h-10 w-10 text-neutral-700 mx-auto mb-3" />
                  <p className="text-neutral-500 text-sm">
                    {deployedIds.size === agents.length ? "所有员工均已部署" : "未找到匹配的员工"}
                  </p>
                </div>
              ) : (
                filteredAgents.map((agent, i) => {
                  const isSelected = selectedAgentId === agent.id && !isCustom;
                  const catColor = categoryColors[agent.category] || "text-neutral-400 bg-white/5 border-white/10";
                  return (
                    <motion.div
                      key={agent.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (i + 1) * 0.04 }}
                    >
                      <button
                        onClick={() => handleSelectAgent(agent.id)}
                        className={`w-full text-left rounded-xl border p-4 transition-all ${
                          isSelected
                            ? "border-white/40 bg-white/[0.06] ring-1 ring-white/20"
                            : "border-white/10 bg-neutral-950 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? "bg-white text-black" : "bg-white/10 text-white"
                          }`}>
                            {agentIcons[agent.name] || <Bot className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white" style={{ fontWeight: 600 }}>{agent.name}</span>
                              <span className="text-neutral-500 text-sm">{agent.role}</span>
                              {isSelected && <CheckCircle2 className="h-4 w-4 text-white ml-auto shrink-0" />}
                            </div>
                            <p className="text-neutral-500 text-xs mb-2 line-clamp-2">{agent.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${catColor}`}>
                                {agent.category}
                              </Badge>
                              {agent.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[10px] py-0 px-1.5 text-neutral-400 bg-white/5 border-white/10">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Bottom action bar */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-neutral-600 text-sm">
                可部署 <span className="text-neutral-400">{filteredAgents.length}</span> 名员工
                {isCustom && (
                  <span className="ml-3 text-neutral-400">
                    已选择：<span className="text-white" style={{ fontWeight: 500 }}>自定义员工</span>
                  </span>
                )}
                {!isCustom && selectedAgent && (
                  <span className="ml-3 text-neutral-400">
                    已选择：<span className="text-white" style={{ fontWeight: 500 }}>{selectedAgent.name}</span>
                  </span>
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

        {/* ═══ Step 2: Configure ═══ */}
        {step === 2 && displayAgent && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {/* Selected agent summary / Custom agent info */}
            {isCustom ? (
              <Card className="bg-white/[0.03] border-white/10 text-white mb-6">
                <CardContent className="p-5">
                  <h3 className="text-neutral-400 text-sm mb-4 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                    <Bot className="h-4 w-4" />
                    自定义员工信息
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-neutral-500 text-xs mb-1.5 block">员工名称</label>
                      <Input
                        type="text"
                        placeholder="如：小助、小策..."
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="text-neutral-500 text-xs mb-1.5 block">角色定位</label>
                      <Input
                        type="text"
                        placeholder="如：AI 策略分析师"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-neutral-500 text-xs mb-1.5 block">员工简介</label>
                      <textarea
                        placeholder="描述该员工的核心能力与职责..."
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        rows={2}
                        className="w-full rounded-md bg-white/5 border border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20 focus:outline-none px-3 py-2 text-sm resize-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-neutral-500 text-xs mb-1.5 block">技能标签 <span className="text-neutral-600">（用逗号分隔）</span></label>
                      <Input
                        type="text"
                        placeholder="如：策略分析, 数据整合, 自动报告"
                        value={customTags}
                        onChange={(e) => setCustomTags(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20"
                      />
                    </div>
                  </div>

                  {/* Workflow Editor Entry */}
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white text-sm flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                          <Workflow className="h-4 w-4 text-neutral-400" />
                          工作流编排
                        </h4>
                        <p className="text-neutral-500 text-xs mt-0.5">
                          当前 {customWorkflow.length} 个步骤 · 使用可视化编辑器自由组合节点
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

                    {/* Workflow mini preview */}
                    <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
                      {customWorkflow.map((w, i) => (
                        <div key={w.step} className="flex items-center gap-2 shrink-0">
                          <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                            <div className="text-white text-xs" style={{ fontWeight: 500 }}>{w.title}</div>
                            <div className="text-neutral-600 text-[10px]">{w.description}</div>
                          </div>
                          {i < customWorkflow.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-neutral-600 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : selectedAgent ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10 mb-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                  {agentIcons[selectedAgent.name] || <Bot className="h-5 w-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white" style={{ fontWeight: 600 }}>{selectedAgent.name}</span>
                    <span className="text-neutral-500 text-sm">{selectedAgent.role}</span>
                  </div>
                  <div className="flex gap-1.5 mt-1">
                    {selectedAgent.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] py-0 px-1.5 text-neutral-400 bg-white/5 border-white/10">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="ml-auto text-neutral-500 hover:text-white text-xs transition-colors"
                >
                  更换
                </button>
              </div>
            ) : null}

            {/* Model config card */}
            <Card className="bg-white/[0.03] border-white/10 text-white">
              <CardContent className="p-5">
                <h3 className="text-neutral-400 text-sm mb-4 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                  <Settings2 className="h-4 w-4" />
                  模型配置
                </h3>

                {/* Model Selector */}
                <div className="mb-4" ref={dropdownRef}>
                  <label className="text-neutral-500 text-xs mb-1.5 block">大模型选择</label>
                  <div className="relative">
                    <button
                      onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                      className="w-full flex items-center justify-between gap-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                          <Cpu className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm" style={{ fontWeight: 500 }}>{currentModel.name}</span>
                            <span className="text-neutral-600 text-xs">{currentModel.provider}</span>
                            {currentModel.tag && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-green-400 bg-green-500/10 border-green-500/20">
                                {currentModel.tag}
                              </Badge>
                            )}
                          </div>
                          <span className="text-neutral-500 text-xs">{currentModel.desc}</span>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-neutral-500 shrink-0 transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {modelDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-20 top-full left-0 right-0 mt-1 rounded-lg bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden max-h-72 overflow-y-auto"
                        >
                          {availableModels.map((model) => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedModel(model.id);
                                setModelDropdownOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                                selectedModel === model.id
                                  ? "bg-white/10"
                                  : "hover:bg-white/5"
                              }`}
                            >
                              <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center shrink-0">
                                <Cpu className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-white text-sm" style={{ fontWeight: 500 }}>{model.name}</span>
                                  <span className="text-neutral-600 text-xs">{model.provider}</span>
                                  {model.tag && (
                                    <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-green-400 bg-green-500/10 border-green-500/20">
                                      {model.tag}
                                    </Badge>
                                  )}
                                </div>
                                <span className="text-neutral-500 text-xs">{model.desc}</span>
                              </div>
                              {selectedModel === model.id && (
                                <CheckCircle2 className="h-4 w-4 text-white shrink-0" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Parameters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Temperature */}
                  <div>
                    <label className="text-neutral-500 text-xs mb-1.5 flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      Temperature
                      <span className="ml-auto text-neutral-400" style={{ fontWeight: 500 }}>{temperature.toFixed(1)}</span>
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.1}
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-600 mt-1">
                        <span>精确</span>
                        <span>创造</span>
                      </div>
                    </div>
                  </div>

                  {/* Max Tokens */}
                  <div>
                    <label className="text-neutral-500 text-xs mb-1.5 flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Max Tokens
                    </label>
                    <div className="flex items-center gap-2">
                      {[2048, 4096, 8192, 16384].map((val) => (
                        <button
                          key={val}
                          onClick={() => setMaxTokens(val)}
                          className={`flex-1 py-1.5 rounded-md text-xs transition-colors ${
                            maxTokens === val
                              ? "bg-white text-black"
                              : "bg-white/5 text-neutral-500 hover:text-white border border-white/10"
                          }`}
                          style={{ fontWeight: maxTokens === val ? 600 : 400 }}
                        >
                          {val >= 1024 ? `${val / 1024}K` : val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto Retry */}
                  <div>
                    <label className="text-neutral-500 text-xs mb-1.5 flex items-center gap-1">
                      <RotateCcw className="h-3 w-3" />
                      失败自动重试
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setAutoRetry(true)}
                        className={`flex-1 py-1.5 rounded-md text-xs transition-colors ${
                          autoRetry
                            ? "bg-white text-black"
                            : "bg-white/5 text-neutral-500 hover:text-white border border-white/10"
                        }`}
                        style={{ fontWeight: autoRetry ? 600 : 400 }}
                      >
                        开启
                      </button>
                      <button
                        onClick={() => setAutoRetry(false)}
                        className={`flex-1 py-1.5 rounded-md text-xs transition-colors ${
                          !autoRetry
                            ? "bg-white text-black"
                            : "bg-white/5 text-neutral-500 hover:text-white border border-white/10"
                        }`}
                        style={{ fontWeight: !autoRetry ? 600 : 400 }}
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Workflow preview (only for preset agents) */}
            {!isCustom && selectedAgent && (
              <Card className="bg-white/[0.03] border-white/10 text-white mt-4">
                <CardContent className="p-5">
                  <h3 className="text-neutral-400 text-sm mb-4 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                    <Zap className="h-4 w-4" />
                    工作流程预览
                  </h3>
                  <div className="space-y-0">
                    {selectedAgent.workflow.map((w, i) => (
                      <div key={w.step} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs text-neutral-400" style={{ fontWeight: 500 }}>
                            {w.step}
                          </div>
                          {i < selectedAgent.workflow.length - 1 && (
                            <div className="w-px h-8 bg-white/10" />
                          )}
                        </div>
                        <div className="pb-6">
                          <span className="text-white text-sm" style={{ fontWeight: 500 }}>{w.title}</span>
                          <p className="text-neutral-500 text-xs mt-0.5">{w.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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

        {/* ═══ Step 3: Confirm & Deploy ═══ */}
        {step === 3 && displayAgent && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {deployDone ? (
              /* ── Success state ── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-white mb-2" style={{ fontSize: "1.25rem", fontWeight: 700 }}>部署成功！</h3>
                <p className="text-neutral-500 text-sm text-center max-w-md mb-2">
                  <span className="text-white" style={{ fontWeight: 500 }}>{displayAgent.name}</span>（{displayAgent.role}）已成功部署，正在初始化中...
                </p>
                <p className="text-neutral-600 text-xs mb-8">预计 30 秒内完成初始化并上线</p>

                <div className="flex gap-3">
                  <Button
                    onClick={() => onDeploySuccess?.()}
                    className="bg-white text-black hover:bg-neutral-200"
                  >
                    返回员工列表
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(1);
                      setSelectedAgentId(null);
                      setIsCustom(false);
                      setCustomName("");
                      setCustomRole("");
                      setCustomDescription("");
                      setCustomTags("");
                      setCustomWorkflow(defaultCustomWorkflow);
                      setDeployDone(false);
                    }}
                    className="border-white/10 text-neutral-400 hover:text-white bg-transparent"
                  >
                    继续部署
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* ── Confirmation ── */
              <>
                <h3 className="text-white mb-6" style={{ fontWeight: 600 }}>确认部署信息</h3>

                <div className="space-y-4">
                  {/* Agent info */}
                  <Card className="bg-white/[0.03] border-white/10 text-white">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                          isCustom ? "bg-white/10 border border-white/10 text-white" : "bg-white/10 text-white"
                        }`}>
                          {isCustom ? <Plus className="h-6 w-6" /> : (agentIcons[displayAgent.name] || <Bot className="h-6 w-6" />)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white" style={{ fontSize: "1.1rem", fontWeight: 700 }}>{displayAgent.name}</span>
                            <span className="text-neutral-500">{displayAgent.role}</span>
                            {isCustom && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-white/60 bg-white/5 border-white/10">
                                自定义
                              </Badge>
                            )}
                          </div>
                          <p className="text-neutral-500 text-sm mb-3">{displayAgent.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {displayAgent.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-[10px] py-0 px-1.5 text-neutral-400 bg-white/5 border-white/10">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Config summary */}
                  <Card className="bg-white/[0.03] border-white/10 text-white">
                    <CardContent className="p-5">
                      <h4 className="text-neutral-400 text-sm mb-4 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                        <Settings2 className="h-4 w-4" />
                        运行配置
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-neutral-500 text-xs mb-1 flex items-center gap-1">
                            <Cpu className="h-3 w-3" /> 大模型
                          </div>
                          <div className="text-white text-sm" style={{ fontWeight: 500 }}>{currentModel.name}</div>
                          <div className="text-neutral-600 text-xs">{currentModel.provider}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-neutral-500 text-xs mb-1 flex items-center gap-1">
                            <Thermometer className="h-3 w-3" /> Temperature
                          </div>
                          <div className="text-white text-sm" style={{ fontWeight: 500 }}>{temperature.toFixed(1)}</div>
                          <div className="text-neutral-600 text-xs">{temperature <= 0.3 ? "偏精确" : temperature >= 0.7 ? "偏创造" : "均衡"}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-neutral-500 text-xs mb-1 flex items-center gap-1">
                            <Hash className="h-3 w-3" /> Max Tokens
                          </div>
                          <div className="text-white text-sm" style={{ fontWeight: 500 }}>{maxTokens >= 1024 ? `${maxTokens / 1024}K` : maxTokens}</div>
                          <div className="text-neutral-600 text-xs">最大输出长度</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="text-neutral-500 text-xs mb-1 flex items-center gap-1">
                            <RotateCcw className="h-3 w-3" /> 自动重试
                          </div>
                          <div className="text-white text-sm" style={{ fontWeight: 500 }}>{autoRetry ? "已开启" : "已关闭"}</div>
                          <div className="text-neutral-600 text-xs">{autoRetry ? "失败自动恢复" : "需手动处理"}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Workflow summary for custom */}
                  {isCustom && (
                    <Card className="bg-white/[0.03] border-white/10 text-white">
                      <CardContent className="p-5">
                        <h4 className="text-neutral-400 text-sm mb-3 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                          <Workflow className="h-4 w-4" />
                          自定义工作流
                        </h4>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {customWorkflow.map((w, i) => (
                            <div key={w.step} className="flex items-center gap-2 shrink-0">
                              <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-white text-xs" style={{ fontWeight: 500 }}>{w.title}</div>
                                <div className="text-neutral-600 text-[10px]">{w.description}</div>
                              </div>
                              {i < customWorkflow.length - 1 && (
                                <ArrowRight className="h-3 w-3 text-neutral-600 shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Estimated resources */}
                  <Card className="bg-white/[0.03] border-white/10 text-white">
                    <CardContent className="p-5">
                      <h4 className="text-neutral-400 text-sm mb-3 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                        <Rocket className="h-4 w-4" />
                        部署预估
                      </h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="text-neutral-500 text-xs">初始化时间</div>
                          <div className="text-white text-sm mt-0.5" style={{ fontWeight: 500 }}>~30 秒</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-xs">预计月成本</div>
                          <div className="text-white text-sm mt-0.5" style={{ fontWeight: 500 }}>¥ 280 ~ 520</div>
                        </div>
                        <div>
                          <div className="text-neutral-500 text-xs">知识库</div>
                          <div className="text-white text-sm mt-0.5" style={{ fontWeight: 500 }}>{displayAgent.knowledgeBases?.length || 0} 个已关联</div>
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
                    onClick={handleDeploy}
                    disabled={deploying}
                    className="bg-white text-black hover:bg-neutral-200 disabled:bg-white/20 disabled:text-neutral-500 gap-2"
                  >
                    {deploying ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                        部署中...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4" />
                        确认部署
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
          agentName={customName || "自��义员工"}
          initialWorkflow={customWorkflow}
          onClose={() => setShowWorkflowEditor(false)}
        />
      )}
    </div>
  );
}
