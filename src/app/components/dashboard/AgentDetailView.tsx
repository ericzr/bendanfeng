import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Pen,
  Target,
  BarChart3,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  Power,
  XCircle,
  TrendingUp,
  Zap,
  Settings,
  Send,
  BarChart,
  Activity,
  Pencil,
  ChevronDown,
  Cpu,
} from "lucide-react";
import { deployedAgents, agents } from "../../data/mock-data";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { WorkflowEditor } from "../WorkflowEditor";

const availableModels = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", desc: "最强综合能力，推荐复杂任务", tag: "推荐" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", desc: "高性价比，适合简单任务", tag: "" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", desc: "强逻辑推理与长文本", tag: "" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", desc: "极速响应，轻量任务", tag: "" },
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", desc: "国产大模型，中文理解优秀", tag: "国产" },
  { id: "qwen-max", name: "通义千问 Max", provider: "阿里云", desc: "阿里旗舰模型，企业级稳定", tag: "国产" },
  { id: "glm-4", name: "GLM-4", provider: "智谱AI", desc: "中文场景深度优化", tag: "国产" },
];

function modelNameToId(name: string): string {
  const found = availableModels.find(
    (m) => m.name === name || m.name.toLowerCase() === name.toLowerCase()
  );
  return found ? found.id : availableModels[0].id;
}

const agentIconsLg: Record<string, React.ReactNode> = {
  小研: <Search className="h-8 w-8" />,
  小文: <Pen className="h-8 w-8" />,
  小拓: <Target className="h-8 w-8" />,
  小数: <BarChart3 className="h-8 w-8" />,
  小媒: <Sparkles className="h-8 w-8" />,
};

const statusConfig: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  online: {
    label: "在线",
    color: "text-green-400 bg-green-500/10 border-green-500/20",
    dot: "bg-green-400",
  },
  busy: {
    label: "忙碌",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-400",
  },
  offline: {
    label: "离线",
    color: "text-neutral-500 bg-white/5 border-white/10",
    dot: "bg-neutral-500",
  },
  error: {
    label: "异常",
    color: "text-red-400 bg-red-500/10 border-red-500/20",
    dot: "bg-red-400",
  },
};

const weeklyPerformance = [
  { day: "周一", tasks: 8, success: 8 },
  { day: "周二", tasks: 12, success: 11 },
  { day: "周三", tasks: 6, success: 6 },
  { day: "周四", tasks: 15, success: 14 },
  { day: "周五", tasks: 10, success: 10 },
  { day: "周六", tasks: 4, success: 4 },
  { day: "周日", tasks: 3, success: 3 },
];

const recentTasks = [
  {
    name: "Q1市场调研报告",
    status: "running" as const,
    time: "09:00",
    progress: 72,
  },
  {
    name: "竞品动态监控",
    status: "done" as const,
    time: "昨天",
    progress: 100,
  },
  {
    name: "行业白皮书生成",
    status: "done" as const,
    time: "前天",
    progress: 100,
  },
  {
    name: "客户需求调研",
    status: "done" as const,
    time: "3天前",
    progress: 100,
  },
  {
    name: "产品对比分析",
    status: "done" as const,
    time: "4天前",
    progress: 100,
  },
];

export function AgentDetailView({
  agentId,
  onBack,
}: {
  agentId: string;
  onBack: () => void;
}) {
  const deployed = deployedAgents.find((a) => a.id === agentId);
  const agentInfo = deployed
    ? agents.find((a) => a.id === deployed.agentId)
    : null;
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "agent"; content: string }[]
  >([]);
  const [showWorkflowEditor, setShowWorkflowEditor] =
    useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(() =>
    deployed ? modelNameToId(deployed.config.model) : availableModels[0].id
  );

  if (!deployed || !agentInfo) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-neutral-500">未找到该员工</p>
      </div>
    );
  }

  const st = statusConfig[deployed.status];

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: chatInput },
      {
        role: "agent",
        content: `收到任务："${chatInput}"。\n\n我将按以下步骤执行：\n${agentInfo.workflow
          .map(
            (w) => `${w.step}. ${w.title} — ${w.description}`,
          )
          .join(
            "\n",
          )}\n\n预计 ${deployed.avgResponseTime} 完成，请稍候...`,
      },
    ]);
    setChatInput("");
  };

  const maxTasks = Math.max(
    ...weeklyPerformance.map((d) => d.tasks),
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 border-b border-white/10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-300 text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回员工列表
        </button>

        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
            {agentIconsLg[deployed.name] || (
              <Bot className="h-8 w-8" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2
                className="text-white"
                style={{ fontSize: "1.5rem", fontWeight: 700 }}
              >
                {deployed.name}
              </h2>
              <Badge
                variant="outline"
                className={`${st.color} gap-1.5`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${st.dot} ${deployed.status === "online" || deployed.status === "busy" ? "animate-pulse" : ""}`}
                />
                {st.label}
              </Badge>
            </div>
            <p className="text-neutral-500">{deployed.role}</p>
            <p className="text-neutral-600 text-sm mt-1">
              部署于 {deployed.deployedAt} · 模型{" "}
              {deployed.config.model}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            {deployed.status === "offline" ? (
              <Button
                variant="outline"
                className="border-green-500/20 text-green-400 hover:bg-green-500/10 bg-transparent"
              >
                启动
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-white/10 text-neutral-400 hover:text-white bg-transparent"
              >
                暂停
              </Button>
            )}
            <Button
              variant="outline"
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
            >
              卸载
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="flex-1">
        <div className="border-b border-white/10 px-6 py-3">
          <TabsList className="bg-white/5 border border-white/10 rounded-lg p-1 h-auto gap-1 w-fit">
            <TabsTrigger
              value="overview"
              className="rounded-md px-4 py-2 text-sm text-neutral-400 hover:text-white data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm bg-transparent transition-all"
            >
              <Activity className="h-4 w-4 mr-1.5" /> 概览
            </TabsTrigger>
            <TabsTrigger
              value="config"
              className="rounded-md px-4 py-2 text-sm text-neutral-400 hover:text-white data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm bg-transparent transition-all"
            >
              <Settings className="h-4 w-4 mr-1.5" /> 配置
            </TabsTrigger>
            <TabsTrigger
              value="tasks"
              className="rounded-md px-4 py-2 text-sm text-neutral-400 hover:text-white data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm bg-transparent transition-all"
            >
              <BarChart className="h-4 w-4 mr-1.5" /> 历史任务
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-6 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "已完成任务",
                value: deployed.tasksCompleted,
                icon: (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                ),
              },
              {
                label: "执行中",
                value: deployed.tasksRunning,
                icon: (
                  <Zap className="h-4 w-4 text-neutral-400" />
                ),
              },
              {
                label: "成功率",
                value: `${deployed.successRate}%`,
                icon: (
                  <TrendingUp className="h-4 w-4 text-neutral-400" />
                ),
              },
              {
                label: "平均耗时",
                value: deployed.avgResponseTime,
                icon: (
                  <Clock className="h-4 w-4 text-neutral-400" />
                ),
              },
            ].map((s) => (
              <Card
                key={s.label}
                className="bg-neutral-950 border-white/10"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {s.icon}
                    <span className="text-neutral-500 text-xs">
                      {s.label}
                    </span>
                  </div>
                  <div
                    className="text-white"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {s.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-neutral-950 border-white/10">
            <CardContent className="p-5">
              <h3
                className="text-white mb-4"
                style={{ fontWeight: 600 }}
              >
                本周任务量
              </h3>
              <div className="flex items-end gap-3 h-32">
                {weeklyPerformance.map((d) => (
                  <div
                    key={d.day}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <span className="text-neutral-500 text-xs">
                      {d.tasks}
                    </span>
                    <div
                      className="w-full relative"
                      style={{
                        height: `${(d.tasks / maxTasks) * 100}%`,
                        minHeight: 4,
                      }}
                    >
                      <div className="absolute inset-0 rounded-md bg-white/10" />
                      <div
                        className="absolute inset-x-0 bottom-0 rounded-md bg-white"
                        style={{
                          height: `${(d.success / d.tasks) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-neutral-600 text-xs mt-1">
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-neutral-950 border-white/10">
              <CardContent className="p-5">
                <h3
                  className="text-white mb-4"
                  style={{ fontWeight: 600 }}
                >
                  能力标签
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {agentInfo.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-neutral-300 border-white/10 bg-white/5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {agentInfo.description}
                </p>
                <div className="flex items-center justify-between mt-5 mb-3">
                  <h4
                    className="text-white"
                    style={{
                      fontWeight: 600,
                      fontSize: "0.875rem",
                    }}
                  >
                    工作流程
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-neutral-300 bg-transparent hover:bg-white/5 h-7 text-xs"
                    onClick={() => setShowWorkflowEditor(true)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    编辑工作流
                  </Button>
                </div>
                <div className="space-y-2">
                  {agentInfo.workflow.map((w) => (
                    <div
                      key={w.step}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5"
                    >
                      <span
                        className="w-6 h-6 rounded-md bg-white/10 text-white text-xs flex items-center justify-center"
                        style={{ fontWeight: 600 }}
                      >
                        {w.step}
                      </span>
                      <div>
                        <span className="text-neutral-300 text-sm">
                          {w.title}
                        </span>
                        <span className="text-neutral-600 text-xs ml-2">
                          {w.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-950 border-white/10 flex flex-col">
              <CardContent className="p-5 flex flex-col flex-1">
                <h3
                  className="text-white mb-4"
                  style={{ fontWeight: 600 }}
                >
                  快速指令
                </h3>
                <div className="flex-1 overflow-y-auto space-y-2 mb-3 min-h-[180px] max-h-[300px] p-2 rounded-lg bg-black/40">
                  {chatMessages.length === 0 && (
                    <div className="text-neutral-600 text-sm text-center pt-16">
                      向 {deployed.name} 发送任务指令
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-white/10 text-neutral-200 border border-white/10"
                            : "bg-white/5 text-neutral-300 border border-white/10"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={chatInput}
                    onChange={(e) =>
                      setChatInput(e.target.value)
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSend()
                    }
                    placeholder={`给${deployed.name}下达任务...`}
                    className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20"
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-white text-black hover:bg-neutral-200"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="p-6">
          <div className="max-w-2xl space-y-6">
            <Card className="bg-neutral-950 border-white/10">
              <CardContent className="p-6 space-y-5">
                <h3
                  className="text-white"
                  style={{ fontWeight: 600 }}
                >
                  模型配置
                </h3>
                <div>
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
                            <span className="text-white text-sm" style={{ fontWeight: 500 }}>
                              {availableModels.find((m) => m.id === selectedModel)?.name}
                            </span>
                            <span className="text-neutral-600 text-xs">
                              {availableModels.find((m) => m.id === selectedModel)?.provider}
                            </span>
                            {availableModels.find((m) => m.id === selectedModel)?.tag && (
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-green-400 bg-green-500/10 border-green-500/20">
                                {availableModels.find((m) => m.id === selectedModel)?.tag}
                              </Badge>
                            )}
                          </div>
                          <span className="text-neutral-500 text-xs">
                            {availableModels.find((m) => m.id === selectedModel)?.desc}
                          </span>
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
                <div>
                  <label className="text-neutral-400 text-sm block mb-2">
                    Temperature（创造性）
                    <span className="text-white ml-2">
                      {deployed.config.temperature}
                    </span>
                  </label>
                  <Slider
                    defaultValue={[
                      deployed.config.temperature * 100,
                    ]}
                    max={100}
                    step={10}
                    className="[&_[data-slot=slider-track]]:bg-white/10 [&_[data-slot=slider-range]]:bg-white [&_[data-slot=slider-thumb]]:border-white [&_[data-slot=slider-thumb]]:bg-black"
                  />
                  <div className="flex justify-between text-xs text-neutral-600 mt-1">
                    <span>精确</span>
                    <span>创造性</span>
                  </div>
                </div>
                <div>
                  <label className="text-neutral-400 text-sm block mb-2">
                    Max Tokens
                  </label>
                  <Input
                    type="number"
                    defaultValue={deployed.config.maxTokens}
                    className="bg-white/5 border-white/10 text-white focus-visible:border-white/30 focus-visible:ring-white/20"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-neutral-300 text-sm">
                      自动重试
                    </label>
                    <p className="text-neutral-600 text-xs mt-0.5">
                      任务失败时自动重试（最多3次）
                    </p>
                  </div>
                  <Switch
                    defaultChecked={deployed.config.autoRetry}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-950 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-white"
                    style={{ fontWeight: 600 }}
                  >
                    工作流配置
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-neutral-300 bg-transparent hover:bg-white/5 h-7 text-xs"
                    onClick={() => setShowWorkflowEditor(true)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    打开编辑器
                  </Button>
                </div>
                <div className="space-y-3">
                  {agentInfo.workflow.map((w) => (
                    <div
                      key={w.step}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                    >
                      <span
                        className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center text-sm"
                        style={{ fontWeight: 600 }}
                      >
                        {w.step}
                      </span>
                      <div className="flex-1">
                        <div className="text-neutral-300 text-sm">
                          {w.title}
                        </div>
                        <div className="text-neutral-600 text-xs">
                          {w.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-950 border-red-500/20">
              <CardContent className="p-6">
                <h3
                  className="text-red-400 mb-2"
                  style={{ fontWeight: 600 }}
                >
                  危险操作
                </h3>
                <p className="text-neutral-500 text-sm mb-4">
                  卸载此AI员工将清除所有配置和历史数据
                </p>
                <Button
                  variant="outline"
                  className="border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  卸载员工
                </Button>
              </CardContent>
            </Card>

            <Button className="w-full bg-white text-black hover:bg-neutral-200">
              保存配置
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3
                className="text-white"
                style={{ fontWeight: 600 }}
              >
                历史任务
              </h3>
              <span className="text-neutral-500 text-sm">
                共{" "}
                {deployed.tasksCompleted +
                  deployed.tasksRunning}{" "}
                个任务
              </span>
            </div>
            {recentTasks.map((task, i) => (
              <motion.div
                key={task.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-neutral-950"
              >
                {task.status === "done" ? (
                  <CheckCircle2 className="h-5 w-5 text-white shrink-0" />
                ) : (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <span
                    className="text-white text-sm"
                    style={{ fontWeight: 500 }}
                  >
                    {task.name}
                  </span>
                  <div className="text-neutral-600 text-xs mt-0.5">
                    {task.time}
                  </div>
                </div>
                {task.status === "running" && (
                  <div className="w-20">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-neutral-500 text-xs">
                      {task.progress}%
                    </span>
                  </div>
                )}
                {task.status === "done" && (
                  <Badge
                    variant="outline"
                    className="text-neutral-300 border-white/10 bg-white/5"
                  >
                    已完成
                  </Badge>
                )}
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showWorkflowEditor && agentInfo && (
        <WorkflowEditor
          agentName={deployed.name}
          initialWorkflow={agentInfo.workflow}
          onClose={() => setShowWorkflowEditor(false)}
        />
      )}
    </div>
  );
}