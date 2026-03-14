import { useState, useMemo } from "react";
import {
  Zap,
  Search,
  Download,
  Star,
  Eye,
  Code,
  FileText,
  BarChart3,
  Mail,
  Globe,
  Image,
  Shield,
  Sparkles,
  Clock,
  Users,
  CheckCircle2,
  ArrowLeft,
  TrendingUp,
  Activity,
  BookOpen,
  ShoppingCart,
  Brain,
  ScanLine,
  Layers,
  Swords,
  GitBranch,
  Network,
  Briefcase,
  Calculator,
  PieChart,
  Link,
  Truck,
  MapPin,
  Home,
  UserCheck,
  Package,
  UserCircle,
  Palette,
  MessageSquare,
  Rss,
  Building2,
  Bell,
  Monitor,
  Wifi,
  AlertTriangle,
  Map,
  Scale,
  Heart,
  Compass,
  Wallet,
  Filter,
  Leaf,
  Sprout,
  Hexagon,
  AppWindow,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import {
  skillItems,
  appItems,
  skillCategoryConfig,
  skillCategories,
  appProductTypeConfig,
  appProductTypes,
  type SkillItem,
  type AppItem,
  type SkillCategory,
  type AppProductType,
} from "../../data/app-data";

type SuperFilter = "all" | "skill" | "app";

const iconMap: Record<string, React.ReactNode> = {
  BarChart3: <BarChart3 className="h-5 w-5" />,
  FileText: <FileText className="h-5 w-5" />,
  Mail: <Mail className="h-5 w-5" />,
  Globe: <Globe className="h-5 w-5" />,
  Image: <Image className="h-5 w-5" />,
  Shield: <Shield className="h-5 w-5" />,
  Sparkles: <Sparkles className="h-5 w-5" />,
  Code: <Code className="h-5 w-5" />,
  Search: <Search className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  ShoppingCart: <ShoppingCart className="h-5 w-5" />,
  Brain: <Brain className="h-5 w-5" />,
  ScanLine: <ScanLine className="h-5 w-5" />,
  Layers: <Layers className="h-5 w-5" />,
  Swords: <Swords className="h-5 w-5" />,
  TrendingUp: <TrendingUp className="h-5 w-5" />,
  Activity: <Activity className="h-5 w-5" />,
  GitBranch: <GitBranch className="h-5 w-5" />,
  Network: <Network className="h-5 w-5" />,
  Briefcase: <Briefcase className="h-5 w-5" />,
  Calculator: <Calculator className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  PieChart: <PieChart className="h-5 w-5" />,
  Link: <Link className="h-5 w-5" />,
  Truck: <Truck className="h-5 w-5" />,
  MapPin: <MapPin className="h-5 w-5" />,
  Home: <Home className="h-5 w-5" />,
  UserCheck: <UserCheck className="h-5 w-5" />,
  Package: <Package className="h-5 w-5" />,
  UserCircle: <UserCircle className="h-5 w-5" />,
  Palette: <Palette className="h-5 w-5" />,
  MessageSquare: <MessageSquare className="h-5 w-5" />,
  Rss: <Rss className="h-5 w-5" />,
  Building2: <Building2 className="h-5 w-5" />,
  Eye: <Eye className="h-5 w-5" />,
  Bell: <Bell className="h-5 w-5" />,
  Monitor: <Monitor className="h-5 w-5" />,
  Wifi: <Wifi className="h-5 w-5" />,
  AlertTriangle: <AlertTriangle className="h-5 w-5" />,
  Map: <Map className="h-5 w-5" />,
  Scale: <Scale className="h-5 w-5" />,
  Heart: <Heart className="h-5 w-5" />,
  Compass: <Compass className="h-5 w-5" />,
  Wallet: <Wallet className="h-5 w-5" />,
  Filter: <Filter className="h-5 w-5" />,
  Star: <Star className="h-5 w-5" />,
  Leaf: <Leaf className="h-5 w-5" />,
  Sprout: <Sprout className="h-5 w-5" />,
  Hexagon: <Hexagon className="h-5 w-5" />,
  AppWindow: <AppWindow className="h-5 w-5" />,
};

type AnyItem = SkillItem | AppItem;

function getItemCategory(item: AnyItem): string {
  if (item.superCategory === "skill") return (item as SkillItem).category;
  return (item as AppItem).productType;
}

function getItemCategoryLabel(item: AnyItem): string {
  if (item.superCategory === "skill") {
    const cat = (item as SkillItem).category;
    return skillCategoryConfig[cat]?.label || cat;
  }
  const pt = (item as AppItem).productType;
  return appProductTypeConfig[pt]?.label || pt;
}

function getItemCategoryColor(item: AnyItem): string {
  if (item.superCategory === "skill") {
    const cat = (item as SkillItem).category;
    return skillCategoryConfig[cat]?.color || "";
  }
  const pt = (item as AppItem).productType;
  return appProductTypeConfig[pt]?.color || "";
}

export function SkillsMarketView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [superFilter, setSuperFilter] = useState<SuperFilter>("all");
  const [subFilter, setSubFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<AnyItem | null>(null);

  const allItems: AnyItem[] = useMemo(() => [...skillItems, ...appItems], []);

  const filtered = useMemo(() => {
    return allItems.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.name.includes(searchQuery) ||
        item.description.includes(searchQuery) ||
        item.tags.some((t) => t.includes(searchQuery));
      const matchSuper =
        superFilter === "all" || item.superCategory === superFilter;
      const matchSub = subFilter === "all" || getItemCategory(item) === subFilter;
      return matchSearch && matchSuper && matchSub;
    });
  }, [searchQuery, superFilter, subFilter, allItems]);

  const skillCount = skillItems.length;
  const appCount = appItems.length;
  const installedCount = allItems.filter((s) => s.status === "installed").length;
  const totalDownloads = allItems.reduce((s, item) => s + item.downloads, 0);

  if (selectedItem) {
    return (
      <ItemDetailView
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-xl" style={{ fontWeight: 600 }}>
              技能/应用广场
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              发现和安装强大的技能插件与应用工具，扩展 AI 员工的能力边界
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {
              label: "技能插件",
              value: skillCount.toString(),
              sub: "可组合使用",
            },
            {
              label: "应用工具",
              value: appCount.toString(),
              sub: "持续更新中",
            },
            {
              label: "已安装",
              value: installedCount.toString(),
              sub: "可在控制台调用",
            },
            {
              label: "总安装量",
              value: (totalDownloads / 1000).toFixed(0) + "K",
              sub: "社区活跃",
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="bg-white/5 border-white/10 text-white"
            >
              <CardContent className="p-4">
                <div className="text-neutral-500 text-xs mb-1">
                  {stat.label}
                </div>
                <div className="text-white text-xl" style={{ fontWeight: 600 }}>
                  {stat.value}
                </div>
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
              <Zap className="h-4 w-4" />
              全部
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                superFilter === "all" ? "bg-black/10" : "bg-white/10"
              }`}>
                {allItems.length}
              </span>
            </button>
            <button
              onClick={() => { setSuperFilter("skill"); setSubFilter("all"); }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md text-sm whitespace-nowrap transition-all ${
                superFilter === "skill"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
              style={{ fontWeight: superFilter === "skill" ? 600 : 400 }}
            >
              <Sparkles className="h-4 w-4" />
              技能
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                superFilter === "skill" ? "bg-black/10" : "bg-white/10"
              }`}>
                {skillCount}
              </span>
            </button>
            <button
              onClick={() => { setSuperFilter("app"); setSubFilter("all"); }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-md text-sm whitespace-nowrap transition-all ${
                superFilter === "app"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
              style={{ fontWeight: superFilter === "app" ? 600 : 400 }}
            >
              <AppWindow className="h-4 w-4" />
              应用
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                superFilter === "app" ? "bg-black/10" : "bg-white/10"
              }`}>
                {appCount}
              </span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="搜索技能或应用名称、描述、标签..."
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
            {superFilter === "skill"
              ? skillCategories.map((cat) => {
                  const cfg = skillCategoryConfig[cat];
                  const count = skillItems.filter(
                    (s) => s.category === cat
                  ).length;
                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        setSubFilter(cat === subFilter ? "all" : cat)
                      }
                      className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
                        subFilter === cat
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })
              : appProductTypes.map((pt) => {
                  const cfg = appProductTypeConfig[pt];
                  const count = appItems.filter(
                    (a) => a.productType === pt
                  ).length;
                  return (
                    <button
                      key={pt}
                      onClick={() =>
                        setSubFilter(pt === subFilter ? "all" : pt)
                      }
                      className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
                        subFilter === pt
                          ? "bg-white text-black border-white"
                          : "bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                      }`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            <Zap className="h-10 w-10 mx-auto mb-3 text-neutral-700" />
            <p>没有找到匹配的技能或应用</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((item, i) => {
              const catColor = getItemCategoryColor(item);
              const catLabel = getItemCategoryLabel(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Card
                    className="bg-white/[0.03] border-white/10 hover:bg-white/[0.06] transition-colors cursor-pointer group h-full"
                    onClick={() => setSelectedItem(item)}
                  >
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            catColor || "text-neutral-400 bg-white/5 border-white/10"
                          }`}
                        >
                          {iconMap[item.icon] || <Zap className="h-5 w-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-white text-sm truncate"
                              style={{ fontWeight: 500 }}
                            >
                              {item.name}
                            </span>
                            {item.status === "installed" && (
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0 px-1.5 text-green-400 bg-green-500/10 border-green-500/20 shrink-0"
                              >
                                已安装
                              </Badge>
                            )}
                            {item.status === "update" && (
                              <Badge
                                variant="outline"
                                className="text-[10px] py-0 px-1.5 text-amber-400 bg-amber-500/10 border-amber-500/20 shrink-0"
                              >
                                可更新
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] py-0 px-1.5 ${catColor}`}
                            >
                              {catLabel}
                            </Badge>
                            <span className="text-neutral-600 text-xs">
                              {item.author}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-neutral-500 text-xs mb-3 flex-1 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-neutral-600 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-amber-400" />
                            <span className="text-neutral-400">
                              {item.rating}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {(item.downloads / 1000).toFixed(1)}K
                          </span>
                        </div>
                        <span>{item.lastUpdated}</span>
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
  );
}

function ItemDetailView({
  item,
  onBack,
}: {
  item: AnyItem;
  onBack: () => void;
}) {
  const catColor = getItemCategoryColor(item);
  const catLabel = getItemCategoryLabel(item);
  const isSkill = item.superCategory === "skill";
  const skill = isSkill ? (item as SkillItem) : null;
  const app = !isSkill ? (item as AppItem) : null;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-500 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回技能/应用广场
        </button>

        {/* Header */}
        <Card className="bg-white/5 border-white/10 text-white mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 ${
                    catColor || "text-neutral-400 bg-white/5"
                  }`}
                >
                  {iconMap[item.icon] || <Zap className="h-6 w-6" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1
                      className="text-white text-lg"
                      style={{ fontWeight: 600 }}
                    >
                      {item.name}
                    </h1>
                    <Badge
                      variant="outline"
                      className={`text-xs py-0 ${catColor}`}
                    >
                      {catLabel}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs py-0 text-neutral-400 bg-white/5 border-white/10"
                    >
                      {isSkill ? "技能" : "应用"}
                    </Badge>
                  </div>
                  <p className="text-neutral-400 text-sm mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-neutral-500 flex-wrap">
                    <span>{item.author}</span>
                    <span>v{item.version}</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-400" />
                      {item.rating} ({item.ratingCount})
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {item.downloads.toLocaleString()}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.lastUpdated}
                    </span>
                  </div>
                  {app && (
                    <div className="mt-2">
                      <span className="text-xs text-neutral-600">
                        业务形态：{app.businessType}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="shrink-0 self-start">
                {item.status === "installed" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-500/20 text-green-400 bg-green-500/10 hover:bg-green-500/20 w-full sm:w-auto"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    已安装
                  </Button>
                ) : item.status === "update" ? (
                  <Button
                    size="sm"
                    className="bg-amber-500 text-black hover:bg-amber-400 w-full sm:w-auto"
                  >
                    <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                    更新
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-neutral-200 w-full sm:w-auto"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" />
                    安装
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Features */}
          <Card className="bg-white/[0.03] border-white/10 text-white">
            <CardContent className="p-5">
              <h3
                className="text-white text-sm mb-3"
                style={{ fontWeight: 600 }}
              >
                核心功能
              </h3>
              <div className="space-y-2">
                {item.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-400 shrink-0" />
                    <span className="text-neutral-300">{f}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags + Compatibility */}
          <Card className="bg-white/[0.03] border-white/10 text-white">
            <CardContent className="p-5">
              {skill && (
                <>
                  <h3
                    className="text-white text-sm mb-3"
                    style={{ fontWeight: 600 }}
                  >
                    兼容员工
                  </h3>
                  <div className="space-y-2 mb-5">
                    {skill.compatibility.map((c) => (
                      <div
                        key={c}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Users className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span className="text-neutral-300">{c}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <h3
                className="text-white text-sm mb-3"
                style={{ fontWeight: 600 }}
              >
                标签
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-neutral-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}