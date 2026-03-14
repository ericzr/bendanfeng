import React, { useState, useCallback, useRef, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  X,
  GripVertical,
  Search,
  MessageSquare,
  FileText,
  Database,
  Globe,
  Zap,
  GitBranch,
  Timer,
  Filter,
  Bot,
  Send,
  Code,
  Brain,
  Eye,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Play,
  Settings,
  Workflow,
  BookOpen,
  HardDrive,
  MessageCircleQuestion,
  Rss,
  History,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

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

interface WorkflowNode {
  id: string;
  type: string;
  label: string;
  description: string;
  position: Position;
  category: string;
  icon: string;
  color: string;
  ports: NodePort[];
  config?: Record<string, string>;
}

interface Connection {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
}

interface ModuleTemplate {
  type: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  ports: NodePort[];
}

// ===== Module definitions =====
const moduleCategories: { name: string; icon: React.ReactNode; modules: ModuleTemplate[] }[] = [
  {
    name: "输入",
    icon: <Send className="h-4 w-4" />,
    modules: [
      {
        type: "text-input",
        label: "文本输入",
        description: "接收用户文本输入",
        icon: "MessageSquare",
        color: "emerald",
        category: "输入",
        ports: [{ id: "out", label: "输出", type: "output" }],
      },
      {
        type: "file-input",
        label: "文件上传",
        description: "接收文件或文档",
        icon: "FileText",
        color: "emerald",
        category: "输入",
        ports: [{ id: "out", label: "输出", type: "output" }],
      },
      {
        type: "api-input",
        label: "API 输入",
        description: "从外部 API 获取数据",
        icon: "Globe",
        color: "emerald",
        category: "输入",
        ports: [{ id: "out", label: "输出", type: "output" }],
      },
      {
        type: "database-input",
        label: "数据库查询",
        description: "从数据库读取数据",
        icon: "Database",
        color: "emerald",
        category: "输入",
        ports: [{ id: "out", label: "输出", type: "output" }],
      },
    ],
  },
  {
    name: "AI 处理",
    icon: <Brain className="h-4 w-4" />,
    modules: [
      {
        type: "llm",
        label: "LLM 大模型",
        description: "调用大语言模型处理",
        icon: "Brain",
        color: "violet",
        category: "AI 处理",
        ports: [
          { id: "in", label: "输入", type: "input" },
          { id: "out", label: "输出", type: "output" },
        ],
      },
      {
        type: "knowledge-base",
        label: "知识库检索",
        description: "RAG 知识库检索增强",
        icon: "Database",
        color: "violet",
        category: "AI 处理",
        ports: [
          { id: "in", label: "查询", type: "input" },
          { id: "out", label: "结果", type: "output" },
        ],
      },
      {
        type: "agent-node",
        label: "Agent 智能体",
        description: "自主决策的 AI Agent",
        icon: "Bot",
        color: "violet",
        category: "AI 处理",
        ports: [
          { id: "in", label: "输入", type: "input" },
          { id: "out", label: "输出", type: "output" },
        ],
      },
    ],
  },
  {
    name: "知识库 / 记忆",
    icon: <BookOpen className="h-4 w-4" />,
    modules: [
      {
        type: "kb-document",
        label: "文档知识库",
        description: "检索文档、报告、白皮书等",
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
        description: "FAQ、标准问答对匹配",
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
        description: "SQL/表格等结构化数据查询",
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
        description: "从网页/RSS实时抓取知识",
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
        label: "长期记忆",
        description: "Agent 跨会话上下文记忆",
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
    name: "工具",
    icon: <Zap className="h-4 w-4" />,
    modules: [
      {
        type: "web-search",
        label: "网页搜索",
        description: "搜索引擎查询",
        icon: "Search",
        color: "amber",
        category: "工具",
        ports: [
          { id: "in", label: "查询", type: "input" },
          { id: "out", label: "结果", type: "output" },
        ],
      },
      {
        type: "code-exec",
        label: "代码执行",
        description: "执行 Python/JS 代码",
        icon: "Code",
        color: "amber",
        category: "工具",
        ports: [
          { id: "in", label: "输入", type: "input" },
          { id: "out", label: "输出", type: "output" },
        ],
      },
      {
        type: "http-request",
        label: "HTTP 请求",
        description: "发送 HTTP 请求",
        icon: "Globe",
        color: "amber",
        category: "工具",
        ports: [
          { id: "in", label: "输入", type: "input" },
          { id: "out", label: "结果", type: "output" },
        ],
      },
    ],
  },
  {
    name: "逻辑控制",
    icon: <GitBranch className="h-4 w-4" />,
    modules: [
      {
        type: "condition",
        label: "条件分支",
        description: "基于条件进行分支判断",
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
        type: "loop",
        label: "循环",
        description: "循环执行子流程",
        icon: "Timer",
        color: "sky",
        category: "逻辑控制",
        ports: [
          { id: "in", label: "输入", type: "input" },
          { id: "body", label: "循环体", type: "output" },
          { id: "done", label: "完成", type: "output" },
        ],
      },
      {
        type: "filter",
        label: "数据过滤",
        description: "过滤和转换数据",
        icon: "Filter",
        color: "sky",
        category: "逻辑控制",
        ports: [
          { id: "in", label: "输入", type: "input" },
          { id: "out", label: "输出", type: "output" },
        ],
      },
    ],
  },
  {
    name: "输出",
    icon: <Eye className="h-4 w-4" />,
    modules: [
      {
        type: "text-output",
        label: "文本输出",
        description: "输出处理结果文本",
        icon: "MessageSquare",
        color: "rose",
        category: "输出",
        ports: [{ id: "in", label: "输入", type: "input" }],
      },
      {
        type: "file-output",
        label: "文件导出",
        description: "导出为文件或报告",
        icon: "FileText",
        color: "rose",
        category: "输出",
        ports: [{ id: "in", label: "输入", type: "input" }],
      },
      {
        type: "api-output",
        label: "API 回调",
        description: "将结果推送到外部 API",
        icon: "Globe",
        color: "rose",
        category: "输出",
        ports: [{ id: "in", label: "输入", type: "input" }],
      },
    ],
  },
];

const iconMap: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="h-4 w-4" />,
  FileText: <FileText className="h-4 w-4" />,
  Globe: <Globe className="h-4 w-4" />,
  Database: <Database className="h-4 w-4" />,
  Brain: <Brain className="h-4 w-4" />,
  Bot: <Bot className="h-4 w-4" />,
  Search: <Search className="h-4 w-4" />,
  Code: <Code className="h-4 w-4" />,
  GitBranch: <GitBranch className="h-4 w-4" />,
  Timer: <Timer className="h-4 w-4" />,
  Filter: <Filter className="h-4 w-4" />,
  Eye: <Eye className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Send: <Send className="h-4 w-4" />,
  BookOpen: <BookOpen className="h-4 w-4" />,
  HardDrive: <HardDrive className="h-4 w-4" />,
  MessageCircleQuestion: <MessageCircleQuestion className="h-4 w-4" />,
  Rss: <Rss className="h-4 w-4" />,
  History: <History className="h-4 w-4" />,
};

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-400" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", dot: "bg-violet-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", dot: "bg-amber-400" },
  sky: { bg: "bg-sky-500/10", border: "border-sky-500/30", text: "text-sky-400", dot: "bg-sky-400" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", dot: "bg-rose-400" },
  indigo: { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-400", dot: "bg-indigo-400" },
};

const ITEM_TYPE = "MODULE";

// ===== Draggable sidebar item =====
function SidebarModule({ template }: { template: ModuleTemplate }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { template },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const colors = colorMap[template.color] || colorMap.violet;

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing transition-all border border-transparent hover:border-white/10 hover:bg-white/5 ${isDragging ? "opacity-40" : ""}`}
    >
      <div className={`w-8 h-8 rounded-lg ${colors.bg} ${colors.border} border flex items-center justify-center ${colors.text} shrink-0`}>
        {iconMap[template.icon] || <Zap className="h-4 w-4" />}
      </div>
      <div className="min-w-0">
        <div className="text-sm text-neutral-200 truncate">{template.label}</div>
        <div className="text-xs text-neutral-500 truncate">{template.description}</div>
      </div>
      <GripVertical className="h-3.5 w-3.5 text-neutral-600 ml-auto shrink-0" />
    </div>
  );
}

// ===== Canvas Node =====
function CanvasNode({
  node,
  isSelected,
  onSelect,
  onDragStart,
  onDelete,
  onPortMouseDown,
  onPortMouseUp,
  portPositions,
}: {
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDragStart: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string) => void;
  onPortMouseDown: (nodeId: string, portId: string, type: "input" | "output", e: React.MouseEvent) => void;
  onPortMouseUp: (nodeId: string, portId: string, type: "input" | "output") => void;
  portPositions: React.MutableRefObject<Record<string, { x: number; y: number }>>;
}) {
  const colors = colorMap[node.color] || colorMap.violet;
  const inputPorts = node.ports.filter((p) => p.type === "input");
  const outputPorts = node.ports.filter((p) => p.type === "output");

  const nodeRef = useRef<HTMLDivElement>(null);

  // Register port positions on render
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
      className={`absolute group select-none`}
      style={{ left: node.position.x, top: node.position.y, zIndex: isSelected ? 10 : 1 }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect(node.id);
        onDragStart(node.id, e);
      }}
    >
      <div
        className={`w-56 rounded-xl border backdrop-blur-sm transition-all cursor-move ${
          isSelected
            ? `${colors.border} shadow-lg shadow-${node.color}-500/10 ring-1 ring-white/20`
            : "border-white/10 hover:border-white/20"
        } bg-neutral-900/95`}
      >
        {/* Header */}
        <div className={`px-4 py-3 border-b border-white/5 flex items-center gap-2.5`}>
          <div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text}`}>
            {iconMap[node.icon] || <Zap className="h-3.5 w-3.5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate" style={{ fontWeight: 500 }}>{node.label}</div>
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
                    className={`w-3 h-3 rounded-full border-2 border-neutral-600 bg-neutral-800 hover:border-white hover:bg-white/20 transition-colors cursor-crosshair`}
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

// ===== Main Editor =====
interface WorkflowEditorProps {
  agentName: string;
  initialWorkflow: { step: number; title: string; description: string }[];
  onClose: () => void;
}

export function WorkflowEditor(props: WorkflowEditorProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <WorkflowEditorInner {...props} />
    </DndProvider>
  );
}

function WorkflowEditorInner({ agentName, initialWorkflow, onClose }: WorkflowEditorProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const portPositions = useRef<Record<string, { x: number; y: number }>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    Object.fromEntries(moduleCategories.map((c) => [c.name, true]))
  );

  // Initialize nodes from workflow
  const [nodes, setNodes] = useState<WorkflowNode[]>(() => {
    const initial: WorkflowNode[] = [];
    // Start node
    initial.push({
      id: "start",
      type: "text-input",
      label: "用户输入",
      description: "接收用户任务指令",
      position: { x: 80, y: 150 },
      category: "输入",
      icon: "MessageSquare",
      color: "emerald",
      ports: [{ id: "out", label: "输出", type: "output" }],
    });

    // Workflow step nodes
    initialWorkflow.forEach((step, i) => {
      initial.push({
        id: `step-${step.step}`,
        type: "llm",
        label: step.title,
        description: step.description,
        position: { x: 380 + i * 280, y: 120 + (i % 2) * 80 },
        category: "AI 处理",
        icon: "Brain",
        color: "violet",
        ports: [
          { id: "in", label: "输入", type: "input" },
          { id: "out", label: "输出", type: "output" },
        ],
      });
    });

    // End node
    initial.push({
      id: "end",
      type: "text-output",
      label: "结果输出",
      description: "输出最终处理结果",
      position: { x: 380 + initialWorkflow.length * 280, y: 150 },
      category: "输出",
      icon: "MessageSquare",
      color: "rose",
      ports: [{ id: "in", label: "输入", type: "input" }],
    });

    return initial;
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const conns: Connection[] = [];
    const nodeIds = ["start", ...initialWorkflow.map((s) => `step-${s.step}`), "end"];
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

  // Connection drawing state
  const [drawingConnection, setDrawingConnection] = useState<{
    fromNodeId: string;
    fromPortId: string;
    mousePos: Position;
  } | null>(null);

  // Canvas panning
  const [canvasOffset, setCanvasOffset] = useState<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef<Position>({ x: 0, y: 0 });
  const panOffsetStart = useRef<Position>({ x: 0, y: 0 });

  let nextId = useRef(100);

  // Drop handler for new nodes from sidebar
  const [, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item: { template: ModuleTemplate }, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset || !canvasRef.current) return;
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = clientOffset.x - canvasRect.left + canvasRef.current.scrollLeft - canvasOffset.x;
      const y = clientOffset.y - canvasRect.top + canvasRef.current.scrollTop - canvasOffset.y;

      const newNode: WorkflowNode = {
        id: `node-${nextId.current++}`,
        type: item.template.type,
        label: item.template.label,
        description: item.template.description,
        position: { x: Math.max(0, x - 112), y: Math.max(0, y - 30) },
        category: item.template.category,
        icon: item.template.icon,
        color: item.template.color,
        ports: item.template.ports.map((p) => ({ ...p })),
      };
      setNodes((prev) => [...prev, newNode]);
    },
  }));

  // Node dragging
  const handleNodeDragStart = useCallback((nodeId: string, e: React.MouseEvent) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    dragOffset.current = {
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    };
    setDraggingNodeId(nodeId);
  }, [nodes]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (draggingNodeId) {
        setNodes((prev) =>
          prev.map((n) =>
            n.id === draggingNodeId
              ? {
                  ...n,
                  position: {
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y,
                  },
                }
              : n
          )
        );
      }
      if (drawingConnection && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDrawingConnection((prev) =>
          prev
            ? {
                ...prev,
                mousePos: {
                  x: e.clientX - rect.left + canvasRef.current!.scrollLeft,
                  y: e.clientY - rect.top + canvasRef.current!.scrollTop,
                },
              }
            : null
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

  // Port connection handling
  const handlePortMouseDown = useCallback(
    (nodeId: string, portId: string, type: "input" | "output", e: React.MouseEvent) => {
      if (type === "output" && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setDrawingConnection({
          fromNodeId: nodeId,
          fromPortId: portId,
          mousePos: {
            x: e.clientX - rect.left + canvasRef.current.scrollLeft,
            y: e.clientY - rect.top + canvasRef.current.scrollTop,
          },
        });
      }
    },
    []
  );

  const handlePortMouseUp = useCallback(
    (nodeId: string, portId: string, type: "input" | "output") => {
      if (drawingConnection && type === "input" && nodeId !== drawingConnection.fromNodeId) {
        // Check for duplicate
        const exists = connections.some(
          (c) =>
            c.fromNodeId === drawingConnection.fromNodeId &&
            c.fromPortId === drawingConnection.fromPortId &&
            c.toNodeId === nodeId &&
            c.toPortId === portId
        );
        if (!exists) {
          setConnections((prev) => [
            ...prev,
            {
              id: `conn-${nextId.current++}`,
              fromNodeId: drawingConnection.fromNodeId,
              fromPortId: drawingConnection.fromPortId,
              toNodeId: nodeId,
              toPortId: portId,
            },
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

  const filteredCategories = moduleCategories
    .map((cat) => ({
      ...cat,
      modules: cat.modules.filter(
        (m) =>
          !searchQuery ||
          m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.modules.length > 0);

  // Build connection paths
  const getConnectionPath = (conn: Connection): string | null => {
    const fromKey = `${conn.fromNodeId}-${conn.fromPortId}`;
    const toKey = `${conn.toNodeId}-${conn.toPortId}`;
    const from = portPositions.current[fromKey];
    const to = portPositions.current[toKey];
    if (!from || !to) return null;

    const dx = Math.abs(to.x - from.x) * 0.5;
    return `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top toolbar */}
      <div className="h-14 border-b border-white/10 bg-neutral-950 flex items-center px-4 gap-4 shrink-0">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-white/10" />
        <Workflow className="h-5 w-5 text-white/60" />
        <div>
          <span className="text-white text-sm" style={{ fontWeight: 600 }}>{agentName}</span>
          <span className="text-neutral-500 text-sm ml-2">工作流编辑器</span>
        </div>
        <div className="flex-1" />
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
        <div className="w-64 border-r border-white/10 bg-neutral-950 flex flex-col shrink-0">
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
              <Input
                placeholder="搜索模块..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:border-white/30 focus-visible:ring-white/20"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredCategories.map((cat) => (
              <div key={cat.name}>
                <button
                  onClick={() => toggleCategory(cat.name)}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                >
                  {expandedCategories[cat.name] ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                  {cat.icon}
                  <span style={{ fontWeight: 500 }}>{cat.name}</span>
                  <span className="ml-auto text-xs text-neutral-600">{cat.modules.length}</span>
                </button>
                {expandedCategories[cat.name] && (
                  <div className="ml-1 space-y-0.5 mt-0.5">
                    {cat.modules.map((m) => (
                      <SidebarModule key={m.type} template={m} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/5">
            <p className="text-xs text-neutral-600 text-center">拖拽模块到画布上添加节点</p>
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
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: 3000, minHeight: 2000 }}>
            <defs>
              <pattern id="grid-small" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid-large" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#grid-small)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-large)" />
          </svg>

          {/* Connections SVG layer */}
          <svg className="absolute inset-0 pointer-events-none" style={{ minWidth: 3000, minHeight: 2000, transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)` }}>
            {connections.map((conn) => {
              const path = getConnectionPath(conn);
              if (!path) return null;
              return (
                <g key={conn.id}>
                  <path
                    d={path}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2"
                    className="transition-all"
                  />
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
            {/* Drawing connection line */}
            {drawingConnection && (() => {
              const fromKey = `${drawingConnection.fromNodeId}-${drawingConnection.fromPortId}`;
              const from = portPositions.current[fromKey];
              if (!from) return null;
              const to = drawingConnection.mousePos;
              const dx = Math.abs(to.x - from.x) * 0.5;
              const path = `M ${from.x} ${from.y} C ${from.x + dx} ${from.y}, ${to.x - dx} ${to.y}, ${to.x} ${to.y}`;
              return (
                <path
                  d={path}
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
              );
            })()}
          </svg>

          {/* Nodes */}
          <div
            data-canvas-inner
            className="absolute inset-0"
            style={{ minWidth: 3000, minHeight: 2000, transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px)` }}
          >
            {nodes.map((node) => (
              <CanvasNode
                key={node.id}
                node={node}
                isSelected={selectedNodeId === node.id}
                onSelect={setSelectedNodeId}
                onDragStart={handleNodeDragStart}
                onDelete={handleDeleteNode}
                onPortMouseDown={handlePortMouseDown}
                onPortMouseUp={handlePortMouseUp}
                portPositions={portPositions}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}