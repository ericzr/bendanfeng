import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  Bot,
  Pen,
  Target,
  BarChart3,
  Package,
  Sparkles,
  Users,
  UsersRound,
  ArrowRight,
} from "lucide-react";
import { agents, categories, teams } from "../data/mock-data";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import type { Agent, Team } from "../data/mock-data";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

const agentIcons: Record<string, React.ReactNode> = {
  小研: <Search className="h-6 w-6" />,
  小文: <Pen className="h-6 w-6" />,
  小拓: <Target className="h-6 w-6" />,
  小数: <BarChart3 className="h-6 w-6" />,
  小产: <Package className="h-6 w-6" />,
  小媒: <Sparkles className="h-6 w-6" />,
  小客: <Users className="h-6 w-6" />,
  小搜: <Search className="h-6 w-6" />,
};

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="bg-neutral-900 border-white/10 hover:border-white/20 transition-all overflow-hidden h-full">
        <CardContent className="p-5">
          <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4">
            {agentIcons[agent.name] || (
              <Bot className="h-6 w-6" />
            )}
          </div>
          <h3
            className="text-white mb-0.5"
            style={{ fontSize: "1.125rem", fontWeight: 600 }}
          >
            {agent.name}
          </h3>
          <p className="text-neutral-500 text-sm mb-3">
            {agent.role}
          </p>
          <p className="text-neutral-400 text-sm line-clamp-2 mb-4">
            {agent.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {agent.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-neutral-400 border-white/10 bg-white/5"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Link
              to={`/agents/${agent.id}`}
              className="flex-1 inline-flex items-center justify-center py-2 text-sm rounded-md border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 bg-transparent transition-all"
            >
              查看详情
            </Link>
            <Button className="flex-1 bg-white text-black hover:bg-neutral-200">
              立即部署
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TeamCard({ team }: { team: Team }) {
  const teamAgents = team.agentIds
    .map((id) => agents.find((a) => a.id === id))
    .filter(Boolean) as Agent[];

  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="bg-neutral-900 border-white/10 hover:border-white/20 transition-all overflow-hidden h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-2xl shrink-0">
              {team.icon}
            </div>
            <div className="min-w-0">
              <h3
                className="text-white mb-0.5"
                style={{ fontSize: "1.125rem", fontWeight: 600 }}
              >
                {team.name}
              </h3>
              <p className="text-neutral-500 text-sm">
                {team.description}
              </p>
            </div>
          </div>

          <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/5">
            <p className="text-xs text-neutral-500 mb-1" style={{ fontWeight: 500 }}>解决痛点</p>
            <p className="text-neutral-400 text-sm">{team.problem}</p>
          </div>

          <div className="mb-4">
            <p className="text-xs text-neutral-500 mb-2" style={{ fontWeight: 500 }}>团队成员</p>
            <div className="flex flex-wrap gap-2">
              {teamAgents.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10"
                >
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                    {agentIcons[a.name] ? (
                      <span className="scale-[0.45] flex items-center justify-center">
                        {agentIcons[a.name]}
                      </span>
                    ) : (
                      <Bot className="h-3 w-3" />
                    )}
                  </div>
                  <span className="text-xs text-neutral-300">{a.name}</span>
                  <span className="text-xs text-neutral-600">·</span>
                  <span className="text-xs text-neutral-500">{a.role}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/teams/${team.id}`}
              className="flex-1 inline-flex items-center justify-center py-2 text-sm rounded-md border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 bg-transparent transition-all"
            >
              了解详情
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
            <Button className="flex-1 bg-white text-black hover:bg-neutral-200">
              一键部署团队
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

type TabType = "agents" | "teams";

export function AgentStorePage() {
  const [activeTab, setActiveTab] = useState<TabType>("agents");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAgents = agents.filter((agent) => {
    const matchCategory =
      selectedCategory === "全部" ||
      agent.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      agent.name.includes(searchQuery) ||
      agent.role.includes(searchQuery) ||
      agent.tags.some((t) => t.includes(searchQuery));
    return matchCategory && matchSearch;
  });

  const filteredTeams = teams.filter((team) => {
    if (!searchQuery) return true;
    return (
      team.name.includes(searchQuery) ||
      team.description.includes(searchQuery) ||
      team.problem.includes(searchQuery)
    );
  });

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-white mb-2"
              style={{ fontSize: "2rem", fontWeight: 700 }}
            >
              员工 / 团队库
            </h1>
            <p className="text-neutral-500">
              浏览和部署标准化AI员工与预配置团队，开箱即用
            </p>
          </div>

          {/* Tab Switch */}
          <div className="mb-6 overflow-x-auto -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10 w-fit">
              <button
                onClick={() => { setActiveTab("agents"); setSelectedCategory("全部"); }}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm transition-all ${
                  activeTab === "agents"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
                style={{ fontWeight: activeTab === "agents" ? 600 : 400 }}
              >
                <Bot className="h-4 w-4" />
                员工库
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "agents" ? "bg-black/10" : "bg-white/10"
                }`}>
                  {agents.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm transition-all ${
                  activeTab === "teams"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
                style={{ fontWeight: activeTab === "teams" ? 600 : 400 }}
              >
                <UsersRound className="h-4 w-4" />
                团队库
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === "teams" ? "bg-black/10" : "bg-white/10"
                }`}>
                  {teams.length}
                </span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                type="text"
                placeholder={activeTab === "agents" ? "搜索AI员工..." : "搜索AI团队..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:border-white/30 focus-visible:ring-white/20"
              />
            </div>
          </div>

          {/* Agents Tab */}
          {activeTab === "agents" && (
            <>
              {/* Category filters */}
              <div className="mb-8 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm transition-colors border ${
                      selectedCategory === cat
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:border-white/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div>
                {filteredAgents.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAgents.map((agent) => (
                      <AgentCard key={agent.id} agent={agent} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Bot className="h-12 w-12 text-neutral-700 mx-auto mb-4" />
                    <p className="text-neutral-500">
                      没有找到匹配的AI员工
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Teams Tab */}
          {activeTab === "teams" && (
            <div>
              {filteredTeams.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTeams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <UsersRound className="h-12 w-12 text-neutral-700 mx-auto mb-4" />
                  <p className="text-neutral-500">
                    没有找到匹配的AI团队
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}