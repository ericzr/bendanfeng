import { useState, useMemo } from "react";
import {
  BookOpen,
  FileText,
  MessageSquare,
  Globe,
  Database,
  Brain,
  Search,
  Plus,
  MoreVertical,
  ChevronRight,
  ArrowLeft,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  File,
  Filter,
  Eye,
  Pencil,
  Network,
} from "lucide-react";
import { agents, teams, KnowledgeBase } from "../../data/mock-data";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { KnowledgeGraph } from "../KnowledgeGraph";

const typeConfig: Record<
  KnowledgeBase["type"],
  { label: string; icon: React.ReactNode; color: string }
> = {
  document: {
    label: "文档知识库",
    icon: <FileText className="h-4 w-4" />,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  qa: {
    label: "问答对",
    icon: <MessageSquare className="h-4 w-4" />,
    color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  web: {
    label: "网页抓取",
    icon: <Globe className="h-4 w-4" />,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  database: {
    label: "结构化数据",
    icon: <Database className="h-4 w-4" />,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  api: {
    label: "API 数据源",
    icon: <RefreshCw className="h-4 w-4" />,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  memory: {
    label: "长期记忆",
    icon: <Brain className="h-4 w-4" />,
    color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  },
};

const statusConfig: Record<
  KnowledgeBase["status"],
  { label: string; icon: React.ReactNode; color: string }
> = {
  active: {
    label: "已就绪",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    color: "text-green-400",
  },
  indexing: {
    label: "索引中",
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "text-amber-400",
  },
  inactive: {
    label: "未启用",
    icon: <XCircle className="h-3.5 w-3.5" />,
    color: "text-neutral-500",
  },
};

interface KBWithOwner extends KnowledgeBase {
  ownerName: string;
  ownerType: "agent" | "team";
}

// Mock document list for detail view
const mockDocuments = [
  { id: "d1", name: "2026年Q1市场分析报告.pdf", size: "2.4 MB", updatedAt: "2026-03-12", status: "indexed" as const },
  { id: "d2", name: "竞品功能对比表.xlsx", size: "840 KB", updatedAt: "2026-03-11", status: "indexed" as const },
  { id: "d3", name: "用户调研数据汇总.csv", size: "1.1 MB", updatedAt: "2026-03-10", status: "indexed" as const },
  { id: "d4", name: "行业白皮书_AI应用趋势.pdf", size: "5.6 MB", updatedAt: "2026-03-09", status: "indexing" as const },
  { id: "d5", name: "季度OKR复盘文档.docx", size: "320 KB", updatedAt: "2026-03-08", status: "indexed" as const },
  { id: "d6", name: "产品路线图2026.pdf", size: "1.8 MB", updatedAt: "2026-03-07", status: "indexed" as const },
];

export function KnowledgeBaseView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedKB, setSelectedKB] = useState<KBWithOwner | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Aggregate all knowledge bases from agents and teams
  const allKBs = useMemo<KBWithOwner[]>(() => {
    const result: KBWithOwner[] = [];
    agents.forEach((agent) => {
      (agent.knowledgeBases || []).forEach((kb) => {
        result.push({ ...kb, ownerName: agent.name, ownerType: "agent" });
      });
    });
    teams.forEach((team) => {
      (team.knowledgeBases || []).forEach((kb) => {
        result.push({ ...kb, ownerName: team.name, ownerType: "team" });
      });
    });
    return result;
  }, []);

  // Deduplicate by id
  const uniqueKBs = useMemo(() => {
    const seen = new Set<string>();
    return allKBs.filter((kb) => {
      if (seen.has(kb.id)) return false;
      seen.add(kb.id);
      return true;
    });
  }, [allKBs]);

  const filtered = useMemo(() => {
    return uniqueKBs.filter((kb) => {
      const matchesSearch =
        !searchQuery ||
        kb.name.includes(searchQuery) ||
        kb.description.includes(searchQuery) ||
        kb.ownerName.includes(searchQuery);
      const matchesType = typeFilter === "all" || kb.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [uniqueKBs, searchQuery, typeFilter]);

  // Stats
  const totalCount = uniqueKBs.length;
  const activeCount = uniqueKBs.filter((kb) => kb.status === "active").length;
  const totalDocs = uniqueKBs.reduce((s, kb) => s + kb.docCount, 0);
  const typeBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    uniqueKBs.forEach((kb) => {
      map[kb.type] = (map[kb.type] || 0) + 1;
    });
    return map;
  }, [uniqueKBs]);

  if (selectedKB) {
    return <KBDetailView kb={selectedKB} onBack={() => setSelectedKB(null)} />;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-white text-xl" style={{ fontWeight: 600 }}>
              知识库管理
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              管理所有 AI 员工和团队的知识库资源
            </p>
          </div>
          <Button
            className="bg-white text-black hover:bg-neutral-200 w-full sm:w-auto"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            新建知识库
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "知识库总数", value: totalCount.toString(), sub: `${activeCount} 个已就绪` },
            { label: "文档总数", value: totalDocs.toLocaleString(), sub: "跨所有知识库" },
            {
              label: "类型分布",
              value: Object.keys(typeBreakdown).length.toString(),
              sub: "种知识库类型",
            },
            { label: "最近更新", value: "今天", sub: "2026-03-12" },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="bg-white/5 border-white/10 text-white"
            >
              <CardContent className="p-4">
                <div className="text-neutral-500 text-xs mb-1">{stat.label}</div>
                <div className="text-white text-xl" style={{ fontWeight: 600 }}>
                  {stat.value}
                </div>
                <div className="text-neutral-600 text-xs mt-1">{stat.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="搜索知识库名称、描述或所属员工..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-neutral-600"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors border ${
                typeFilter === "all"
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
              }`}
            >
              全部
            </button>
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors border ${
                  typeFilter === key
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Knowledge Base List */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-neutral-500">
              <BookOpen className="h-10 w-10 mx-auto mb-3 text-neutral-700" />
              <p>没有找到匹配的知识库</p>
            </div>
          )}
          {filtered.map((kb, i) => {
            const type = typeConfig[kb.type];
            const status = statusConfig[kb.status];
            return (
              <motion.div
                key={kb.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card
                  className="bg-white/[0.03] border-white/10 hover:bg-white/[0.06] transition-colors cursor-pointer group"
                  onClick={() => setSelectedKB(kb)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Type Icon */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${type.color}`}
                    >
                      {type.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-white text-sm truncate"
                          style={{ fontWeight: 500 }}
                        >
                          {kb.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] py-0 px-1.5 shrink-0 ${type.color}`}
                        >
                          {type.label}
                        </Badge>
                      </div>
                      <p className="text-neutral-500 text-xs truncate">
                        {kb.description}
                      </p>
                    </div>

                    {/* Owner */}
                    <div className="hidden md:flex items-center gap-1.5 shrink-0">
                      <span className="text-neutral-600 text-xs">
                        {kb.ownerType === "agent" ? "员工" : "团队"}:
                      </span>
                      <span className="text-neutral-400 text-xs">
                        {kb.ownerName}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="hidden lg:flex items-center gap-4 shrink-0 text-xs text-neutral-500">
                      <span>{kb.docCount.toLocaleString()} 条</span>
                      <span>{kb.size}</span>
                      <span>{kb.lastUpdated}</span>
                    </div>

                    {/* Status */}
                    <div
                      className={`flex items-center gap-1 shrink-0 ${status.color}`}
                    >
                      {status.icon}
                      <span className="text-xs hidden sm:inline">{status.label}</span>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="h-7 w-7 p-0 inline-flex items-center justify-center rounded-md text-neutral-600 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-neutral-900 border-white/10 text-white"
                      >
                        <DropdownMenuItem
                          className="text-sm hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedKB(kb);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm hover:bg-white/10">
                          <Pencil className="h-4 w-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm hover:bg-white/10">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          重新索引
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-sm text-red-400 hover:bg-red-500/10 hover:text-red-400">
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <ChevronRight className="h-4 w-4 text-neutral-700 group-hover:text-neutral-400 transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-neutral-900 border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">新建知识库</DialogTitle>
            <DialogDescription className="text-neutral-500 text-sm">
              创建新的知识库并分配给员工或团队
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-neutral-400 text-sm mb-1.5 block">
                知识库名称
              </label>
              <Input
                placeholder="输入知识库名称"
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600"
              />
            </div>
            <div>
              <label className="text-neutral-400 text-sm mb-1.5 block">
                描述
              </label>
              <Input
                placeholder="简要描述知识库用途"
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600"
              />
            </div>
            <div>
              <label className="text-neutral-400 text-sm mb-2 block">
                知识库类型
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(typeConfig).map(([key, cfg]) => (
                  <button
                    key={key}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-left"
                  >
                    <span className={cfg.color.split(" ")[0]}>{cfg.icon}</span>
                    <span className="text-neutral-300 text-sm">{cfg.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-neutral-400 text-sm mb-1.5 block">
                分配给
              </label>
              <Input
                placeholder="选择员工或团队"
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              className="border-white/10 text-neutral-400 bg-transparent hover:text-white"
              onClick={() => setShowCreateDialog(false)}
            >
              取消
            </Button>
            <Button
              className="bg-white text-black hover:bg-neutral-200"
              onClick={() => setShowCreateDialog(false)}
            >
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Detail View for a single knowledge base
function KBDetailView({
  kb,
  onBack,
}: {
  kb: KBWithOwner;
  onBack: () => void;
}) {
  const type = typeConfig[kb.type];
  const status = statusConfig[kb.status];
  const [showGraph, setShowGraph] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回知识库列表
        </button>

        {/* Header Card */}
        <Card className="bg-white/5 border-white/10 text-white mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${type.color}`}
                >
                  {type.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-white text-lg" style={{ fontWeight: 600 }}>
                      {kb.name}
                    </h1>
                    <Badge
                      variant="outline"
                      className={`text-xs py-0 ${type.color}`}
                    >
                      {type.label}
                    </Badge>
                    <div className={`flex items-center gap-1 ${status.color}`}>
                      {status.icon}
                      <span className="text-xs">{status.label}</span>
                    </div>
                  </div>
                  <p className="text-neutral-400 text-sm">{kb.description}</p>
                  <div className="flex items-center gap-3 sm:gap-4 mt-3 text-xs text-neutral-500 flex-wrap">
                    <span>
                      所属{kb.ownerType === "agent" ? "员工" : "团队"}：{kb.ownerName}
                    </span>
                    <span>最后更新：{kb.lastUpdated}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-neutral-400 bg-transparent hover:text-white"
                  onClick={() => setShowGraph(true)}
                >
                  <Network className="h-3.5 w-3.5 mr-1.5" />
                  <span className="hidden sm:inline">知识图谱</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-neutral-400 bg-transparent hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  <span className="hidden sm:inline">重新索引</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-neutral-400 bg-transparent hover:text-white"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1.5" />
                  <span className="hidden sm:inline">编辑</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
          {[
            { label: "文档数量", value: kb.docCount.toLocaleString() },
            { label: "数据大小", value: kb.size },
            { label: "索引状态", value: status.label },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="bg-white/[0.03] border-white/10 text-white"
            >
              <CardContent className="p-4 text-center">
                <div className="text-neutral-500 text-xs mb-1">{stat.label}</div>
                <div className="text-white" style={{ fontWeight: 600 }}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Documents Section */}
        <Card className="bg-white/[0.03] border-white/10 text-white">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-white text-sm" style={{ fontWeight: 600 }}>
                文档列表
              </h2>
              <Button
                size="sm"
                className="bg-white text-black hover:bg-neutral-200 h-7 text-xs"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                上传文档
              </Button>
            </div>

            {/* Upload Zone */}
            <div className="mx-4 mt-4 mb-2 border-2 border-dashed border-white/10 rounded-lg p-6 text-center hover:border-white/20 transition-colors">
              <Upload className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
              <p className="text-neutral-500 text-sm">
                拖拽文件到此处，或点击上传
              </p>
              <p className="text-neutral-700 text-xs mt-1">
                支持 PDF、DOCX、TXT、CSV、XLSX 格式，单文件最大 50MB
              </p>
            </div>

            {/* Document List */}
            <div className="divide-y divide-white/5">
              {mockDocuments.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors group"
                >
                  <File className="h-4 w-4 text-neutral-600 shrink-0" />
                  <span className="text-neutral-300 text-sm flex-1 truncate">
                    {doc.name}
                  </span>
                  <span className="text-neutral-600 text-xs hidden sm:inline">
                    {doc.size}
                  </span>
                  <span className="text-neutral-600 text-xs hidden md:inline">
                    {doc.updatedAt}
                  </span>
                  {doc.status === "indexed" ? (
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 text-green-400 bg-green-500/10 border-green-500/20"
                    >
                      已索引
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 text-amber-400 bg-amber-500/10 border-amber-500/20"
                    >
                      索引中
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-neutral-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Knowledge Graph Overlay */}
      {showGraph && (
        <KnowledgeGraph
          focusId={kb.id}
          onClose={() => setShowGraph(false)}
          onNavigate={() => {}}
        />
      )}
    </div>
  );
}