import { Link } from "react-router";
import {
  Rocket,
  Package,
  DollarSign,
  Clock,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Target,
  Pen,
  Search,
  ChevronRight,
  Check,
  Zap,
  Bot,
} from "lucide-react";
import { agents, teams, pricingPlans } from "../data/mock-data";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";

const agentIcons: Record<string, React.ReactNode> = {
  "小研": <Search className="h-6 w-6" />,
  "小文": <Pen className="h-6 w-6" />,
  "小拓": <Target className="h-6 w-6" />,
  "小数": <BarChart3 className="h-6 w-6" />,
  "小产": <Package className="h-6 w-6" />,
  "小媒": <Sparkles className="h-6 w-6" />,
  "小客": <Users className="h-6 w-6" />,
  "小搜": <Search className="h-6 w-6" />,
};

export function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-[128px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge variant="outline" className="mb-6 text-neutral-300 border-white/20 bg-white/5">
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                AI驱动的企业操作系统
              </Badge>
              <h1
                className="text-white mb-6"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1 }}
              >
                一键部署 AI员工团队
                <br />
                <span className="text-neutral-400">
                  让企业 24 小时自动运转
                </span>
              </h1>
              <p className="text-neutral-500 mb-8 max-w-lg" style={{ fontSize: "1.125rem", lineHeight: 1.7 }}>
                标准化Agent员工库，开箱即用。市场调研、内容运营、销售拓客、数据分析，全自动执行。
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-md bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10 text-sm font-medium transition-all"
                >
                  <Rocket className="h-4 w-4" />
                  立即创建我的AI团队
                </Link>
                <Link
                  to="/agents"
                  className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-md border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 bg-transparent text-sm font-medium transition-all"
                >
                  <Package className="h-4 w-4" />
                  浏览员工/团队库
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { value: "500+", label: "企业用户" },
                  { value: "8", label: "AI员工" },
                  { value: "99.9%", label: "可用率" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-white" style={{ fontSize: "1.5rem", fontWeight: 700 }}>{stat.value}</div>
                    <div className="text-neutral-500 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-white/5 rounded-2xl blur-xl" />
                <div className="relative rounded-xl border border-white/10 bg-neutral-950 p-4 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-neutral-700" />
                      <div className="w-3 h-3 rounded-full bg-neutral-700" />
                      <div className="w-3 h-3 rounded-full bg-neutral-700" />
                    </div>
                    <span className="text-neutral-500 text-xs ml-2">笨蛋蜂 Console</span>
                  </div>
                  <div className="space-y-2 font-mono text-sm">
                    {[
                      { step: "Step 1", msg: "搜索行业数据", status: "done" },
                      { step: "Step 2", msg: "抽取关键指标", status: "done" },
                      { step: "Step 3", msg: "分析市场趋势", status: "done" },
                      { step: "Step 4", msg: "生成可视化图表", status: "running" },
                      { step: "Step 5", msg: "撰写调研报告", status: "pending" },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.15 }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                          item.status === "running"
                            ? "bg-white/10 border border-white/20"
                            : "bg-white/5"
                        }`}
                      >
                        <span className="text-neutral-500 text-xs w-12">[{item.step}]</span>
                        <span className="text-neutral-300 flex-1">{item.msg}</span>
                        <span className={
                          item.status === "done" ? "text-white" :
                          item.status === "running" ? "text-neutral-400" : "text-neutral-700"
                        }>
                          {item.status === "done" ? "✓" : item.status === "running" ? "⟳" : "○"}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "72%" }}
                      transition={{ delay: 1.5, duration: 1 }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-neutral-500">
                    <span>执行中...</span>
                    <span>72%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-white mb-4"
              style={{ fontSize: "2rem", fontWeight: 700 }}
            >
              企业面临的
              <span className="text-neutral-400">三大困境</span>
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              传统团队建设成本高、效率低、管理复杂，AI员工让这些问题迎刃而解
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <DollarSign className="h-6 w-6" />,
                title: "招人贵",
                desc: "一个市场部团队年薪支出 50万+，培训成本高，人员流动频繁",
              },
              {
                icon: <Clock className="h-6 w-6" />,
                title: "执行慢",
                desc: "人工调研、撰写、分析耗时数天，市场机会稍纵即逝",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "管理复杂",
                desc: "跨部门协作困难，信息传递损耗大，执行标准难以统一",
              },
            ].map((item) => (
              <motion.div key={item.title} whileHover={{ y: -4 }}>
                <Card className="bg-neutral-900 border-white/10 hover:border-white/20 transition-all h-full">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 text-white mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-white mb-2" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                      {item.title}
                    </h3>
                    <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className="text-white mb-4"
              style={{ fontSize: "2rem", fontWeight: 700 }}
            >
              用 AI 员工替代
              <span className="text-neutral-400"> 重复性工作</span>
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              从输入目标到产出结果，全程自动化执行
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {[
              { label: "输入目标", desc: "定义任务需求", icon: <Target className="h-5 w-5" /> },
              { label: "AI团队执行", desc: "多Agent协同", icon: <Bot className="h-5 w-5" /> },
              { label: "自动处理", desc: "7x24小时运转", icon: <Zap className="h-5 w-5" /> },
              { label: "产出结果", desc: "报告/内容/线索", icon: <CheckCircle2 className="h-5 w-5" /> },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-center text-center w-40"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-3">
                    {item.icon}
                  </div>
                  <span className="text-white" style={{ fontWeight: 600 }}>{item.label}</span>
                  <span className="text-neutral-500 text-sm">{item.desc}</span>
                </motion.div>
                {i < 3 && (
                  <ChevronRight className="h-5 w-5 text-neutral-700 mx-2 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Showcase */}
      <section className="py-20 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2
                className="text-white mb-4"
                style={{ fontSize: "2rem", fontWeight: 700 }}
              >
                AI员工库
              </h2>
              <p className="text-neutral-500">标准化Agent，开箱即用，按需部署</p>
            </div>
            <Link
              to="/agents"
              className="inline-flex items-center gap-1 text-neutral-400 hover:text-white mt-4 md:mt-0 transition-colors"
            >
              查看全部 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {agents.slice(0, 8).map((agent) => (
              <motion.div key={agent.id} whileHover={{ y: -4 }}>
                <Card className="bg-neutral-900 border-white/10 hover:border-white/20 transition-all overflow-hidden h-full">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4">
                      {agentIcons[agent.name] || <Bot className="h-6 w-6" />}
                    </div>
                    <h3 className="text-white mb-1" style={{ fontWeight: 600 }}>
                      {agent.name} · {agent.role}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
                      {agent.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-neutral-400 border-white/10 bg-white/5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link
                      to={`/agents/${agent.id}`}
                      className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      查看详情 <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Showcase */}
      <section className="py-20 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-white mb-4"
              style={{ fontSize: "2rem", fontWeight: 700 }}
            >
              AI团队方案
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              预配置的Agent团队，一键部署整个部门的工作能力
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {teams.map((team) => {
              const teamAgents = agents.filter((a) =>
                team.agentIds.includes(a.id)
              );
              return (
                <motion.div key={team.id} whileHover={{ y: -4 }}>
                  <Card className="bg-neutral-900 border-white/10 hover:border-white/20 transition-all h-full">
                    <CardContent className="p-6">
                      <div className="text-3xl mb-4">{team.icon}</div>
                      <h3 className="text-white mb-2" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                        {team.name}
                      </h3>
                      <p className="text-neutral-500 mb-4 text-sm">{team.description}</p>

                      <div className="p-3 rounded-lg bg-white/5 mb-4">
                        <span className="text-xs text-neutral-500">解决问题</span>
                        <p className="text-neutral-400 text-sm mt-1">{team.problem}</p>
                      </div>

                      <div className="mb-4">
                        <span className="text-xs text-neutral-500 block mb-2">团队成员</span>
                        <div className="flex flex-wrap gap-2">
                          {teamAgents.map((a) => (
                            <Badge key={a.id} variant="outline" className="text-neutral-300 border-white/10 bg-white/5">
                              {a.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/teams/${team.id}`}
                          className="flex-1 inline-flex items-center justify-center py-2 text-sm rounded-md border border-white/20 text-neutral-300 hover:text-white hover:border-white/40 bg-transparent transition-all"
                        >
                          了解详情
                        </Link>
                        <Button className="flex-1 bg-white text-black hover:bg-neutral-200">
                          一键部署团队
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow Demo */}
      <section className="py-20 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-white mb-4"
              style={{ fontSize: "2rem", fontWeight: 700 }}
            >
              实时工作流演示
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              像管理真人团队一样，查看AI员工的每一步执行过程
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="bg-neutral-900 border-white/10">
              <CardContent className="p-6">
                <h3 className="text-white mb-4" style={{ fontWeight: 600 }}>任务输入</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-neutral-500 text-sm block mb-2">选择AI员工</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white">
                        <Search className="h-4 w-4" />
                      </div>
                      <span className="text-white text-sm">小研 · AI市场调研员</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-neutral-500 text-sm block mb-2">任务描述</label>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-neutral-300 text-sm">
                      分析2026年中国AI SaaS行业市场趋势，输出完整调研报告
                    </div>
                  </div>
                  <Button className="w-full bg-white text-black hover:bg-neutral-200">
                    开始执行
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white" style={{ fontWeight: 600 }}>执行日志</h3>
                  <Badge variant="outline" className="text-green-400 border-green-500/20 bg-green-500/10">
                    运行中
                  </Badge>
                </div>
                <div className="space-y-3 font-mono text-sm">
                  {[
                    { time: "09:00:12", msg: "搜索行业数据", status: "done" },
                    { time: "09:02:35", msg: "已收集 2,847 条数据记录", status: "done" },
                    { time: "09:05:18", msg: "数据清洗完成，有效数据 2,103 条", status: "done" },
                    { time: "09:08:42", msg: "正在分析市场趋势...", status: "running" },
                    { time: "--:--:--", msg: "生成可视化图表", status: "pending" },
                    { time: "--:--:--", msg: "撰写报告摘要", status: "pending" },
                  ].map((log, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                        log.status === "running"
                          ? "bg-white/10 border border-white/20"
                          : "bg-white/5"
                      }`}
                    >
                      <span className="text-neutral-600 text-xs w-16">{log.time}</span>
                      <span
                        className={
                          log.status === "done"
                            ? "text-neutral-300"
                            : log.status === "running"
                            ? "text-white"
                            : "text-neutral-600"
                        }
                      >
                        {log.msg}
                      </span>
                      <span className="ml-auto">
                        {log.status === "done" && <CheckCircle2 className="h-4 w-4 text-white" />}
                        {log.status === "running" && (
                          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {log.status === "pending" && (
                          <span className="w-4 h-4 rounded-full border border-neutral-700 block" />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-white mb-4"
              style={{ fontSize: "2rem", fontWeight: 700 }}
            >
              简单透明的定价
            </h2>
            <p className="text-neutral-500 max-w-2xl mx-auto">
              选择适合您团队规模的方案，随时升级扩展
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <motion.div key={plan.name} whileHover={{ y: -4 }}>
                <Card className={`h-full ${
                  plan.highlighted
                    ? "border-2 border-white bg-neutral-900"
                    : "border-white/10 bg-neutral-900"
                }`}>
                  <CardContent className="p-6 relative">
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-xs rounded-full bg-white text-black" style={{ fontWeight: 600 }}>
                        最受欢迎
                      </div>
                    )}
                    <h3 className="text-white mb-2" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                      {plan.name}
                    </h3>
                    <p className="text-neutral-500 text-sm mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-white" style={{ fontSize: "2.25rem", fontWeight: 700 }}>{plan.price}</span>
                      <span className="text-neutral-500">{plan.period}</span>
                    </div>
                    <Button
                      className={`w-full mb-6 ${
                        plan.highlighted
                          ? "bg-white text-black hover:bg-neutral-200"
                          : "bg-transparent border border-white/20 text-neutral-300 hover:text-white hover:border-white/40"
                      }`}
                    >
                      {plan.cta}
                    </Button>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-neutral-400">
                          <Check className="h-4 w-4 text-white shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-2xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-white/5 rounded-2xl" />
            <div className="absolute inset-0 border border-white/10 rounded-2xl" />
            <div className="relative">
              <h2
                className="text-white mb-4"
                style={{ fontSize: "2rem", fontWeight: 700 }}
              >
                准备好开始了吗？
              </h2>
              <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
                5分钟内部署你的第一个AI员工团队，开启企业自动化运营新时代
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-md bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10 text-sm font-medium transition-all"
                >
                  <Rocket className="h-4 w-4" />
                  立即开始
                </Link>
                <Button variant="outline" size="lg" className="border-white/20 text-neutral-300 hover:text-white bg-transparent">
                  联系销售
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}