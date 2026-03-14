import React, { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  X,
  GripVertical,
  Search,
  Pen,
  Target,
  BarChart3,
  Package,
  Sparkles,
  Users,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Play,
  Workflow,
  Bot,
  Zap,
  ArrowRight,
  Settings,
  Send,
  Eye,
  MessageSquare,
  FileText,
  Globe,
  Database,
  Brain,
  Code,
  GitBranch,
  Timer,
  Filter,
  BookOpen,
  HardDrive,
  MessageCircleQuestion,
  Rss,
  History,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { agents as allAgents } from "../data/mock-data";
import type { Agent, Team } from "../data/mock-data";
import { WorkflowEditor } from "./WorkflowEditor";

// ===== Types =====
interface Position {
  x: number;
  y: number;
}

interface NodePort {
  id: string;
  label: string;
  type: "input" | "output";
}

interface TeamWorkflowNode {
  id: string;
  nodeType: "agent" | "trigger" | "output" | "tool";
  label: string;
  description: string;
  position: Position;
  icon: string;
  color: string;
  ports: NodePort[];
  agentId?: string; // linked agent id for agent nodes
  agentData?: Agent;
}

interface Connection {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
}

interface AgentTemplate {
  type: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  agentId: string;
  agentData: Agent;
  ports: NodePort[];
}

interface ToolTemplate {
  type: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  ports: NodePort[];
}

type SidebarTemplate = AgentTemplate | ToolTemplate;

// ===== Agent icon mapping =====
const agentIconMap: Record<string, React.ReactNode> = {
  "小研": <Search className="h-4 w-4" />,
  "小文": <Pen className="h-4 w-4" />,
  "小拓": <Target className="h-4 w-4" />,
  "小数": <BarChart3 className="h-4 w-4" />,
  "小产": <Package className="h-4 w-4" />,
  "小媒": <Sparkles className="h-4 w-4" />,
  "小客": <Users className="h-4 w-4" />,
  "小搜": <Search className="h-4 w-4" />,
};

const agentIconMapLg: Record<string, React.ReactNode> = {
  "小研": <Search className="h-5 w-5" />,
  "小文": <Pen className="h-5 w-5" />,
  "小拓": <Target className="h-5 w-5" />,
  "小数": <BarChart3 className="h-5 w-5" />,
  "小产": <Package className="h-5 w-5" />,
  "小媒": <Sparkles className="h-5 w-5" />,
  "小客": <Users className="h-5 w-5" />,
  "小搜": <Search className="h-5 w-5" />,
};

const toolIconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="h-4 w-4" />,
  Send: <Send className="h-4 w-4" />,
  Eye: <Eye className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  Globe: <Globe className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
  Brain: <Brain className="h-4 w-4" />,
  Bot: <Bot className="h-4 w-4" />,
  Code: <Code className="h-4 w-4" />,
  GitBranch: <GitBranch className="h-4 w-4" />,
  Timer: <Timer className="h-4 w-4" />,
  Filter: <Filter className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Search: <Search className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  HardDrive: <HardDrive className="h-4 w-4" />,
  MessageCircleQuestion: <MessageCircleQuestion className="h-4 w-4" />,
  Rss: <Rss className="h-4 w-4" />,
  History: <History className="h-4 w-4" />,
};

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400" },
  sky: { bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-400" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400" },
  pink: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400" },
  teal: { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-400" },
  white: { bg: "bg-white/10", border: "border-white/30", text: "text-white" },
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400" },
};

// Assign colors to agents
const agentColorPalette = ["blue", "violet", "cyan", "amber", "pink", "teal", "orange", "emerald"];

const ITEM_TYPE = "TEAM_MODULE";

// ===== Tool templates for triggers and outputs =====
const toolCategories: { name: string; icon: React.ReactNode; templates: ToolTemplate[] }[] = [
  {
    name: "触发器",
    icon: <Send className="h-4 w-4" />,
    templates: [
      {
        type: "trigger-manual",
        label: "手动触发",
        description: "手动启动团队协作流程",
        icon: "Send",
        color: "emerald",
        category: "触发器",
        ports: [{ id: "out", label: "输出", type: "output" }],
      },
      {
        type: "trigger-schedule",
        label: "定时触发",
        description: "按计划自动运行",
        icon: "Timer",
        color: "emerald",
        category: "触发器",
        ports: [{ id: "out", label: "输出", type: "output" }],
      },
      {
        type: "trigger-webhook",
        label: "Webhook 触发",
        description: "接收外部系统事件",
        icon: "Globe",
        color: "emerald",
        category: "触发器",
        ports: [{ id: "out", label: "输出", type: "output" }],
      },
    ],
  },
  {
    name: "知识库 / 记忆",
    icon: <BookOpen className="h-4 w-4" />,
    templates: [
      {
        type: "kb-document",
        label: "文档知识库",
        description: "团队共享文档、报告检索",
        icon: "BookOpen",
        color: "indigo",
        category: "知识库 / 记忆",
        ports: [
          { id: "in", label: "查询", type: "input" },
          { id: "out", label: "检索结果", type: "output" },
        ],
      },
      {
        type: "kb-qa",
        label: "问答对知识库",
        description: "团队FAQ、标准问答匹配",
        icon: "MessageCircleQuestion",
        color: "indigo",
        category: "知识库 / 记忆",
        ports: [
          { id: "in", label: "问题", type: "input" },
          { id: "out", label: "答案", type: "output" },
        ],
      },
      {
        type: "kb-database",
        label: "结构化数据库",
        description: "团队数据仓库、CRM数据查询",
        icon: "HardDrive",
        color: "indigo",
        category: "知识库 / 记忆",
        ports: [
          { id: "in", label: "查询", type: "input" },
          { id: "out", label: "数据", type: "output" },
        ],
      },
      {
        type: "kb-web",
        label: "网页抓取源",
        description: "实时抓取行业资讯和数据",
        icon: "Rss",
        color: "indigo",
        category: "知识库 / 记忆",
        ports: [
          { id: "in", label: "查询", type: "input" },
          { id: "out", label: "内容", type: "output" },
        ],
      },
      {
        type: "kb-memory",
        label: "团队协作记忆",
        description: "跨员工协作上下文和历史决策",
        icon: "History",
        color: "indigo",
        category: "知识库 / 记忆",
        ports: [
          { id: "in", label: "输入", type: "input" },
          { id: "out", label: "记忆上下文", type: "output" },
        ],
      },
    ],
  },
  {
    name: "逻辑控制",
    icon: <GitBranch className="h-4 w-4" />,
    templates: [
      {
        type: "condition",
        label: "条件分支",
        description: "根据条件选择不同路径",
        icon: "GitBranch",
        color: "sky",
        category: "逻辑控制",
        ports: [
          { id: "in", label: "输入", type: "input" },
          { id: "true", label: "是", type: "output" },
          { id: "false", label: "否", type: "output" },
        ],
      },
      {
        type: "parallel",
        label: "并行执行",
        description: "同时执行多个分支",
        icon: "Zap",
        color: "sky",
        category: "逻辑控制",
        ports: [
          { id: "in", label: "输入", type: "input" },
          { id: "out-a", label: "分支A", type: "output" },
          { id: "out-b", label: "分支B", type: "output" },
        ],
      },
      {
        type: "merger",
        label: "结果合并",
        description: "合并多个分支的结果",
        icon: "Filter",
        color: "sky",
        category: "逻辑控制",
        ports: [
          { id: "in-a", label: "输入A", type: "input" },
          { id: "in-b", label: "输入B", type: "input" },
          { id: "out", label: "输出", type: "output" },
        ],
      },
    ],
  },
  {
    name: "输出",
    icon: <Eye className="h-4 w-4" />,
    templates: [
      {
        type: "output-report",
        label: "报告输出",
        description: "生成并导出最终报告",
        icon: "FileText",
        color: "rose",
        category: "输出",
        ports: [{ id: "in", label: "输入", type: "input" }],
      },
      {
        type: "output-notify",
        label: "通知推送",
        description: "将结果推送到通知渠道",
        icon: "MessageSquare",
        color: "rose",
        category: "输出",
        ports: [{ id: "in", label: "输入", type: "input" }],
      },
      {
        type: "output-api",
        label: "API 回调",
        description: "将结果推送到外部系统",
        icon: "Globe",
        color: "rose",
        category: "输出",
        ports: [{ id: "in", label: "输入", type: "input" }],
      },
    ],
  },
];

// ===== Sidebar draggable item =====
function SidebarItem({ template, isAgent }: { template: SidebarTemplate; isAgent?: boolean }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { template, isAgent: !!isAgent },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const colors = colorMap[template.color] || colorMap.white;
  const icon = isAgent
    ? agentIconMap[(template as AgentTemplate).agentData?.name || ""] || <Bot className="h-4 w-4" />
    : toolIconMap[template.icon] || <Zap className="h-4 w-4" />;

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all border border-transparent hover:border-white/10 hover:bg-white/5 ${isDragging ? "opacity-40" : ""}`}
    >
      <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text} shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm text-neutral-200 truncate">{template.label}</div>
        <div className="text-xs text-neutral-500 truncate">{template.description}</div>
      </div>
      <GripVertical className="h-3.5 w-3.5 text-neutral-600 shrink-0" />
    </div>
  );
}

// ===== Canvas Node for Team workflow =====
function TeamCanvasNode({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onDelete,
  onPortMouseDown,
  onPortMouseUp,
  portPositions,
  onEditAgentWorkflow,
}: {
  node: TeamWorkflowNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string) => void;
  onPortMouseDown: (nodeId: string, portId: string, type: "input" | "output", e: React.MouseEvent) => void;
  onPortMouseUp: (nodeId: string, portId: string, type: "input" | "output") => void;
  portPositions: React.MutableRefObject<Record<string, { x: number; y: number }>>;
  onEditAgentWorkflow?: (agent: Agent) => void;
}) {
  const colors = colorMap[node.color] || colorMap.white;
  const inputPorts = node.ports.filter((p) => p.type === "input");
  const outputPorts = node.ports.filter((p) => p.type === "output");
  const nodeRef = useRef<HTMLDivElement>(null);

  const isAgent = node.nodeType === "agent";
  const nodeIcon = isAgent
    ? agentIconMapLg[node.agentData?.name || ""] || <Bot className="h-5 w-5" />
    : toolIconMap[node.icon] || <Zap className="h-4 w-4" />;

  useEffect(() => {
    if (!nodeRef.current) return;
    const nodeEl = nodeRef.current;
    const portEls = nodeEl.querySelectorAll("[data-port-id]");
    portEls.forEach((el) => {
      const portId = el.getAttribute("data-port-id")!;
      const rect = el.getBoundingClientRect();
      const canvasEl = nodeEl.closest("[data-canvas]");
      if (canvasEl) {
        const canvasRect = canvasEl.getBoundingClientRect();
        portPositions.current[`${node.id}-${portId}`] = {
          x: rect.left + rect.width / 2 - canvasRect.left + canvasEl.scrollLeft,
          y: rect.top + rect.height / 2 - canvasRect.top + canvasEl.scrollTop,
        };
      }
    });
  });

  return (
    <div
      ref={nodeRef}
      className="absolute group select-none"
      style={{ left: node.position.x, top: node.position.y, zIndex: isSelected ? 10 : 1 }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(node.id);
        onDragStart(node.id, e);
      }}
    >
      <div
        className={`rounded-xl border backdrop-blur-sm transition-all cursor-move ${
          isAgent ? "w-64" : "w-56"
        } ${
          isSelected
            ? `${colors.border} shadow-lg ring-1 ring-white/20`
            : "border-white/10 hover:border-white/20"
        } bg-neutral-900/95`}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2.5">
          <div className={`${isAgent ? "w-9 h-9" : "w-7 h-7"} rounded-lg ${colors.bg} flex items-center justify-center ${colors.text}`}>
            {nodeIcon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate" style={{ fontWeight: 500 }}>
              {node.label}
            </div>
            {isAgent && node.agentData && (
              <div className="text-xs text-neutral-500 truncate">{node.agentData.role}</div>
            )}
          </div>
          <button
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-neutral-500 hover:text-red-400 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(node.id);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-2.5">
          <p className="text-xs text-neutral-500 mb-2">{node.description}</p>

          {/* Agent tags */}
          {isAgent && node.agentData && (
            <div className="flex flex-wrap gap-1 mb-2">
              {node.agentData.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-xs rounded bg-white/5 text-neutral-500 border border-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Edit agent workflow button */}
          {isAgent && node.agentData && onEditAgentWorkflow && (
            <button
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-neutral-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all mb-2"
              onClick={(e) => {
                e.stopPropagation();
                onEditAgentWorkflow(node.agentData!);
              }}
            >
              <Settings className="h-3 w-3" />
              编辑员工工作流
              <ArrowRight className="h-3 w-3" />
            </button>
          )}

          {/* Input ports */}
          {inputPorts.length > 0 && (
            <div className="space-y-1.5 mb-2">
              {inputPorts.map((port) => (
                <div key={port.id} className="flex items-center gap-2 -ml-6">
                  <div
                    data-port-id={port.id}
                    className="w-3 h-3 rounded-full border-2 border-neutral-600 bg-neutral-800 hover:border-white hover:bg-white/20 transition-colors cursor-crosshair"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      onPortMouseDown(node.id, port.id, "input", e);
                    }}
                    onMouseUp={() => onPortMouseUp(node.id, port.id, "input")}
                  />
                  <span className="text-xs text-neutral-400">{port.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Output ports */}
          {outputPorts.length > 0 && (
            <div className="space-y-1.5">
              {outputPorts.map((port) => (
                <div key={port.id} className="flex items-center gap-2 justify-end -mr-6">
                  <span className="text-xs text-neutral-400">{port.label}</span>
                  <div
                    data-port-id={port.id}
                    className="w-3 h-3 rounded-full border-2 border-neutral-600 bg-neutral-800 hover:border-white hover:bg-white/20 transition-colors cursor-crosshair"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      onPortMouseDown(node.id, port.id, "output", e);
                    }}
                    onMouseUp={() => onPortMouseUp(node.id, port.id, "output")}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Main Team Workflow Editor =====
interface TeamWorkflowEditorProps {
  team: Team;
  onClose: () => void;
}

export function TeamWorkflowEditor({ team, onClose }: TeamWorkflowEditorProps) {
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // When editing a nested agent workflow, unmount DndProvider to avoid duplicate HTML5Backend
  if (editingAgent) {
    return (
      <>
        <div className="fixed inset-0 z-50 bg-black" />
        <WorkflowEditor
          agentName={editingAgent.name}
          initialWorkflow={editingAgent.workflow}
          onClose={() => setEditingAgent(null)}
        />
      </>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <TeamWorkflowEditorCanvas team={team} onClose={onClose} onEditAgent={setEditingAgent} />
    </DndProvider>
  );
}

function TeamWorkflowEditorCanvas({
  team,
  onClose,
  onEditAgent,
}: TeamWorkflowEditorProps & { onEditAgent: (agent: Agent) => void }) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const portPositions = useRef<Record<string, { x: number; y: number }>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const nextId = useRef(100);

  // Build agent templates
  const agentTemplates: AgentTemplate[] = allAgents.map((agent, i) => ({
    type: `agent-${agent.id}`,
    label: agent.name,
    description: agent.role,
    icon: "Bot",
    color: agentColorPalette[i % agentColorPalette.length],
    category: team.agentIds.includes(agent.id) ? "团队成员" : "其他员工",
    agentId: agent.id,
    agentData: agent,
    ports: [
      { id: "in", label: "任务输入", type: "input" as const },
      { id: "out", label: "结果输出", type: "output" as const },
    ],
  }));

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "团队成员": true,
    "其他员工": false,
    "触发器": true,
    "知识库 / 记忆": false,
    "逻辑控制": false,
    "输出": true,
  });

  // Initialize nodes from team workflow
  const [nodes, setNodes] = useState<TeamWorkflowNode[]>(() => {
    const initial: TeamWorkflowNode[] = [];

    initial.push({
      id: "trigger",
      nodeType: "trigger",
      label: "手动触发",
      description: "启动团队协作流程",
      position: { x: 80, y: 200 },
      icon: "Send",
      color: "emerald",
      ports: [{ id: "out", label: "输出", type: "output" }],
    });

    team.teamWorkflow.forEach((step, i) => {
      const agent = allAgents.find((a) => a.name === step.agentName);
      const colorIdx = agent ? allAgents.indexOf(agent) % agentColorPalette.length : 0;
      initial.push({
        id: `step-${step.step}`,
        nodeType: "agent",
        label: step.title,
        description: step.description,
        position: { x: 400 + i * 320, y: 160 + (i % 2) * 100 },
        icon: "Bot",
        color: agentColorPalette[colorIdx],
        ports: [
          { id: "in", label: "任务输入", type: "input" },
          { id: "out", label: "结果输出", type: "output" },
        ],
        agentId: agent?.id,
        agentData: agent,
      });
    });

    initial.push({
      id: "output",
      nodeType: "output",
      label: "报告输出",
      description: "汇总团队协作结果",
      position: { x: 400 + team.teamWorkflow.length * 320, y: 200 },
      icon: "FileText",
      color: "rose",
      ports: [{ id: "in", label: "输入", type: "input" }],
    });

    return initial;
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const conns: Connection[] = [];
    const nodeIds = ["trigger", ...team.teamWorkflow.map((s) => `step-${s.step}`), "output"];
    for (let i = 0; i < nodeIds.length - 1; i++) {
      conns.push({
        id: `conn-${i}`,
        fromNodeId: nodeIds[i],
        fromPortId: "out",
        toNodeId: nodeIds[i + 1],
        toPortId: "in",
      });
    }
    return conns;
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffset = useRef<Position>({ x: 0, y: 0 });

  const [drawingConnection, setDrawingConnection] = useState<{
    fromNodeId: string;
    fromPortId: string;
    mousePos: Position;
  } | null>(null);

  const [canvasOffset, setCanvasOffset] = useState<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<Position>({ x: 0, y: 0 });
  const panOffsetStart = useRef<Position>({ x: 0, y: 0 });

  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { template: SidebarTemplate; isAgent: boolean }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !canvasRef.current) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = clientOffset.x - canvasRect.left + canvasRef.current.scrollLeft - canvasOffset.x;
      const y = clientOffset.y - canvasRect.top + canvasRef.current.scrollTop - canvasOffset.y;

      const t = item.template;
      const newNode: TeamWorkflowNode = {
        id: `node-${nextId.current++}`,
        nodeType: item.isAgent ? "agent" : (t.category === "触发器" ? "trigger" : t.category === "输出" ? "output" : "tool"),
        label: t.label,
        description: t.description,
        position: { x: Math.max(0, x - 128), y: Math.max(0, y - 30) },
        icon: t.icon,
        color: t.color,
        ports: t.ports.map((p) => ({ ...p })),
        agentId: item.isAgent ? (t as AgentTemplate).agentId : undefined,
        agentData: item.isAgent ? (t as AgentTemplate).agentData : undefined,
      };
      setNodes((prev) => [...prev, newNode]);
    },
  }));

  const handleNodeDragStart = useCallback((nodeId: string, e: React.MouseEvent) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    dragOffset.current = { x: e.clientX - node.position.x, y: e.clientY - node.position.y };
    setDraggingNodeId(nodeId);
  }, [nodes]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (draggingNodeId) {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === draggingNodeId
              ? { ...n, position: { x: e.clientX - dragOffset.current.x, y: e.clientY - dragOffset.current.y } }
              : n
          )
        );
      }
      if (drawingConnection && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDrawingConnection((prev) =>
          prev ? { ...prev, mousePos: { x: e.clientX - rect.left + canvasRef.current!.scrollLeft, y: e.clientY - rect.top + canvasRef.current!.scrollTop } } : null
        );
      }
      if (isPanning) {
        setCanvasOffset({
          x: panOffsetStart.current.x + (e.clientX - panStart.current.x),
          y: panOffsetStart.current.y + (e.clientY - panStart.current.y),
        });
      }
    },
    [draggingNodeId, drawingConnection, isPanning]
  );

  const handleMouseUp = useCallback(() => {
    setDraggingNodeId(null);
    setDrawingConnection(null);
    setIsPanning(false);
  }, []);

  const handlePortMouseDown = useCallback(
    (nodeId: string, portId: string, type: "input" | "output", e: React.MouseEvent) => {
      if (type === "output" && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDrawingConnection({
          fromNodeId: nodeId,
          fromPortId: portId,
          mousePos: { x: e.clientX - rect.left + canvasRef.current.scrollLeft, y: e.clientY - rect.top + canvasRef.current.scrollTop },
        });
      }
    },
    []
  );

  const handlePortMouseUp = useCallback(
    (nodeId: string, portId: string, type: "input" | "output") => {
      if (drawingConnection && type === "input" && nodeId !== drawingConnection.fromNodeId) {
        const exists = connections.some(
          (c) => c.fromNodeId === drawingConnection.fromNodeId && c.fromPortId === drawingConnection.fromPortId && c.toNodeId === nodeId && c.toPortId === portId
        );
        if (!exists) {
          setConnections((prev) => [
            ...prev,
            { id: `conn-${nextId.current++}`, fromNodeId: drawingConnection.fromNodeId, fromPortId: drawingConnection.fromPortId, toNodeId: nodeId, toPortId: portId },
          ]);
        }
        setDrawingConnection(null);
      }
    },
    [drawingConnection, connections]
  );

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) => prev.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId));
    setSelectedNodeId(null);
  }, []);

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget || (e.target as HTMLElement).closest("[data-canvas-inner]")) {
        setSelectedNodeId(null);
        setIsPanning(true);
        panStart.current = { x: e.clientX, y: e.clientY };
        panOffsetStart.current = { ...canvasOffset };
      }
    },
    [canvasOffset]
  );

  const toggleCategory = (name: string) => {
    setExpandedCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const getConnectionPath = (conn: Connection): string | null => {
    const fromKey = `${conn.fromNodeId}-${conn.fromPortId}`;
    const toKey = `${conn.toNodeId}-${conn.toPortId}`;
    const from = portPositions.current[fromKey];
    const to = portPositions.current[toKey];
    if (!from || !to) return null;
    const dx = Math.abs(to.x - from.x) * 0.5;
    return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
  };

  const filteredTeamAgents = agentTemplates
    .filter((a) => a.category === "团队成员")
    .filter((a) => !searchQuery || a.label.includes(searchQuery) || a.description.includes(searchQuery));

  const filteredOtherAgents = agentTemplates
    .filter((a) => a.category === "其他员工")
    .filter((a) => !searchQuery || a.label.includes(searchQuery) || a.description.includes(searchQuery));

  const filteredToolCategories = toolCategories
    .map((cat) => ({ ...cat, templates: cat.templates.filter((t) => !searchQuery || t.label.includes(searchQuery) || t.description.includes(searchQuery)) }))
    .filter((cat) => cat.templates.length > 0);

  const agentNodeCount = nodes.filter((n) => n.nodeType === "agent").length;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top toolbar */}
      <div className="h-14 border-b border-white/10 bg-neutral-950 flex items-center px-4 gap-4 shrink-0">
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors">
          <X className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-2xl">{team.icon}</span>
          <Workflow className="h-5 w-5 text-white/60" />
        </div>
        <div>
          <span className="text-white text-sm" style={{ fontWeight: 600 }}>{team.name}</span>
          <span className="text-neutral-500 text-sm ml-2">团队协作流编辑器</span>
        </div>
        <div className="flex-1" />
        <Badge variant="outline" className="text-neutral-400 border-white/10 bg-white/5">
          {agentNodeCount} 个员工
        </Badge>
        <Badge variant="outline" className="text-neutral-400 border-white/10 bg-white/5">
          {nodes.length} 个节点
        </Badge>
        <Badge variant="outline" className="text-neutral-400 border-white/10 bg-white/5">
          {connections.length} 条连线
        </Badge>
        <div className="h-6 w-px bg-white/10" />
        <Button variant="outline" className="border-white/10 text-neutral-300 bg-transparent hover:bg-white/5 h-9">
          <Play className="h-4 w-4 mr-1.5" />
          试运行
        </Button>
        <Button className="bg-white text-black hover:bg-neutral-200 h-9" onClick={onClose}>
          保存
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <div className="w-72 border-r border-white/10 bg-neutral-950 flex flex-col shrink-0">
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <Input
                placeholder="搜索员工或模块..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:border-white/30 focus-visible:ring-white/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {/* Team member agents */}
            {filteredTeamAgents.length > 0 && (
              <div>
                <button
                  onClick={() => toggleCategory("团队成员")}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {expandedCategories["团队成员"] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  <Users className="h-4 w-4" />
                  <span style={{ fontWeight: 500 }}>团队成员</span>
                  <Badge className="ml-auto bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs px-1.5">
                    {filteredTeamAgents.length}
                  </Badge>
                </button>
                {expandedCategories["团队成员"] && (
                  <div className="ml-1 space-y-0.5 mt-0.5">
                    {filteredTeamAgents.map((t) => (
                      <SidebarItem key={t.type} template={t} isAgent />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Other agents */}
            {filteredOtherAgents.length > 0 && (
              <div>
                <button
                  onClick={() => toggleCategory("其他员工")}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {expandedCategories["其他员工"] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  <Bot className="h-4 w-4" />
                  <span style={{ fontWeight: 500 }}>其他员工</span>
                  <span className="ml-auto text-xs text-neutral-600">{filteredOtherAgents.length}</span>
                </button>
                {expandedCategories["其他员工"] && (
                  <div className="ml-1 space-y-0.5 mt-0.5">
                    {filteredOtherAgents.map((t) => (
                      <SidebarItem key={t.type} template={t} isAgent />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-white/5 my-2" />

            {/* Tool categories */}
            {filteredToolCategories.map((cat) => (
              <div key={cat.name}>
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {expandedCategories[cat.name] ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  {cat.icon}
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                  <span className="ml-auto text-xs text-neutral-600">{cat.templates.length}</span>
                </button>
                {expandedCategories[cat.name] && (
                  <div className="ml-1 space-y-0.5 mt-0.5">
                    {cat.templates.map((t) => (
                      <SidebarItem key={t.type} template={t} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-white/5">
            <p className="text-xs text-neutral-600 text-center">拖拽 AI 员工或模块到画布上编排协作流程</p>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={(el) => {
            (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            drop(el);
          }}
          data-canvas
          className={`flex-1 overflow-auto bg-neutral-950 relative ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: 4000, minHeight: 2000 }}>
            <defs>
              <pattern id="team-grid-small" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
              <pattern id="team-grid-large" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#team-grid-small)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#team-grid-large)" />
          </svg>

          {/* Connections SVG layer */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ minWidth: 4000, minHeight: 2000, transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)` }}
          >
            {connections.map((conn) => {
              const path = getConnectionPath(conn);
              if (!path) return null;
              return (
                <g key={conn.id}>
                  <path d={path} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" className="transition-all" />
                  <path
                    d={path}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="6"
                    className="cursor-pointer pointer-events-auto hover:stroke-red-500/30"
                    onClick={() => setConnections((prev) => prev.filter((c) => c.id !== conn.id))}
                  />
                </g>
              );
            })}
            {drawingConnection &&
              (() => {
                const fromKey = `${drawingConnection.fromNodeId}-${drawingConnection.fromPortId}`;
                const from = portPositions.current[fromKey];
                if (!from) return null;
                const to = drawingConnection.mousePos;
                const dx = Math.abs(to.x - from.x) * 0.5;
                const path = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
                return <path d={path} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="6 4" />;
              })()}
          </svg>

          {/* Nodes */}
          <div
            data-canvas-inner
            className="absolute inset-0"
            style={{ minWidth: 4000, minHeight: 2000, transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)` }}
          >
            {nodes.map((node) => (
              <TeamCanvasNode
                key={node.id}
                node={node}
                isSelected={selectedNodeId === node.id}
                onSelect={setSelectedNodeId}
                onDragStart={handleNodeDragStart}
                onDelete={handleDeleteNode}
                onPortMouseDown={handlePortMouseDown}
                onPortMouseUp={handlePortMouseUp}
                portPositions={portPositions}
                onEditAgentWorkflow={(agent) => onEditAgent(agent)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}