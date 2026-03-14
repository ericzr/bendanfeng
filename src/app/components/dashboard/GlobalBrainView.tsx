import { useState, useRef, useEffect } from "react";
import {
  Send,
  Brain,
  Sparkles,
  Workflow,
  ListChecks,
  Users,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Globe,
  Search,
  Pen,
  Target,
  Eye,
  Plus,
  Command,
  X,
  Power,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ChatMessage {
  id: string;
  role: "user" | "brain";
  content: string;
  timestamp: string;
  actions?: { label: string; type: "primary" | "secondary" }[];
  cards?: {
    type: "workflow" | "task" | "agent" | "status";
    title: string;
    description: string;
    status?: string;
    items?: string[];
  }[];
}

const quickActions = [
  {
    icon: <Workflow className="h-4 w-4" />,
    label: "创建工作流",
    prompt: "帮我创建一个新的工作流",
  },
  {
    icon: <ListChecks className="h-4 w-4" />,
    label: "发布任务",
    prompt: "我想发布一个新任务",
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    label: "查看全局状态",
    prompt: "展示当前所有任务和员工的运行状态",
  },
  {
    icon: <Users className="h-4 w-4" />,
    label: "调配团队",
    prompt: "帮我调整团队人员配置",
  },
  {
    icon: <Search className="h-4 w-4" />,
    label: "搜索知识库",
    prompt: "在知识库中搜索相关内容",
  },
  {
    icon: <Eye className="h-4 w-4" />,
    label: "监控异常",
    prompt: "检查当前是否有异常任务或员工",
  },
];

const suggestions = [
  "帮我用小研分析Q2市场趋势并生成报告",
  "创建一个「内容生产→审核→发布」的自动化工作流",
  "把小文的写作任务优先级提高，暂停小拓的拓展任务",
  "查看本周所有员工的任务完成情况",
  "把竞品分析报告同步到知识库",
];

const onlineAgents = [
  {
    name: "小研",
    role: "研究分析",
    icon: <Search className="h-3.5 w-3.5" />,
    status: "idle" as const,
  },
  {
    name: "小文",
    role: "内容创作",
    icon: <Pen className="h-3.5 w-3.5" />,
    status: "working" as const,
  },
  {
    name: "小拓",
    role: "业务拓展",
    icon: <Target className="h-3.5 w-3.5" />,
    status: "idle" as const,
  },
  {
    name: "小数",
    role: "数据分析",
    icon: <BarChart3 className="h-3.5 w-3.5" />,
    status: "working" as const,
  },
];

interface AgentDetail {
  name: string;
  role: string;
  status: "idle" | "working";
  currentTask: string | null;
  model: string;
  todayCompleted: number;
  totalTasks: number;
  successRate: string;
  avgTime: string;
  skills: string[];
  recentTasks: {
    name: string;
    status: "done" | "running";
    time: string;
  }[];
}

const agentDetails: Record<string, AgentDetail> = {
  小研: {
    name: "小研",
    role: "研究分析专员",
    status: "idle",
    currentTask: null,
    model: "GPT-4o",
    todayCompleted: 5,
    totalTasks: 128,
    successRate: "98.4%",
    avgTime: "18min",
    skills: [
      "市场调研",
      "竞品分析",
      "数据采集",
      "报告生成",
      "趋势预测",
    ],
    recentTasks: [
      { name: "Q1竞品分析报告", status: "done", time: "2h前" },
      {
        name: "用户画像数据更新",
        status: "done",
        time: "4h前",
      },
      { name: "行业趋势月报", status: "done", time: "昨天" },
    ],
  },
  小文: {
    name: "小文",
    role: "内容创作专员",
    status: "working",
    currentTask: "撰写Q2市场趋势分析文章",
    model: "GPT-4o",
    todayCompleted: 3,
    totalTasks: 96,
    successRate: "97.2%",
    avgTime: "25min",
    skills: [
      "文章撰写",
      "SEO优化",
      "文案策划",
      "内容审校",
      "多语言翻译",
    ],
    recentTasks: [
      {
        name: "Q2市场趋势分析文章",
        status: "running",
        time: "进行中",
      },
      { name: "产品发布新闻稿", status: "done", time: "3h前" },
      {
        name: "社交媒体内容日历",
        status: "done",
        time: "昨天",
      },
    ],
  },
  小拓: {
    name: "小拓",
    role: "业务拓展专员",
    status: "idle",
    currentTask: null,
    model: "Claude 3.5",
    todayCompleted: 2,
    totalTasks: 67,
    successRate: "95.5%",
    avgTime: "32min",
    skills: [
      "客户画像",
      "线索挖掘",
      "邮件营销",
      "渠道分析",
      "合作洽谈",
    ],
    recentTasks: [
      {
        name: "潜在客户名单筛选",
        status: "done",
        time: "1h前",
      },
      {
        name: "合作伙伴邮件跟进",
        status: "done",
        time: "5h前",
      },
      { name: "渠道ROI分析", status: "done", time: "昨天" },
    ],
  },
  小数: {
    name: "小数",
    role: "数据分析专员",
    status: "working",
    currentTask: "竞品数据采集与可视化",
    model: "GPT-4o",
    todayCompleted: 4,
    totalTasks: 112,
    successRate: "99.1%",
    avgTime: "15min",
    skills: [
      "数据清洗",
      "统计分析",
      "可视化图表",
      "预测建模",
      "异常检测",
    ],
    recentTasks: [
      {
        name: "竞品数据采集与可视化",
        status: "running",
        time: "进行中",
      },
      {
        name: "月度KPI仪表板更新",
        status: "done",
        time: "2h前",
      },
      {
        name: "用户行为漏斗分析",
        status: "done",
        time: "昨天",
      },
    ],
  },
};

const agentIconsLg: Record<string, React.ReactNode> = {
  小研: <Search className="h-5 w-5" />,
  小文: <Pen className="h-5 w-5" />,
  小拓: <Target className="h-5 w-5" />,
  小数: <BarChart3 className="h-5 w-5" />,
};

function generateBrainResponse(userInput: string): ChatMessage {
  const lowerInput = userInput.toLowerCase();
  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  if (
    lowerInput.includes("工作流") ||
    lowerInput.includes("流程")
  ) {
    return {
      id: `brain-${Date.now()}`,
      role: "brain",
      content: "已分析你的需求，我为你设计了以下工作流方案：",
      timestamp: timeStr,
      cards: [
        {
          type: "workflow",
          title: "自动化内容生产流水线",
          description: "基于你的描述，我设计了一个3步工作流",
          items: [
            "① 小研 — 调研收集素材与数据",
            "② 小文 — 根据素材生成内容初稿",
            "③ 小媒 — 格式优化、SEO处理与发布",
          ],
        },
      ],
      actions: [
        { label: "部署此工作流", type: "primary" },
        { label: "编辑调整", type: "secondary" },
      ],
    };
  }

  if (
    lowerInput.includes("任务") ||
    lowerInput.includes("发布")
  ) {
    return {
      id: `brain-${Date.now()}`,
      role: "brain",
      content: "好的，我来帮你创建任务。以下是任务配置预览：",
      timestamp: timeStr,
      cards: [
        {
          type: "task",
          title: "新任务",
          description: "基于你的描述自动解析",
          status: "待确认",
          items: [
            "执行者：自动匹配最佳员工",
            "优先级：中",
            "预计耗时：约2小时",
          ],
        },
      ],
      actions: [
        { label: "确认发布", type: "primary" },
        { label: "修改配置", type: "secondary" },
      ],
    };
  }

  if (
    lowerInput.includes("状态") ||
    lowerInput.includes("监控") ||
    lowerInput.includes("异常") ||
    lowerInput.includes("查看")
  ) {
    return {
      id: `brain-${Date.now()}`,
      role: "brain",
      content: "当前系统状态概览：",
      timestamp: timeStr,
      cards: [
        {
          type: "status",
          title: "全局状态仪表板",
          description: "实时数据",
          items: [
            "🟢 在线员工：4/5",
            "⚡ 运行中任务：3 个",
            "✅ 今日完成：12 个",
            "⚠️ 异常：无",
            "📊 整体成功率：97.8%",
          ],
        },
      ],
      actions: [{ label: "查看详细报表", type: "secondary" }],
    };
  }

  if (
    lowerInput.includes("团队") ||
    lowerInput.includes("调配") ||
    lowerInput.includes("人员")
  ) {
    return {
      id: `brain-${Date.now()}`,
      role: "brain",
      content: "当前团队配置如下，你可以告诉我需要怎样调整：",
      timestamp: timeStr,
      cards: [
        {
          type: "agent",
          title: "团队成员状态",
          description: "5名AI员工",
          items: [
            "小研（研究分析）— 空闲，可分配新任务",
            "小文（内容创作）— 执行中「Q1市场调研报告」",
            "小拓（业务拓展）— 空闲，可分配新任务",
            "小数（数据分析）— 执行中「竞品数据采集」",
            "小媒（媒体运营）— 离线",
          ],
        },
      ],
      actions: [
        { label: "调配成员", type: "primary" },
        { label: "启动离线员工", type: "secondary" },
      ],
    };
  }

  return {
    id: `brain-${Date.now()}`,
    role: "brain",
    content: `收到你的指令。我正在分析「${userInput}」的最佳执行方案...\n\n根据当前团队状况和知识库资源，建议将此任务分配给最匹配的AI员工自动执行。需要我进一步细化方案吗？`,
    timestamp: timeStr,
    actions: [
      { label: "自动执行", type: "primary" },
      { label: "让我选择员工", type: "secondary" },
    ],
  };
}

export function GlobalBrainView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    setTimeout(
      () => {
        const brainMsg = generateBrainResponse(content);
        setMessages((prev) => [...prev, brainMsg]);
        setIsThinking(false);
      },
      800 + Math.random() * 700,
    );
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black">
      {/* Header */}
      <div className="shrink-0 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2
                className="text-white flex items-center gap-2"
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                }}
              >
                全局大脑
                <Badge
                  variant="outline"
                  className="text-green-400 border-green-500/20 bg-green-500/10 gap-1 text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  在线
                </Badge>
              </h2>
              <p className="text-neutral-500 text-xs mt-0.5">
                用自然语言管理工作流、任务和AI团队
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onlineAgents.map((agent) => (
              <button
                key={agent.name}
                onClick={() =>
                  setActiveAgent(
                    activeAgent === agent.name
                      ? null
                      : agent.name,
                  )
                }
                className={`group relative flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
                  activeAgent === agent.name
                    ? "bg-white/15 border-white/30 ring-1 ring-white/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
                title={`${agent.name} - ${agent.role}`}
              >
                <span
                  className={
                    activeAgent === agent.name
                      ? "text-white"
                      : "text-neutral-400"
                  }
                >
                  {agent.icon}
                </span>
                <span
                  className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-black ${
                    agent.status === "working"
                      ? "bg-green-400 animate-pulse"
                      : "bg-neutral-500"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Detail Panel */}
      <AnimatePresence>
        {activeAgent &&
          agentDetails[activeAgent] &&
          (() => {
            const detail = agentDetails[activeAgent];
            return (
              <motion.div
                key={activeAgent}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="shrink-0 overflow-hidden border-b border-white/10"
              >
                <div className="px-6 py-4 bg-white/[0.02]">
                  <div className="max-w-3xl mx-auto">
                    {/* Agent Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                          {agentIconsLg[detail.name]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-white"
                              style={{ fontWeight: 600 }}
                            >
                              {detail.name}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs gap-1 ${
                                detail.status === "working"
                                  ? "text-green-400 border-green-500/20 bg-green-500/10"
                                  : "text-neutral-400 border-white/10 bg-white/5"
                              }`}
                            >
                              {detail.status === "working" && (
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              )}
                              {detail.status === "working"
                                ? "执行中"
                                : "空闲"}
                            </Badge>
                          </div>
                          <p className="text-neutral-500 text-xs mt-0.5">
                            {detail.role} · {detail.model}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveAgent(null)}
                        className="text-neutral-600 hover:text-neutral-400 transition-colors p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Current Task */}
                    {detail.currentTask && (
                      <div className="mb-4 px-3 py-2.5 rounded-lg bg-green-500/5 border border-green-500/10">
                        <div className="flex items-center gap-2">
                          <span className="inline-block w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin shrink-0" />
                          <span className="text-neutral-300 text-sm">
                            当前任务：{detail.currentTask}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[
                        {
                          label: "今日完成",
                          value: String(detail.todayCompleted),
                          icon: (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ),
                        },
                        {
                          label: "累计任务",
                          value: String(detail.totalTasks),
                          icon: (
                            <ListChecks className="h-3.5 w-3.5" />
                          ),
                        },
                        {
                          label: "成功率",
                          value: detail.successRate,
                          icon: (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ),
                        },
                        {
                          label: "平均耗时",
                          value: detail.avgTime,
                          icon: (
                            <Clock className="h-3.5 w-3.5" />
                          ),
                        },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="p-2.5 rounded-lg bg-white/5 border border-white/[0.06]"
                        >
                          <div className="flex items-center gap-1.5 text-neutral-500 text-xs mb-1">
                            {stat.icon}
                            {stat.label}
                          </div>
                          <div
                            className="text-white text-sm"
                            style={{ fontWeight: 600 }}
                          >
                            {stat.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Skills & Recent Tasks */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span
                          className="text-neutral-600 text-xs block mb-2"
                          style={{ fontWeight: 600 }}
                        >
                          技能标签
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {detail.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 rounded-md bg-white/5 border border-white/[0.06] text-neutral-400 text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span
                          className="text-neutral-600 text-xs block mb-2"
                          style={{ fontWeight: 600 }}
                        >
                          最近任务
                        </span>
                        <div className="space-y-1.5">
                          {detail.recentTasks.map((task) => (
                            <div
                              key={task.name}
                              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/[0.03]"
                            >
                              <div className="flex items-center gap-2">
                                {task.status === "running" ? (
                                  <span className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin shrink-0" />
                                ) : (
                                  <CheckCircle2 className="h-3 w-3 text-neutral-600 shrink-0" />
                                )}
                                <span
                                  className={`text-xs ${task.status === "running" ? "text-neutral-300" : "text-neutral-500"}`}
                                >
                                  {task.name}
                                </span>
                              </div>
                              <span className="text-neutral-700 text-xs">
                                {task.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions for this agent */}
                    <div className="flex gap-2 mt-4 pt-3 border-t border-white/[0.06]">
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-neutral-200 h-7 text-xs"
                        onClick={() => {
                          handleSend(
                            `给${detail.name}分配一个新任务`,
                          );
                          setActiveAgent(null);
                        }}
                      >
                        分配任务
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/10 text-neutral-400 bg-transparent hover:bg-white/5 h-7 text-xs"
                        onClick={() => {
                          handleSend(
                            `查看${detail.name}的详细工作报告`,
                          );
                          setActiveAgent(null);
                        }}
                      >
                        查看报告
                      </Button>
                      {detail.status === "idle" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-neutral-400 bg-transparent hover:bg-white/5 h-7 text-xs"
                          onClick={() => {
                            handleSend(
                              `暂停${detail.name}的所有任务`,
                            );
                            setActiveAgent(null);
                          }}
                        >
                          <Power className="h-3 w-3 mr-1" />
                          休眠
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 text-neutral-400 bg-transparent hover:bg-white/5 h-7 text-xs"
                          onClick={() => {
                            handleSend(
                              `暂停${detail.name}当前的任务「${detail.currentTask}」`,
                            );
                            setActiveAgent(null);
                          }}
                        >
                          暂停当前任务
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })()}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          /* Welcome Screen */
          <div className="flex flex-col items-center px-6 py-12 min-h-full overflow-y-auto">
            <div className="flex-1" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-2xl w-full"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h1
                className="text-white mb-2"
                style={{ fontSize: "1.75rem", fontWeight: 700 }}
              >
                你好，我是全局大脑
              </h1>
              <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                用自然语言告诉我你想做什么 —
                创建工作流、发布任务、监控状态、调配团队，一切尽在掌控
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8 max-w-lg mx-auto">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleSend(action.prompt)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-sm text-left"
                  >
                    {action.icon}
                    {action.label}
                  </button>
                ))}
              </div>

              {/* Suggestions */}
              <div className="space-y-2 max-w-lg mx-auto pb-4">
                <span
                  className="text-neutral-600 text-xs block mb-2"
                  style={{ fontWeight: 600 }}
                >
                  试试这样说
                </span>
                {suggestions.slice(0, 3).map((s, i) => (
                  <motion.button
                    key={s}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    onClick={() => handleSend(s)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] text-neutral-500 hover:text-neutral-300 hover:bg-white/5 hover:border-white/10 transition-all text-sm flex items-center justify-between group"
                  >
                    <span>"{s}"</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-3" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
            <div className="flex-1" />
          </div>
        ) : (
          /* Chat Messages */
          <div className="max-w-3xl mx-auto px-6 py-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "brain" && (
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-neutral-600 text-xs">
                        {msg.timestamp}
                      </span>
                      {msg.role === "brain" && (
                        <span className="text-neutral-600 text-xs">
                          全局大脑
                        </span>
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-white text-black rounded-br-md"
                          : "bg-white/5 border border-white/10 text-neutral-300 rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Rich Cards */}
                    {msg.cards?.map((card, ci) => (
                      <div
                        key={ci}
                        className="w-full p-4 rounded-xl border border-white/10 bg-white/[0.03]"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          {card.type === "workflow" && (
                            <Workflow className="h-4 w-4 text-white" />
                          )}
                          {card.type === "task" && (
                            <ListChecks className="h-4 w-4 text-white" />
                          )}
                          {card.type === "agent" && (
                            <Users className="h-4 w-4 text-white" />
                          )}
                          {card.type === "status" && (
                            <Globe className="h-4 w-4 text-white" />
                          )}
                          <span
                            className="text-white text-sm"
                            style={{ fontWeight: 600 }}
                          >
                            {card.title}
                          </span>
                          {card.status && (
                            <Badge
                              variant="outline"
                              className="text-xs text-neutral-400 border-white/10 bg-white/5 ml-auto"
                            >
                              {card.status}
                            </Badge>
                          )}
                        </div>
                        <p className="text-neutral-500 text-xs mb-3">
                          {card.description}
                        </p>
                        {card.items && (
                          <div className="space-y-1.5">
                            {card.items.map((item, ii) => (
                              <div
                                key={ii}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-neutral-300 text-sm"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Action Buttons */}
                    {msg.actions && (
                      <div className="flex gap-2 mt-1">
                        {msg.actions.map((action) => (
                          <Button
                            key={action.label}
                            size="sm"
                            variant={
                              action.type === "primary"
                                ? "default"
                                : "outline"
                            }
                            className={
                              action.type === "primary"
                                ? "bg-white text-black hover:bg-neutral-200 h-8 text-xs"
                                : "border-white/10 text-neutral-400 bg-transparent hover:bg-white/5 h-8 text-xs"
                            }
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Thinking Indicator */}
            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/5 border border-white/10 flex items-center gap-2">
                  <span className="flex gap-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </span>
                  <span className="text-neutral-500 text-xs ml-1">
                    思考中...
                  </span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-white/10 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-end gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 focus-within:border-white/20 transition-colors">
            <Command className="h-4 w-4 text-neutral-600 shrink-0 mb-2.5" />
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="告诉我你想做什么... 创建工作流、发布任务、监控状态"
              rows={1}
              className="flex-1 bg-transparent text-white placeholder:text-neutral-600 outline-none resize-none text-sm min-h-[36px] max-h-[120px] py-1.5"
              style={{ scrollbarWidth: "thin" }}
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isThinking}
              className="bg-white text-black hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed h-8 w-8 rounded-lg shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="flex items-center gap-3">
              <span className="text-neutral-700 text-xs">
                Shift+Enter 换行
              </span>
              <span className="text-neutral-700 text-xs">
                Enter 发送
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-700 text-xs">
              <Sparkles className="h-3 w-3" />
              已连接{" "}
              {
                onlineAgents.filter(
                  (a) => a.status === "working",
                ).length
              }{" "}
              个执行中员工
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}