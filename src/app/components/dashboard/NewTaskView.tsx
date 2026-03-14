import { useState, useCallback, useRef } from "react";
import {
  ArrowLeft,
  Sparkles,
  LayoutGrid,
  Send,
  Loader2,
  Bot,
  UsersRound,
  CheckCircle2,
  Plus,
  Search,
  Target,
  Pen,
  BarChart3,
  TrendingUp,
  Heart,
  Package,
  Zap,
  Workflow,
  GripVertical,
  Trash2,
  ArrowDown,
  Settings2,
  ChevronDown,
  Cpu,
  Thermometer,
  Hash,
  RotateCcw,
  Clock,
  Shield,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { agents, teams } from "../../data/mock-data";

// ── Scenarios ──
const scenarios = [
  {
    id: "market-research",
    label: "市场调研",
    icon: <Search className="h-4 w-4" />,
    description: "行业分析、竞品监测、趋势洞察",
    agentIds: ["market-researcher", "data-analyst"],
    teamIds: ["growth-team"],
  },
  {
    id: "content-marketing",
    label: "内容营销",
    icon: <Pen className="h-4 w-4" />,
    description: "文案创作、社媒运营、SEO优化",
    agentIds: ["content-writer", "social-media", "seo-specialist"],
    teamIds: ["content-team"],
  },
  {
    id: "sales-outreach",
    label: "销售拓客",
    icon: <Target className="h-4 w-4" />,
    description: "线索挖掘、客户触达、商机跟进",
    agentIds: ["sales-hunter", "customer-success"],
    teamIds: ["sales-team"],
  },
  {
    id: "data-analysis",
    label: "数据分析",
    icon: <BarChart3 className="h-4 w-4" />,
    description: "数据清洗、可视化、商业洞察",
    agentIds: ["data-analyst"],
    teamIds: [],
  },
  {
    id: "product-mgmt",
    label: "产品管理",
    icon: <Package className="h-4 w-4" />,
    description: "需求分析、PRD撰写、竞品研究",
    agentIds: ["product-manager"],
    teamIds: [],
  },
  {
    id: "customer-success",
    label: "客户成功",
    icon: <Heart className="h-4 w-4" />,
    description: "客户跟进、流失预警、满意度管理",
    agentIds: ["customer-success", "data-analyst"],
    teamIds: ["sales-team"],
  },
  {
    id: "growth-hack",
    label: "增长策略",
    icon: <TrendingUp className="h-4 w-4" />,
    description: "全链路增长、A/B测试、转化优化",
    agentIds: ["sales-hunter", "seo-specialist", "data-analyst"],
    teamIds: ["growth-team"],
  },
];

// ── Models ──
const availableModels = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", desc: "最强综合能力，推荐复杂任务", tag: "推荐" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", desc: "高性价比，适合简单任务", tag: "" },
  { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", desc: "强逻辑推理与长文本", tag: "" },
  { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", desc: "极速响应，轻量任务", tag: "" },
  { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", desc: "国产大模型，中文理解优秀", tag: "国产" },
  { id: "qwen-max", name: "通义千问 Max", provider: "阿里云", desc: "阿里旗舰模型，企业级稳定", tag: "国产" },
  { id: "glm-4", name: "GLM-4", provider: "智谱AI", desc: "中文场景深度优化", tag: "国产" },
];

// ── Workflow Node Types for Custom Builder ──
type NodeType = "agent" | "tool" | "condition" | "output";

interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  agentId?: string;
  toolName?: string;
  conditionExpr?: string;
}

const nodeTypeConfig: Record<NodeType, { label: string; color: string; borderColor: string }> = {
  agent: { label: "员工节点", color: "bg-blue-500/10", borderColor: "border-blue-500/30" },
  tool: { label: "工具节点", color: "bg-amber-500/10", borderColor: "border-amber-500/30" },
  condition: { label: "条件分支", color: "bg-purple-500/10", borderColor: "border-purple-500/30" },
  output: { label: "输出节点", color: "bg-green-500/10", borderColor: "border-green-500/30" },
};

const defaultNodes: WorkflowNode[] = [
  { id: "n-1", type: "agent", title: "数据采集", description: "从数据源抓取信息", agentId: "market-researcher" },
  { id: "n-2", type: "tool", title: "数据清洗", description: "去重、格式化、校验", toolName: "DataCleaner" },
  { id: "n-3", type: "agent", title: "分析处理", description: "AI分析并提取洞察", agentId: "data-analyst" },
  { id: "n-4", type: "output", title: "生成报告", description: "输出结构化报告" },
];

// ── Mock NLP workflow generator ──
interface GeneratedWorkflow {
  taskName: string;
  description: string;
  steps: { step: number; title: string; description: string; agentName: string }[];
  agents: { id: string; name: string; role: string }[];
  team: { name: string; description: string } | null;
  estimatedTime: string;
}

function generateMockWorkflow(input: string): GeneratedWorkflow {
  const lower = input.toLowerCase();
  if (lower.includes("调研") || lower.includes("市场") || lower.includes("分析行业")) {
    return {
      taskName: "市场调研分析任务",
      description: `基于您的描述："${input}"，已生成以下工作流方案`,
      steps: [
        { step: 1, title: "数据采集与清洗", description: "从多个数据源自动抓取行业信息，进行数据清洗", agentName: "小研" },
        { step: 2, title: "趋势分析建模", description: "运用AI算法识别关键趋势，建立分析模型", agentName: "小数" },
        { step: 3, title: "报告生成与可视化", description: "生成结构化调研报告，配套可视化图表", agentName: "小研" },
      ],
      agents: [
        { id: "market-researcher", name: "小研", role: "AI市场调研员" },
        { id: "data-analyst", name: "小数", role: "AI数据分析师" },
      ],
      team: { name: "AI增长团队", description: "协同完成调研与数据分析" },
      estimatedTime: "约 25 分钟",
    };
  }
  if (lower.includes("文章") || lower.includes("内容") || lower.includes("文案") || lower.includes("公众号")) {
    return {
      taskName: "内容创作任务",
      description: `基于您的描述："${input}"，已生成以下工作流方案`,
      steps: [
        { step: 1, title: "选题策划与热点分析", description: "追踪行业热点，确定内容方向和关键词", agentName: "小媒" },
        { step: 2, title: "内容撰写", description: "根据选题撰写高质量原创内容", agentName: "小文" },
        { step: 3, title: "SEO优化与适配", description: "关键词优化、标题结构调整，多平台格式适配", agentName: "小搜" },
        { step: 4, title: "排期与发布", description: "根据最佳时间窗口安排发布", agentName: "小媒" },
      ],
      agents: [
        { id: "content-writer", name: "小文", role: "AI内容创作员" },
        { id: "social-media", name: "小媒", role: "AI社媒运营员" },
        { id: "seo-specialist", name: "小搜", role: "AI SEO专员" },
      ],
      team: { name: "AI内容团队", description: "全链路内容生产与分发" },
      estimatedTime: "约 15 分钟",
    };
  }
  if (lower.includes("客户") || lower.includes("线索") || lower.includes("销售") || lower.includes("拓客")) {
    return {
      taskName: "销售拓客任务",
      description: `基于您的描述："${input}"，已生成以下工作流方案`,
      steps: [
        { step: 1, title: "目标画像定义", description: "确定理想客户画像(ICP)，设置筛选条件", agentName: "小拓" },
        { step: 2, title: "线索挖掘", description: "从多渠道发现匹配的潜在客户", agentName: "小拓" },
        { step: 3, title: "个性化触达方案", description: "生成定制化的触达内容和策略", agentName: "小拓" },
        { step: 4, title: "效果追踪", description: "分析触达转化数据，持续优化", agentName: "小数" },
      ],
      agents: [
        { id: "sales-hunter", name: "小拓", role: "AI销售拓客员" },
        { id: "data-analyst", name: "小数", role: "AI数据分析师" },
      ],
      team: { name: "AI销售团队", description: "从线索到成交全覆盖" },
      estimatedTime: "约 20 分钟",
    };
  }
  return {
    taskName: "自定义工作任务",
    description: `基于您的描述："${input}"，已生成以下工作流方案`,
    steps: [
      { step: 1, title: "需求理解与分析", description: "解析任务需求，确定执行策略", agentName: "小产" },
      { step: 2, title: "数据收集与处理", description: "从相关数据源收集所需信息", agentName: "小研" },
      { step: 3, title: "执行与输出", description: "执行核心任务逻辑，生成结果", agentName: "小文" },
      { step: 4, title: "结果审核与优化", description: "验证输出质量，进行必要优化", agentName: "小数" },
    ],
    agents: [
      { id: "product-manager", name: "小产", role: "AI产品经理" },
      { id: "market-researcher", name: "小研", role: "AI市场调研员" },
      { id: "content-writer", name: "小文", role: "AI内容创作员" },
      { id: "data-analyst", name: "小数", role: "AI数据分析师" },
    ],
    team: null,
    estimatedTime: "约 30 分钟",
  };
}

// ══════════════════════════════════════════════
// Model Config Section (shared across modes)
// ══════════════════════════════════════════════
function ModelConfigSection({
  selectedModel,
  setSelectedModel,
  temperature,
  setTemperature,
  maxTokens,
  setMaxTokens,
  autoRetry,
  setAutoRetry,
  timeout,
  setTimeout: setTimeoutVal,
}: {
  selectedModel: string;
  setSelectedModel: (v: string) => void;
  temperature: number;
  setTemperature: (v: number) => void;
  maxTokens: number;
  setMaxTokens: (v: number) => void;
  autoRetry: boolean;
  setAutoRetry: (v: boolean) => void;
  timeout: number;
  setTimeout: (v: number) => void;
}) {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const current = availableModels.find((m) => m.id === selectedModel)!;

  return (
    <Card className="bg-white/[0.03] border-white/10 text-white">
      <CardContent className="p-5">
        <h3 className="text-neutral-400 text-sm mb-4 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
          <Settings2 className="h-4 w-4" />
          模型配置
        </h3>

        {/* Model Selector */}
        <div className="mb-4">
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
                    <span className="text-white text-sm" style={{ fontWeight: 500 }}>{current.name}</span>
                    <span className="text-neutral-600 text-xs">{current.provider}</span>
                    {current.tag && (
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-green-400 bg-green-500/10 border-green-500/20">
                        {current.tag}
                      </Badge>
                    )}
                  </div>
                  <span className="text-neutral-500 text-xs">{current.desc}</span>
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

          {/* Timeout */}
          <div>
            <label className="text-neutral-500 text-xs mb-1.5 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              超时时间
            </label>
            <div className="flex items-center gap-2">
              {[5, 10, 30, 60].map((val) => (
                <button
                  key={val}
                  onClick={() => setTimeoutVal(val)}
                  className={`flex-1 py-1.5 rounded-md text-xs transition-colors ${
                    timeout === val
                      ? "bg-white text-black"
                      : "bg-white/5 text-neutral-500 hover:text-white border border-white/10"
                  }`}
                  style={{ fontWeight: timeout === val ? 600 : 400 }}
                >
                  {val}min
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
  );
}

// ══════════════════════════════════════════════
// Custom Workflow Node Editor
// ══════════════════════════════════════════════
function WorkflowEditor({
  nodes,
  setNodes,
}: {
  nodes: WorkflowNode[];
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;
}) {
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const addNode = (type: NodeType) => {
    const id = `n-${Date.now()}`;
    const defaults: Record<NodeType, Partial<WorkflowNode>> = {
      agent: { title: "新员工节点", description: "分配AI员工执行任务", agentId: agents[0].id },
      tool: { title: "新工具节点", description: "调用外部工具或API", toolName: "" },
      condition: { title: "条件分支", description: "根据条件选择路径", conditionExpr: "" },
      output: { title: "输出节点", description: "汇总并输出结果" },
    };
    setNodes((prev) => [...prev, { id, type, ...defaults[type] } as WorkflowNode]);
    setAddMenuOpen(false);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    if (editingNode === id) setEditingNode(null);
  };

  const updateNode = (id: string, patch: Partial<WorkflowNode>) => {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  };

  const moveNode = (idx: number, dir: -1 | 1) => {
    setNodes((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  return (
    <div>
      {/* Canvas area */}
      <div className="relative">
        {/* Start node */}
        <div className="flex items-center justify-center mb-2">
          <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs" style={{ fontWeight: 500 }}>
            Start
          </div>
        </div>

        {nodes.map((node, i) => {
          const cfg = nodeTypeConfig[node.type];
          const isEditing = editingNode === node.id;
          const agentForNode = agents.find((a) => a.id === node.agentId);

          return (
            <div key={node.id}>
              {/* Connector */}
              <div className="flex justify-center py-1">
                <div className="w-px h-5 bg-white/20" />
              </div>

              {/* Node */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative rounded-lg border ${cfg.borderColor} ${cfg.color} p-3 transition-colors ${
                  isEditing ? "ring-1 ring-white/30" : "hover:ring-1 hover:ring-white/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Drag & Order */}
                  <div className="flex flex-col items-center gap-0.5 pt-0.5">
                    <button
                      onClick={() => moveNode(i, -1)}
                      disabled={i === 0}
                      className="text-neutral-600 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <ArrowDown className="h-3 w-3 rotate-180" />
                    </button>
                    <GripVertical className="h-3.5 w-3.5 text-neutral-600" />
                    <button
                      onClick={() => moveNode(i, 1)}
                      disabled={i === nodes.length - 1}
                      className="text-neutral-600 hover:text-white disabled:opacity-20 transition-colors"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${cfg.borderColor} text-neutral-300`}>
                        {cfg.label}
                      </Badge>
                      <span className="text-neutral-500 text-[10px]">#{i + 1}</span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 mt-2">
                        <Input
                          value={node.title}
                          onChange={(e) => updateNode(node.id, { title: e.target.value })}
                          className="bg-white/5 border-white/10 text-white text-sm h-8 placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20"
                          placeholder="节点名称"
                        />
                        <Input
                          value={node.description}
                          onChange={(e) => updateNode(node.id, { description: e.target.value })}
                          className="bg-white/5 border-white/10 text-white text-sm h-8 placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20"
                          placeholder="节点描述"
                        />
                        {node.type === "agent" && (
                          <div>
                            <label className="text-neutral-500 text-xs mb-1 block">分配员工</label>
                            <div className="flex flex-wrap gap-1.5">
                              {agents.map((a) => (
                                <button
                                  key={a.id}
                                  onClick={() => updateNode(node.id, { agentId: a.id })}
                                  className={`px-2 py-1 rounded text-xs transition-colors border ${
                                    node.agentId === a.id
                                      ? "bg-white text-black border-white"
                                      : "bg-white/5 text-neutral-400 border-white/10 hover:text-white"
                                  }`}
                                >
                                  {a.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {node.type === "condition" && (
                          <Input
                            value={node.conditionExpr || ""}
                            onChange={(e) => updateNode(node.id, { conditionExpr: e.target.value })}
                            className="bg-white/5 border-white/10 text-white text-sm h-8 font-mono placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20"
                            placeholder='e.g. data.length > 100 ? "A" : "B"'
                          />
                        )}
                        <Button
                          size="sm"
                          className="bg-white text-black hover:bg-neutral-200 h-7 text-xs mt-1"
                          onClick={() => setEditingNode(null)}
                        >
                          完成编辑
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer"
                        onClick={() => setEditingNode(node.id)}
                      >
                        <span className="text-white text-sm block" style={{ fontWeight: 500 }}>
                          {node.title}
                        </span>
                        <span className="text-neutral-500 text-xs">{node.description}</span>
                        {node.type === "agent" && agentForNode && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
                              <Bot className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-neutral-400 text-xs">{agentForNode.name} · {agentForNode.role}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingNode(isEditing ? null : node.id)}
                      className="p-1 rounded text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Pen className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => removeNode(node.id)}
                      className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}

        {/* Connector to End */}
        <div className="flex justify-center py-1">
          <div className="w-px h-5 bg-white/20" />
        </div>

        {/* Add Node */}
        <div className="flex justify-center mb-2 relative">
          <button
            onClick={() => setAddMenuOpen(!addMenuOpen)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-dashed border-white/20 text-neutral-400 hover:text-white hover:border-white/40 text-xs transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            添加节点
          </button>

          <AnimatePresence>
            {addMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full mt-2 z-20 rounded-lg bg-neutral-900 border border-white/10 shadow-2xl p-1 min-w-[160px]"
              >
                {(Object.keys(nodeTypeConfig) as NodeType[]).map((type) => {
                  const cfg = nodeTypeConfig[type];
                  return (
                    <button
                      key={type}
                      onClick={() => addNode(type)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-neutral-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${cfg.borderColor} border`} />
                      {cfg.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Connector */}
        <div className="flex justify-center py-1">
          <div className="w-px h-5 bg-white/20" />
        </div>

        {/* End node */}
        <div className="flex items-center justify-center">
          <div className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs" style={{ fontWeight: 500 }}>
            End
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Main Component
// ══════════════════════════════════════════════
export function NewTaskView({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<"nlp" | "scenario" | "custom">("nlp");

  // NLP state
  const [nlInput, setNlInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<GeneratedWorkflow | null>(null);

  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  // Custom state
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>(defaultNodes);

  // Model config state (shared)
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(8192);
  const [autoRetry, setAutoRetry] = useState(true);
  const [timeout, setTimeoutVal] = useState(10);

  // Helpers
  const handleGenerate = useCallback(() => {
    if (!nlInput.trim()) return;
    setIsGenerating(true);
    setGeneratedWorkflow(null);
    setTimeout(() => {
      setGeneratedWorkflow(generateMockWorkflow(nlInput));
      setIsGenerating(false);
    }, 1800);
  }, [nlInput]);

  const handleAddItem = useCallback((id: string) => {
    setAddedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const activeScenario = scenarios.find((s) => s.id === selectedScenario);
  const scenarioAgents = activeScenario ? agents.filter((a) => activeScenario.agentIds.includes(a.id)) : [];
  const scenarioTeams = activeScenario ? teams.filter((t) => activeScenario.teamIds.includes(t.id)) : [];

  // Should show config? Only when task is "ready"
  const showConfig =
    (mode === "nlp" && generatedWorkflow !== null && !isGenerating) ||
    (mode === "scenario" && addedItems.size > 0) ||
    (mode === "custom" && workflowNodes.length > 0);

  const modelConfigProps = {
    selectedModel,
    setSelectedModel,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    autoRetry,
    setAutoRetry,
    timeout,
    setTimeout: setTimeoutVal,
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回任务中心
        </button>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-white text-xl" style={{ fontWeight: 600 }}>
            创建新任务
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            选择一种方式开始创建：自然语言描述、场景推荐或自定义工作流
          </p>
        </div>

        {/* Mode Switch – 3 buttons */}
        <div className="mb-8 flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10 w-fit">
          {([
            { key: "nlp" as const, icon: <Sparkles className="h-4 w-4" />, label: "AI 描述生成" },
            { key: "scenario" as const, icon: <LayoutGrid className="h-4 w-4" />, label: "场景推荐" },
            { key: "custom" as const, icon: <Workflow className="h-4 w-4" />, label: "自定义" },
          ] as const).map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm transition-all ${
                mode === m.key ? "bg-white text-black" : "text-neutral-400 hover:text-white"
              }`}
              style={{ fontWeight: mode === m.key ? 600 : 400 }}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ═══ NLP Mode ═══ */}
          {mode === "nlp" && (
            <motion.div
              key="nlp"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {/* Input */}
              <Card className="bg-white/[0.03] border-white/10 text-white mb-6">
                <CardContent className="p-5">
                  <label className="text-neutral-400 text-sm mb-3 block" style={{ fontWeight: 500 }}>
                    用自然语言描述你想完成的任务
                  </label>
                  <textarea
                    value={nlInput}
                    onChange={(e) => setNlInput(e.target.value)}
                    placeholder="例如：帮我分析2026年中国SaaS行业趋势，生成一份完整的调研报告，包含市场规模、竞争格局和关键机会点..."
                    className="w-full min-h-[120px] bg-white/5 border border-white/10 rounded-lg p-4 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
                    }}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-neutral-600 text-xs">Ctrl + Enter 快捷发送</span>
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-neutral-200 gap-1.5"
                      onClick={handleGenerate}
                      disabled={!nlInput.trim() || isGenerating}
                    >
                      {isGenerating ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" />生成中...</>
                      ) : (
                        <><Sparkles className="h-3.5 w-3.5" />生成任务工作流</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Example prompts */}
              {!generatedWorkflow && !isGenerating && (
                <div className="mb-6">
                  <span className="text-neutral-600 text-xs mb-3 block" style={{ fontWeight: 500 }}>试试这些示例</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "分析2026年新能源汽车行业趋势，输出调研报告",
                      "为我们的AI产品写一篇小红书种草文案",
                      "挖掘北京地区B轮以上SaaS企业决策者线索",
                      "分析上月用户留存数据，找出流失原因",
                    ].map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setNlInput(ex)}
                        className="text-left p-3 rounded-lg bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 transition-colors text-neutral-400 text-sm group"
                      >
                        <span className="flex items-center gap-2">
                          <Send className="h-3 w-3 text-neutral-600 group-hover:text-neutral-300 transition-colors shrink-0" />
                          {ex}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading */}
              {isGenerating && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-4">
                    <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-white animate-spin" />
                    <Sparkles className="h-5 w-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-neutral-400 text-sm">AI 正在理解您的需求，生成最佳工作流...</p>
                </div>
              )}

              {/* Generated Result */}
              {generatedWorkflow && !isGenerating && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-white" style={{ fontWeight: 600 }}>{generatedWorkflow.taskName}</h2>
                      <p className="text-neutral-500 text-xs mt-0.5">{generatedWorkflow.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs py-0 text-neutral-400 bg-white/5 border-white/10">
                      预计 {generatedWorkflow.estimatedTime}
                    </Badge>
                  </div>

                  {/* Steps */}
                  <Card className="bg-white/[0.03] border-white/10 text-white mb-4">
                    <CardContent className="p-5">
                      <h3 className="text-neutral-400 text-sm mb-4" style={{ fontWeight: 600 }}>工作流步骤</h3>
                      <div className="space-y-0">
                        {generatedWorkflow.steps.map((step, i) => (
                          <div key={step.step} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs shrink-0" style={{ fontWeight: 600 }}>{step.step}</div>
                              {i < generatedWorkflow.steps.length - 1 && <div className="w-px h-full min-h-[24px] bg-white/10 my-1" />}
                            </div>
                            <div className="pb-4 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white text-sm" style={{ fontWeight: 500 }}>{step.title}</span>
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-neutral-500 bg-white/5 border-white/10">{step.agentName}</Badge>
                              </div>
                              <p className="text-neutral-500 text-xs mt-0.5">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Agents & Team */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="bg-white/[0.03] border-white/10 text-white">
                      <CardContent className="p-5">
                        <h3 className="text-neutral-400 text-sm mb-3" style={{ fontWeight: 600 }}>
                          <Bot className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />分配员工
                        </h3>
                        <div className="space-y-2">
                          {generatedWorkflow.agents.map((a) => (
                            <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/10">
                              <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center"><Bot className="h-4 w-4 text-white" /></div>
                              <div className="flex-1 min-w-0">
                                <span className="text-white text-sm block" style={{ fontWeight: 500 }}>{a.name}</span>
                                <span className="text-neutral-500 text-xs">{a.role}</span>
                              </div>
                              <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    {generatedWorkflow.team && (
                      <Card className="bg-white/[0.03] border-white/10 text-white">
                        <CardContent className="p-5">
                          <h3 className="text-neutral-400 text-sm mb-3" style={{ fontWeight: 600 }}>
                            <UsersRound className="h-4 w-4 inline-block mr-1.5 -mt-0.5" />推荐团队
                          </h3>
                          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-white text-sm block" style={{ fontWeight: 500 }}>{generatedWorkflow.team.name}</span>
                                <span className="text-neutral-500 text-xs">{generatedWorkflow.team.description}</span>
                              </div>
                              <Badge variant="outline" className="text-[10px] py-0 text-green-400 bg-green-500/10 border-green-500/20 shrink-0">推荐</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Model Config */}
                  <div className="mb-6">
                    <ModelConfigSection {...modelConfigProps} />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button className="bg-white text-black hover:bg-neutral-200 gap-1.5">
                      <Zap className="h-3.5 w-3.5" />确认并创建任务
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/10 text-neutral-400 hover:text-white bg-transparent"
                      onClick={() => { setGeneratedWorkflow(null); setNlInput(""); }}
                    >
                      重新描述
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ═══ Scenario Mode ═══ */}
          {mode === "scenario" && (
            <motion.div
              key="scenario"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {/* Tags */}
              <div className="mb-6">
                <span className="text-neutral-500 text-sm mb-3 block" style={{ fontWeight: 500 }}>选择业务场景</span>
                <div className="flex flex-wrap gap-2">
                  {scenarios.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => setSelectedScenario(sc.id === selectedScenario ? null : sc.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors border ${
                        selectedScenario === sc.id
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {sc.icon}
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeScenario && (
                <motion.div key={activeScenario.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                  <div className="mb-4">
                    <h2 className="text-white" style={{ fontWeight: 600 }}>{activeScenario.label}</h2>
                    <p className="text-neutral-500 text-sm mt-0.5">{activeScenario.description}</p>
                  </div>

                  {/* Agents */}
                  {scenarioAgents.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-neutral-400 text-sm mb-3 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                        <Bot className="h-4 w-4" />推荐员工
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {scenarioAgents.map((agent) => {
                          const isAdded = addedItems.has(agent.id);
                          return (
                            <Card
                              key={agent.id}
                              className={`transition-colors cursor-pointer ${isAdded ? "bg-white/[0.06] border-white/20" : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"}`}
                              onClick={() => handleAddItem(agent.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0"><Bot className="h-5 w-5 text-white" /></div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-white text-sm" style={{ fontWeight: 500 }}>{agent.name}</span>
                                      {isAdded ? <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" /> : <Plus className="h-4 w-4 text-neutral-600 shrink-0" />}
                                    </div>
                                    <span className="text-neutral-500 text-xs">{agent.role}</span>
                                    <p className="text-neutral-600 text-xs mt-1 line-clamp-2">{agent.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {agent.tags.slice(0, 3).map((tag) => (
                                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-500">{tag}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Teams */}
                  {scenarioTeams.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-neutral-400 text-sm mb-3 flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                        <UsersRound className="h-4 w-4" />推荐团队
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {scenarioTeams.map((team) => {
                          const isAdded = addedItems.has(team.id);
                          const teamAgentsList = agents.filter((a) => team.agentIds.includes(a.id));
                          return (
                            <Card
                              key={team.id}
                              className={`transition-colors cursor-pointer ${isAdded ? "bg-white/[0.06] border-white/20" : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06]"}`}
                              onClick={() => handleAddItem(team.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-2xl shrink-0">{team.icon}</div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <span className="text-white text-sm" style={{ fontWeight: 500 }}>{team.name}</span>
                                      {isAdded ? <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" /> : <Plus className="h-4 w-4 text-neutral-600 shrink-0" />}
                                    </div>
                                    <span className="text-neutral-500 text-xs">{team.description}</span>
                                    <div className="flex items-center gap-1.5 mt-2">
                                      <span className="text-neutral-600 text-xs">成员：</span>
                                      {teamAgentsList.map((a) => (
                                        <Badge key={a.id} variant="outline" className="text-[10px] py-0 px-1.5 text-neutral-400 bg-white/5 border-white/10">{a.name}</Badge>
                                      ))}
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {team.useCases.slice(0, 2).map((uc) => (
                                        <span key={uc} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-500">{uc}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Task form + Config when items selected */}
                  {addedItems.size > 0 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                      {/* Task Info */}
                      <Card className="bg-white/[0.03] border-white/10 text-white mb-4">
                        <CardContent className="p-5">
                          <h3 className="text-neutral-400 text-sm mb-3" style={{ fontWeight: 600 }}>任务信息</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="text-neutral-500 text-xs mb-1.5 block">任务名称</label>
                              <Input
                                placeholder={`${activeScenario.label}任务`}
                                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20"
                              />
                            </div>
                            <div>
                              <label className="text-neutral-500 text-xs mb-1.5 block">任务描述（可选）</label>
                              <textarea
                                placeholder="补充任务的具体要求和期望输出..."
                                className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 resize-none"
                              />
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
                            <span>已选择：</span>
                            {Array.from(addedItems).map((id) => {
                              const agent = agents.find((a) => a.id === id);
                              const team = teams.find((t) => t.id === id);
                              const name = agent?.name || team?.name || id;
                              return (
                                <Badge key={id} variant="outline" className="text-[10px] py-0 px-1.5 text-neutral-300 bg-white/5 border-white/10">
                                  {agent ? <Bot className="h-2.5 w-2.5 mr-0.5" /> : <UsersRound className="h-2.5 w-2.5 mr-0.5" />}
                                  {name}
                                </Badge>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Model Config */}
                      <div className="mb-6">
                        <ModelConfigSection {...modelConfigProps} />
                      </div>

                      <div className="flex items-center gap-3">
                        <Button className="bg-white text-black hover:bg-neutral-200 gap-1.5">
                          <Zap className="h-3.5 w-3.5" />创建任务
                        </Button>
                        <Button
                          variant="outline"
                          className="border-white/10 text-neutral-400 hover:text-white bg-transparent"
                          onClick={() => setAddedItems(new Set())}
                        >
                          清除选择
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {!activeScenario && (
                <div className="text-center py-16">
                  <LayoutGrid className="h-10 w-10 mx-auto mb-3 text-neutral-700" />
                  <p className="text-neutral-500 text-sm">选择一个业务场景，查看推荐的员工和团队</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ══��� Custom Mode – Workflow Node Editor ═══ */}
          {mode === "custom" && (
            <motion.div
              key="custom"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-white" style={{ fontWeight: 600 }}>工作流编辑器</h2>
                  <p className="text-neutral-500 text-sm mt-0.5">拖拽排序节点、添加员工/工具/条件分支来构建自定义工作流</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs py-0 text-neutral-400 bg-white/5 border-white/10">
                    {workflowNodes.length} 个节点
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-neutral-400 hover:text-white bg-transparent h-7 text-xs"
                    onClick={() => setWorkflowNodes(defaultNodes)}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    重置
                  </Button>
                </div>
              </div>

              {/* Node type legend */}
              <div className="flex flex-wrap gap-3 mb-5">
                {(Object.keys(nodeTypeConfig) as NodeType[]).map((type) => {
                  const cfg = nodeTypeConfig[type];
                  return (
                    <div key={type} className="flex items-center gap-1.5 text-xs text-neutral-500">
                      <div className={`w-2.5 h-2.5 rounded-sm border ${cfg.borderColor} ${cfg.color}`} />
                      {cfg.label}
                    </div>
                  );
                })}
              </div>

              {/* Editor Canvas */}
              <Card className="bg-white/[0.03] border-white/10 text-white mb-6">
                <CardContent className="p-5">
                  <WorkflowEditor nodes={workflowNodes} setNodes={setWorkflowNodes} />
                </CardContent>
              </Card>

              {/* Task Info */}
              {workflowNodes.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className="bg-white/[0.03] border-white/10 text-white mb-4">
                    <CardContent className="p-5">
                      <h3 className="text-neutral-400 text-sm mb-3" style={{ fontWeight: 600 }}>任务信息</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-neutral-500 text-xs mb-1.5 block">任务名称</label>
                          <Input
                            placeholder="自定义工作流任务"
                            className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600 focus-visible:border-white/30 focus-visible:ring-white/20"
                          />
                        </div>
                        <div>
                          <label className="text-neutral-500 text-xs mb-1.5 block">任务描述（可选）</label>
                          <textarea
                            placeholder="补充任务的具体要求和期望输出..."
                            className="w-full min-h-[80px] bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 resize-none"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
                        <span>节点摘要：</span>
                        {workflowNodes.map((node) => {
                          const cfg = nodeTypeConfig[node.type];
                          return (
                            <Badge key={node.id} variant="outline" className={`text-[10px] py-0 px-1.5 ${cfg.borderColor} text-neutral-300`}>
                              {node.title}
                            </Badge>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Model Config */}
                  <div className="mb-6">
                    <ModelConfigSection {...modelConfigProps} />
                  </div>

                  <div className="flex items-center gap-3">
                    <Button className="bg-white text-black hover:bg-neutral-200 gap-1.5">
                      <Zap className="h-3.5 w-3.5" />创建任务
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/10 text-neutral-400 hover:text-white bg-transparent"
                      onClick={() => setWorkflowNodes([])}
                    >
                      清空节点
                    </Button>
                  </div>
                </motion.div>
              )}

              {workflowNodes.length === 0 && (
                <div className="text-center py-16">
                  <Workflow className="h-10 w-10 mx-auto mb-3 text-neutral-700" />
                  <p className="text-neutral-500 text-sm">点击「添加节点」开始构建您的自定义工作流</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
