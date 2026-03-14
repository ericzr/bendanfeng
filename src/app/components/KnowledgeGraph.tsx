import { useState, useRef, useEffect, useCallback } from "react";
import { X, ZoomIn, ZoomOut, Maximize2, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { buildKnowledgeGraph, dataPackages, type GraphNode } from "../data/knowledge-data";

interface KnowledgeGraphProps {
  focusId?: string;
  onClose: () => void;
  onNavigate?: (packageId: string) => void;
}

interface LayoutNode extends GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
}

const categoryColors: Record<string, { fill: string; stroke: string; text: string }> = {
  root: { fill: "#ffffff", stroke: "#ffffff", text: "#000000" },
  // 数据库
  "db-macro": { fill: "#3b82f6", stroke: "#60a5fa", text: "#ffffff" },
  "db-industry": { fill: "#10b981", stroke: "#34d399", text: "#000000" },
  "db-consumer": { fill: "#8b5cf6", stroke: "#a78bfa", text: "#ffffff" },
  "db-enterprise": { fill: "#0ea5e9", stroke: "#38bdf8", text: "#000000" },
  "db-micro": { fill: "#d946ef", stroke: "#e879f9", text: "#ffffff" },
  "db-politics": { fill: "#f43f5e", stroke: "#fb7185", text: "#ffffff" },
  "db-professional": { fill: "#f59e0b", stroke: "#fbbf24", text: "#000000" },
  "db-research": { fill: "#84cc16", stroke: "#a3e635", text: "#000000" },
  // 知识库
  "kb-methodology": { fill: "#eab308", stroke: "#facc15", text: "#000000" },
  "kb-business": { fill: "#f97316", stroke: "#fb923c", text: "#000000" },
  "kb-humanities": { fill: "#ef4444", stroke: "#f87171", text: "#ffffff" },
  "kb-science": { fill: "#14b8a6", stroke: "#2dd4bf", text: "#000000" },
  "kb-tech": { fill: "#06b6d4", stroke: "#22d3ee", text: "#000000" },
  "kb-finance": { fill: "#22c55e", stroke: "#4ade80", text: "#000000" },
  "kb-legal": { fill: "#dc2626", stroke: "#ef4444", text: "#ffffff" },
  "kb-health": { fill: "#ec4899", stroke: "#f472b6", text: "#ffffff" },
  "kb-education": { fill: "#a855f7", stroke: "#c084fc", text: "#ffffff" },
  "kb-marketing": { fill: "#6366f1", stroke: "#818cf8", text: "#ffffff" },
  sub: { fill: "#27272a", stroke: "#71717a", text: "#ffffff" },
  indicator: { fill: "#18181b", stroke: "#52525b", text: "#d4d4d8" },
};

export function KnowledgeGraph({ focusId, onClose, onNavigate }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<LayoutNode[]>([]);
  const edgesRef = useRef<{ from: string; to: string; type: "parent" | "related" }[]>([]);
  const animFrameRef = useRef<number>(0);
  const [zoom, setZoom] = useState(0.55);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<LayoutNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(focusId || null);
  const [searchQuery, setSearchQuery] = useState("");
  const draggingRef = useRef<{ node: LayoutNode | null; startX: number; startY: number; isPan: boolean }>({ node: null, startX: 0, startY: 0, isPan: false });
  const zoomRef = useRef(zoom);
  const offsetRef = useRef(offset);

  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { offsetRef.current = offset; }, [offset]);

  // Initialize graph layout
  useEffect(() => {
    const { nodes, edges } = buildKnowledgeGraph(focusId);
    edgesRef.current = edges;

    // Initialize positions using a radial layout
    const centerX = 0;
    const centerY = 0;
    const layoutNodes: LayoutNode[] = [];

    // All category nodes (no root) arranged in a large ring
    const catNodes = nodes.filter(n => n.category !== "sub" && n.category !== "indicator");
    catNodes.forEach((n, i) => {
      const angle = (i / catNodes.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 400;
      layoutNodes.push({ ...n, x: centerX + Math.cos(angle) * radius, y: centerY + Math.sin(angle) * radius, vx: 0, vy: 0 });
    });

    // Position sub nodes around their parent
    const subNodes = nodes.filter(n => n.category === "sub");
    const groupedByParent: Record<string, typeof subNodes> = {};
    subNodes.forEach(n => {
      if (n.parentId) {
        if (!groupedByParent[n.parentId]) groupedByParent[n.parentId] = [];
        groupedByParent[n.parentId].push(n);
      }
    });

    for (const [parentId, children] of Object.entries(groupedByParent)) {
      const parent = layoutNodes.find(n => n.id === parentId);
      if (!parent) continue;
      const parentAngle = Math.atan2(parent.y - centerY, parent.x - centerX);
      children.forEach((n, i) => {
        const spreadAngle = (Math.PI * 0.6);
        const startAngle = parentAngle - spreadAngle / 2;
        const angle = startAngle + (i / Math.max(children.length - 1, 1)) * spreadAngle;
        const radius = 160 + Math.random() * 40;
        layoutNodes.push({ ...n, x: parent.x + Math.cos(angle) * radius, y: parent.y + Math.sin(angle) * radius, vx: 0, vy: 0 });
      });
    }

    // Position indicator nodes
    const indicatorNodes = nodes.filter(n => n.category === "indicator");
    indicatorNodes.forEach((n, i) => {
      const parent = layoutNodes.find(p => p.id === n.parentId);
      if (!parent) return;
      const angle = (i / Math.max(indicatorNodes.length, 1)) * Math.PI * 2;
      const radius = 80 + Math.random() * 30;
      layoutNodes.push({ ...n, x: parent.x + Math.cos(angle) * radius, y: parent.y + Math.sin(angle) * radius, vx: 0, vy: 0 });
    });

    nodesRef.current = layoutNodes;

    // Run force simulation
    let iteration = 0;
    const maxIterations = 150;

    function simulate() {
      if (iteration >= maxIterations) return;
      const nodes = nodesRef.current;
      const alpha = 1 - iteration / maxIterations;

      // Repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = (nodes[i].size + nodes[j].size) * 3;
          if (dist < minDist) {
            const force = (minDist - dist) / dist * 0.5 * alpha;
            const fx = dx * force;
            const fy = dy * force;
            if (!nodes[i].fx) { nodes[i].vx -= fx; nodes[i].vy -= fy; }
            if (!nodes[j].fx) { nodes[j].vx += fx; nodes[j].vy += fy; }
          }
        }
      }

      // Attraction along edges
      for (const edge of edgesRef.current) {
        const source = nodes.find(n => n.id === edge.from);
        const target = nodes.find(n => n.id === edge.to);
        if (!source || !target) continue;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const idealDist = edge.type === "parent" ? 180 : 250;
        const force = (dist - idealDist) / dist * 0.02 * alpha;
        const fx = dx * force;
        const fy = dy * force;
        if (!source.fx) { source.vx += fx; source.vy += fy; }
        if (!target.fx) { target.vx -= fx; target.vy -= fy; }
      }

      // Apply velocities with damping
      for (const node of nodes) {
        if (node.fx !== undefined) { node.x = node.fx; node.vx = 0; }
        else {
          node.vx *= 0.8;
          node.vy *= 0.8;
          node.x += node.vx;
          node.y += node.vy;
        }
        if (node.fy !== undefined) { node.y = node.fy; node.vy = 0; }
      }

      iteration++;
      if (iteration < maxIterations) {
        requestAnimationFrame(simulate);
      }
    }
    simulate();
  }, [focusId]);

  // Render loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const z = zoomRef.current;
    const off = offsetRef.current;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, w, h);

    // Draw grid dots
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    const gridSize = 40 * z;
    const gridOffX = (off.x * z + w / 2) % gridSize;
    const gridOffY = (off.y * z + h / 2) % gridSize;
    for (let x = gridOffX; x < w; x += gridSize) {
      for (let y = gridOffY; y < h; y += gridSize) {
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }

    ctx.save();
    ctx.translate(w / 2 + off.x * z, h / 2 + off.y * z);
    ctx.scale(z, z);

    const nodes = nodesRef.current;
    const edges = edgesRef.current;

    // Draw edges
    for (const edge of edges) {
      const source = nodes.find(n => n.id === edge.from);
      const target = nodes.find(n => n.id === edge.to);
      if (!source || !target) continue;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);

      if (edge.type === "related") {
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 0.8;
      } else {
        const isHighlighted = selectedNode && (source.id === selectedNode || target.id === selectedNode);
        ctx.strokeStyle = isHighlighted ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)";
        ctx.setLineDash([]);
        ctx.lineWidth = isHighlighted ? 1.5 : 1;
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw nodes
    for (const node of nodes) {
      const colors = categoryColors[node.category] || categoryColors.sub;
      const isHovered = hoveredNode?.id === node.id;
      const isSelected = selectedNode === node.id;
      const isSearchMatch = searchQuery && node.label.includes(searchQuery);
      const r = node.size * (isHovered ? 1.2 : 1);

      // Glow effect for focused/hovered
      if (isSelected || isHovered || isSearchMatch) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, r + 8, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(node.x, node.y, r, node.x, node.y, r + 8);
        glow.addColorStop(0, isSearchMatch ? "rgba(250,204,21,0.3)" : `${colors.stroke}40`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? colors.stroke : colors.fill;
      ctx.fill();
      ctx.strokeStyle = isSearchMatch ? "#facc15" : colors.stroke;
      ctx.lineWidth = isSelected ? 2.5 : isHovered ? 2 : 1;
      ctx.stroke();

      // Label
      const isCatNode = node.category !== "sub" && node.category !== "indicator";
      const fontSize = isCatNode ? 11 : node.category === "indicator" ? 9 : 10;
      ctx.font = `500 ${fontSize}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = isSelected ? "#ffffff" : colors.text;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (isCatNode) {
        ctx.fillText(node.label, node.x, node.y);
      } else {
        // Draw label below node
        ctx.fillStyle = isHovered || isSelected ? "#ffffff" : "rgba(255,255,255,0.6)";
        ctx.fillText(node.label, node.x, node.y + r + 14);
      }
    }

    ctx.restore();

    // Draw legend
    ctx.font = "11px Inter, system-ui, sans-serif";
    const legendItems = [
      { label: "宏观数据库", color: "#3b82f6" },
      { label: "行业数据库", color: "#10b981" },
      { label: "消费数据库", color: "#8b5cf6" },
      { label: "企业数据库", color: "#0ea5e9" },
      { label: "微观数据库", color: "#d946ef" },
      { label: "政治数据", color: "#f43f5e" },
      { label: "专业应用", color: "#f59e0b" },
      { label: "科研数据库", color: "#84cc16" },
      { label: "方法论", color: "#eab308" },
      { label: "商业管理", color: "#f97316" },
      { label: "人文社科", color: "#ef4444" },
      { label: "自然科学", color: "#14b8a6" },
      { label: "工程技术", color: "#06b6d4" },
      { label: "金融经济", color: "#22c55e" },
      { label: "法律政策", color: "#dc2626" },
      { label: "医疗健康", color: "#ec4899" },
      { label: "教育文化", color: "#a855f7" },
      { label: "营销传播", color: "#6366f1" },
    ];
    const lx = 16;
    let ly = h - 16 - legendItems.length * 18;
    for (const item of legendItems) {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(lx + 5, ly + 5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(item.label, lx + 14, ly + 5);
      ly += 18;
    }

    animFrameRef.current = requestAnimationFrame(render);
  }, [hoveredNode, selectedNode, searchQuery]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [render]);

  // Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.style.width = rect.width + "px";
        canvas.style.height = rect.height + "px";
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse interactions
  const getNodeAtPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = (clientX - rect.left - rect.width / 2) / zoomRef.current - offsetRef.current.x;
    const my = (clientY - rect.top - rect.height / 2) / zoomRef.current - offsetRef.current.y;

    for (let i = nodesRef.current.length - 1; i >= 0; i--) {
      const node = nodesRef.current[i];
      const dx = mx - node.x;
      const dy = my - node.y;
      if (dx * dx + dy * dy < (node.size + 5) * (node.size + 5)) {
        return node;
      }
    }
    return null;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const node = getNodeAtPos(e.clientX, e.clientY);
    if (node) {
      draggingRef.current = { node, startX: e.clientX, startY: e.clientY, isPan: false };
    } else {
      draggingRef.current = { node: null, startX: e.clientX, startY: e.clientY, isPan: true };
    }
  }, [getNodeAtPos]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const drag = draggingRef.current;
    if (drag.isPan) {
      const dx = (e.clientX - drag.startX) / zoomRef.current;
      const dy = (e.clientY - drag.startY) / zoomRef.current;
      setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      return;
    }
    if (drag.node) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      drag.node.x = (e.clientX - rect.left - rect.width / 2) / zoomRef.current - offsetRef.current.x;
      drag.node.y = (e.clientY - rect.top - rect.height / 2) / zoomRef.current - offsetRef.current.y;
      drag.node.fx = drag.node.x;
      drag.node.fy = drag.node.y;
      return;
    }

    const node = getNodeAtPos(e.clientX, e.clientY);
    setHoveredNode(node);
    const canvas = canvasRef.current;
    if (canvas) canvas.style.cursor = node ? "pointer" : "grab";
  }, [getNodeAtPos]);

  const handleMouseUp = useCallback(() => {
    if (draggingRef.current.node) {
      draggingRef.current.node.fx = undefined;
      draggingRef.current.node.fy = undefined;
    }
    draggingRef.current = { node: null, startX: 0, startY: 0, isPan: false };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const node = getNodeAtPos(e.clientX, e.clientY);
    if (node) {
      setSelectedNode(node.id);
      // If it's a data package node, allow navigation
      if (node.category === "sub" && onNavigate) {
        // Don't navigate immediately, show info first
      }
    } else {
      setSelectedNode(null);
    }
  }, [getNodeAtPos, onNavigate]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.2, Math.min(3, prev * delta)));
  }, []);

  const resetView = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  // Get info for selected node
  const selectedPkg = selectedNode ? dataPackages.find(d => d.id === selectedNode) : null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-sm" style={{ fontWeight: 600 }}>知识结构图谱</h2>
          {focusId && (
            <Badge variant="outline" className="text-xs text-blue-400 bg-blue-500/10 border-blue-500/20">
              聚焦: {dataPackages.find(d => d.id === focusId)?.name || ""}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
            <Input
              placeholder="搜索节点..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs bg-white/5 border-white/10 text-white placeholder:text-neutral-600 rounded-lg"
            />
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400" onClick={() => setZoom(z => Math.min(3, z * 1.2))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400" onClick={() => setZoom(z => Math.max(0.2, z * 0.8))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400" onClick={resetView}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <div className="w-px h-5 bg-white/10 mx-1" />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-neutral-400 hover:text-white" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas area */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleClick}
          onWheel={handleWheel}
          style={{ cursor: "grab" }}
        />

        {/* Selected node info panel */}
        {selectedPkg && (
          <div className="absolute right-4 top-4 w-72 bg-neutral-900/95 border border-white/10 rounded-xl p-4 backdrop-blur-xl">
            <h3 className="text-white text-sm mb-2" style={{ fontWeight: 600 }}>{selectedPkg.name}</h3>
            <p className="text-neutral-400 text-xs mb-3">{selectedPkg.description}</p>
            <div className="space-y-1.5 mb-3">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">指标数</span>
                <span className="text-white">{selectedPkg.indicatorCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">子分类</span>
                <span className="text-white">{selectedPkg.subCategoryCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">数据来源</span>
                <span className="text-white">{selectedPkg.children[0]?.sources?.length || 0}+ 机构</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-500">关联数据包</span>
                <span className="text-white">{selectedPkg.relatedIds.length} 个</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {selectedPkg.tags.map(tag => (
                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-500">{tag}</span>
              ))}
            </div>
            <div className="text-xs text-neutral-600 mb-3">
              子数据: {selectedPkg.children.map(c => c.name).join("、")}
            </div>
            {onNavigate && (
              <Button
                size="sm"
                className="w-full bg-white text-black hover:bg-neutral-200 text-xs"
                onClick={() => onNavigate(selectedPkg.id)}
              >
                查看数据包详情
              </Button>
            )}
          </div>
        )}

        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 text-neutral-600 text-xs bg-neutral-900/80 px-2 py-1 rounded-md">
          {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
}