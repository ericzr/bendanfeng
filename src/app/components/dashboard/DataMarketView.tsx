import { useState, useMemo } from "react";
import {
  Database,
  Search,
  Download,
  Star,
  FileText,
  Globe,
  MessageSquare,
  RefreshCw,
  ArrowLeft,
  Clock,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  Heart,
  UserSearch,
  Wheat,
  Factory,
  Store,
  Landmark,
  Layers,
  Building2,
  PiggyBank,
  Network,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { dataPackages, categoryConfig as catCfg, getSuperCategory, knowledgeCategories, databaseCategories, type DataPackage, type SubDataPackage, type PackageCategory } from "../../data/knowledge-data";
import { KnowledgeGraph } from "../KnowledgeGraph";

const iconMap: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Building2: <Building2 className="h-5 w-5" />,
  BarChart3: <BarChart3 className="h-5 w-5" />,
  Landmark: <Landmark className="h-5 w-5" />,
  Globe: <Globe className="h-5 w-5" />,
  Factory: <Factory className="h-5 w-5" />,
  PiggyBank: <PiggyBank className="h-5 w-5" />,
  ShoppingCart: <ShoppingCart className="h-5 w-5" />,
  Layers: <Layers className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  UserSearch: <UserSearch className="h-5 w-5" />,
  Wheat: <Wheat className="h-5 w-5" />,
  Store: <Store className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  Scale: <Landmark className="h-5 w-5" />,
  Briefcase: <Building2 className="h-5 w-5" />,
  Megaphone: <MessageSquare className="h-5 w-5" />,
  Cpu: <Database className="h-5 w-5" />,
  LineChart: <BarChart3 className="h-5 w-5" />,
  Building: <Building2 className="h-5 w-5" />,
  Clock: <Clock className="h-5 w-5" />,
  Database: <Database className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
};

export function DataMarketView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [superFilter, setSuperFilter] = useState<"all" | "database" | "knowledge">("all");
  const [subFilter, setSubFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<DataPackage | null>(null);
  const [graphOpen, setGraphOpen] = useState(false);
  const [graphFocusId, setGraphFocusId] = useState<string | undefined>();

  const filtered = useMemo(() => {
    return dataPackages.filter((item) => {
      const matchSearch = !searchQuery || item.name.includes(searchQuery) || item.description.includes(searchQuery) || item.tags.some(t => t.includes(searchQuery));
      const superCat = getSuperCategory(item.category);
      const matchSuper = superFilter === "all" || superCat === superFilter;
      const matchSub = subFilter === "all" || item.category === subFilter;
      return matchSearch && matchSuper && matchSub;
    });
  }, [searchQuery, superFilter, subFilter]);

  const dbCount = dataPackages.filter(d => getSuperCategory(d.category) === "database").length;
  const kbCount = dataPackages.filter(d => getSuperCategory(d.category) === "knowledge").length;
  const subscribedCount = dataPackages.filter(d => d.status === "subscribed").length;
  const totalIndicators = dataPackages.reduce((s, d) => s + d.indicatorCount, 0);
  const totalDownloads = dataPackages.reduce((s, d) => s + d.downloads, 0);

  const openGraph = (focusId?: string) => {
    setGraphFocusId(focusId);
    setGraphOpen(true);
  };

  if (selectedItem) {
    return (
      <>
        <DataPackageDetail
          item={selectedItem}
          onBack={() => setSelectedItem(null)}
          onOpenGraph={(id) => openGraph(id)}
        />
        {graphOpen && (
          <KnowledgeGraph
            focusId={graphFocusId}
            onClose={() => setGraphOpen(false)}
            onNavigate={(id) => {
              const pkg = dataPackages.find(d => d.id === id);
              if (pkg) {
                setSelectedItem(pkg);
                setGraphOpen(false);
              }
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-white text-xl" style={{ fontWeight: 600 }}>数据/知识市场</h1>
              <p className="text-neutral-500 text-sm mt-1">浏览和订阅结构化数据包，构建 AI 员工的知识燃料体系</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 gap-1.5 w-full sm:w-auto"
              onClick={() => openGraph()}
            >
              <Network className="h-3.5 w-3.5" />
              全局知识图谱
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "数据/知识包总数", value: dataPackages.length.toString(), sub: `${dbCount} 数据库 · ${kbCount} 知识库` },
              { label: "已订阅", value: subscribedCount.toString(), sub: "个数据包" },
              { label: "指标总数", value: totalIndicators.toString() + "+", sub: "细分数据指标" },
              { label: "社区使用", value: (totalDownloads / 1000).toFixed(1) + "K", sub: "次订阅/下载" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-white/5 border-white/10 text-white">
                <CardContent className="p-4">
                  <div className="text-neutral-500 text-xs mb-1">{stat.label}</div>
                  <div className="text-white text-xl" style={{ fontWeight: 600 }}>{stat.value}</div>
                  <div className="text-neutral-600 text-xs mt-1">{stat.sub}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tab Switch */}
          <div className="mb-6 overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10 w-fit">
              <button
                onClick={() => { setSuperFilter("all"); setSubFilter("all"); }}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md text-sm whitespace-nowrap transition-all ${
                  superFilter === "all"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
                style={{ fontWeight: superFilter === "all" ? 600 : 400 }}
              >
                <Layers className="h-4 w-4" />
                全部
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  superFilter === "all" ? "bg-black/10" : "bg-white/10"
                }`}>
                  {dataPackages.length}
                </span>
              </button>
              <button
                onClick={() => { setSuperFilter("database"); setSubFilter("all"); }}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md text-sm whitespace-nowrap transition-all ${
                  superFilter === "database"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
                style={{ fontWeight: superFilter === "database" ? 600 : 400 }}
              >
                <Database className="h-4 w-4" />
                数据库
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  superFilter === "database" ? "bg-black/10" : "bg-white/10"
                }`}>
                  {dbCount}
                </span>
              </button>
              <button
                onClick={() => { setSuperFilter("knowledge"); setSubFilter("all"); }}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md text-sm whitespace-nowrap transition-all ${
                  superFilter === "knowledge"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
                style={{ fontWeight: superFilter === "knowledge" ? 600 : 400 }}
              >
                <BookOpen className="h-4 w-4" />
                知识库
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  superFilter === "knowledge" ? "bg-black/10" : "bg-white/10"
                }`}>
                  {kbCount}
                </span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="搜索数据包名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:border-white/30 focus-visible:ring-white/20"
              />
            </div>
          </div>

          {/* Sub-category filters */}
          {superFilter !== "all" && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setSubFilter("all")}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
                  subFilter === "all"
                    ? "bg-white text-black border-white"
                    : "bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                }`}
              >
                全部
              </button>
              {(superFilter === "database" ? databaseCategories : knowledgeCategories).map(cat => {
                const cfg = catCfg[cat];
                const count = dataPackages.filter(d => d.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setSubFilter(cat === subFilter ? "all" : cat)}
                    className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
                      subFilter === cat
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {cfg?.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Data Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              <Database className="h-10 w-10 mx-auto mb-3 text-neutral-700" />
              <p>没有找到匹配的数据包</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((item, i) => {
                const cat = catCfg[item.category];
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Card
                      className="bg-white/[0.03] border-white/10 hover:bg-white/[0.06] transition-colors cursor-pointer group h-full"
                      onClick={() => setSelectedItem(item)}
                    >
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                            {iconMap[item.icon] || <Database className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-white text-sm truncate" style={{ fontWeight: 500 }}>{item.name}</span>
                              {item.status === "subscribed" && (
                                <Badge variant="outline" className="text-[10px] py-0 px-1.5 text-green-400 bg-green-500/10 border-green-500/20 shrink-0">已订阅</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-neutral-600">
                              <Badge variant="outline" className={`text-[10px] py-0 px-1.5 ${cat?.color || ""}`}>{cat?.label}</Badge>
                              <span>{item.subCategoryCount} 个子分类</span>
                              <span>·</span>
                              <span>{item.indicatorCount}+ 指标</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-sm ${item.price === "free" ? "text-green-400" : "text-white"}`} style={{ fontWeight: 600 }}>
                              {item.priceLabel}
                            </span>
                          </div>
                        </div>

                        <p className="text-neutral-500 text-xs mb-3 flex-1 line-clamp-2">{item.description}</p>

                        {/* Sub-categories preview */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.children.slice(0, 4).map((child) => (
                            <span key={child.id} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5">
                              {child.name}
                            </span>
                          ))}
                          {item.children.length > 4 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-600">
                              +{item.children.length - 4}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-neutral-600 pt-2 border-t border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-amber-400" />
                              <span className="text-neutral-400">{item.rating}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {(item.downloads / 1000).toFixed(1)}K
                            </span>
                            <span className="flex items-center gap-1">
                              <Database className="h-3 w-3" />
                              {item.size}
                            </span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); openGraph(item.id); }}
                            className="flex items-center gap-1 text-neutral-500 hover:text-white transition-colors"
                          >
                            <Network className="h-3 w-3" />
                            <span className="text-[10px]">知识结构</span>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {graphOpen && (
        <KnowledgeGraph
          focusId={graphFocusId}
          onClose={() => setGraphOpen(false)}
          onNavigate={(id) => {
            const pkg = dataPackages.find(d => d.id === id);
            if (pkg) {
              setSelectedItem(pkg);
              setGraphOpen(false);
            }
          }}
        />
      )}
    </>
  );
}

// ============ Detail View ============

function DataPackageDetail({ item, onBack, onOpenGraph }: { item: DataPackage; onBack: () => void; onOpenGraph: (id: string) => void }) {
  const [expandedChild, setExpandedChild] = useState<string | null>(null);
  const cat = catCfg[item.category];
  const isKB = getSuperCategory(item.category) === "knowledge";
  const relatedPkgs = item.relatedIds.map(id => dataPackages.find(d => d.id === id)).filter(Boolean) as DataPackage[];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          返回数据/知识市场
        </button>

        {/* Header */}
        <Card className="bg-white/5 border-white/10 text-white mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  {iconMap[item.icon] || <Database className="h-6 w-6" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-white text-lg" style={{ fontWeight: 600 }}>{item.name}</h1>
                    <Badge variant="outline" className={`text-xs py-0 ${cat?.color || ""}`}>{cat?.label}</Badge>
                    <Badge variant="outline" className={`text-xs py-0 ${item.price === "free" ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-white bg-white/5 border-white/10"}`}>
                      {item.priceLabel}
                    </Badge>
                  </div>
                  <p className="text-neutral-400 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-neutral-500 flex-wrap">
                    <span>{item.provider}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400" />{item.rating} ({item.ratingCount})</span>
                    <span className="flex items-center gap-1"><Download className="h-3 w-3" />{item.downloads.toLocaleString()}</span>
                    <span className="hidden sm:flex items-center gap-1"><Clock className="h-3 w-3" />{item.lastUpdated}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/10 text-neutral-400 hover:text-white bg-transparent hover:bg-white/5 gap-1"
                  onClick={() => onOpenGraph(item.id)}
                >
                  <Network className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">知识结构</span>
                </Button>
                {item.status === "subscribed" ? (
                  <Button variant="outline" size="sm" className="border-green-500/20 text-green-400 bg-green-500/10 hover:bg-green-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />已订阅
                  </Button>
                ) : (
                  <Button size="sm" className="bg-white text-black hover:bg-neutral-200">
                    <ShoppingCart className="h-3.5 w-3.5 mr-1.5" />{item.price === "free" ? "免费获取" : "订阅"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
          {[
            { label: "子分类", value: item.subCategoryCount + " 个" },
            { label: isKB ? "知识条目" : "数据指标", value: item.indicatorCount + "+" },
            { label: isKB ? "知识体量" : "数据体量", value: item.size },
            { label: "关联数据/知识包", value: item.relatedIds.length + " 个" },
          ].map((stat) => (
            <Card key={stat.label} className="bg-white/[0.03] border-white/10 text-white">
              <CardContent className="p-4 text-center">
                <div className="text-neutral-500 text-xs mb-1">{stat.label}</div>
                <div className="text-white" style={{ fontWeight: 600 }}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sub data packages - nested structure */}
        <Card className="bg-white/[0.03] border-white/10 text-white mb-6">
          <CardContent className="p-5">
            <h3 className="text-white text-sm mb-4" style={{ fontWeight: 600 }}>
              {isKB ? "知识模块" : "包含数据"} ({item.children.length} 个{isKB ? "子知识模块" : "子数据包"})
            </h3>
            <div className="space-y-1">
              {item.children.map((child) => {
                const isExpanded = expandedChild === child.id;
                return (
                  <div key={child.id} className="border border-white/5 rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-3 hover:bg-white/[0.03] transition-colors text-left"
                      onClick={() => setExpandedChild(isExpanded ? null : child.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded flex items-center justify-center ${item.color}`}>
                          <Database className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <div className="text-white text-sm" style={{ fontWeight: 500 }}>{child.name}</div>
                          <div className="text-neutral-500 text-xs">{child.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-neutral-600 text-xs">{child.indicators.length} 指标</span>
                        <ChevronRight className={`h-4 w-4 text-neutral-600 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                      </div>
                    </button>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-white/[0.01]"
                      >
                        <div className="p-4 space-y-3">
                          <div>
                            <div className="text-neutral-500 text-xs mb-1.5">数据指标</div>
                            <div className="flex flex-wrap gap-1.5">
                              {child.indicators.map(ind => (
                                <span key={ind} className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-300">{ind}</span>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div>
                              <div className="text-neutral-500 mb-1">数据性质</div>
                              <div className="text-neutral-300">{child.dataType}</div>
                            </div>
                            <div>
                              <div className="text-neutral-500 mb-1">更新频率</div>
                              <div className="text-neutral-300">{child.updateFrequency}</div>
                            </div>
                            <div>
                              <div className="text-neutral-500 mb-1">数据来源</div>
                              <div className="text-neutral-300">{child.sources.length} 个机构</div>
                            </div>
                          </div>
                          <div>
                            <div className="text-neutral-500 text-xs mb-1.5">来源机构</div>
                            <div className="flex flex-wrap gap-1">
                              {child.sources.map(src => (
                                <span key={src} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/10 text-blue-400">{src}</span>
                              ))}
                            </div>
                          </div>
                          {child.composableStructure && child.composableStructure.length > 0 && (
                            <div>
                              <div className="text-neutral-500 text-xs mb-1.5">可组合结构</div>
                              <div className="flex flex-wrap gap-1">
                                {child.composableStructure.map(cs => (
                                  <span key={cs} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/10 text-emerald-400">{cs}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Features */}
          <Card className="bg-white/[0.03] border-white/10 text-white">
            <CardContent className="p-5">
              <h3 className="text-white text-sm mb-3" style={{ fontWeight: 600 }}>数据特点</h3>
              <div className="space-y-2">
                {item.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                    <span className="text-neutral-300">{f}</span>
                  </div>
                ))}
              </div>
              <h3 className="text-white text-sm mt-5 mb-3" style={{ fontWeight: 600 }}>标签</h3>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-400">{tag}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Related data packages */}
          <Card className="bg-white/[0.03] border-white/10 text-white">
            <CardContent className="p-5">
              <h3 className="text-white text-sm mb-3" style={{ fontWeight: 600 }}>关联数据包</h3>
              <div className="space-y-2">
                {relatedPkgs.slice(0, 5).map((rp) => (
                  <div key={rp.id} className="flex items-center gap-2 text-sm group cursor-pointer hover:bg-white/[0.03] p-1.5 -mx-1.5 rounded-lg transition-colors">
                    <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${rp.color}`}>
                      {iconMap[rp.icon] ? <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{iconMap[rp.icon]}</span> : <Database className="h-3.5 w-3.5" />}
                    </div>
                    <span className="text-neutral-300 flex-1 text-xs">{rp.name}</span>
                    <Badge variant="outline" className={`text-[10px] py-0 px-1 ${catCfg[rp.category]?.color || ""}`}>{catCfg[rp.category]?.label}</Badge>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-xs text-neutral-500 hover:text-white gap-1"
                onClick={() => onOpenGraph(item.id)}
              >
                <Network className="h-3.5 w-3.5" />
                在知识图谱中查看全部关联
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}