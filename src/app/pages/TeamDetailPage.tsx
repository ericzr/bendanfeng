import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Bot,
  Search,
  Pen,
  Target,
  BarChart3,
  Package,
  Sparkles,
  Users,
  Rocket,
  Lightbulb,
  ArrowRight,
  UsersRound,
  Eye,
  FlaskConical,
  Radio,
  Filter,
  FileText,
  TrendingUp,
  Palette,
  CalendarDays,
  BarChart2,
  Mail,
  Heart,
  AlertTriangle,
  RefreshCw,
  UserRound,
  MessageCircle,
  CheckCircle2,
  Clock,
  Plug,
} from "lucide-react";
import { teams, agents } from "../data/mock-data";
import type { Agent } from "../data/mock-data";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { TeamWorkflowEditor } from "../components/TeamWorkflowEditor";

const agentIconsLg: Record<string, React.ReactNode> = {
  "小研": <Search className="h-6 w-6" />,
  "小文": <Pen className="h-6 w-6" />,
  "小拓": <Target className="h-6 w-6" />,
  "小数": <BarChart3 className="h-6 w-6" />,
  "小产": <Package className="h-6 w-6" />,
  "小媒": <Sparkles className="h-6 w-6" />,
  "小客": <Users className="h-6 w-6" />,
  "小搜": <Search className="h-6 w-6" />,
};

const capabilityIcons: Record<string, React.ReactNode> = {
  target: <Target className="h-5 w-5" />,
  search: <Search className="h-5 w-5" />,
  funnel: <Filter className="h-5 w-5" />,
  broadcast: <Radio className="h-5 w-5" />,
  eye: <Eye className="h-5 w-5" />,
  flask: <FlaskConical className="h-5 w-5" />,
  "file-text": <FileText className="h-5 w-5" />,
  trending: <TrendingUp className="h-5 w-5" />,
  palette: <Palette className="h-5 w-5" />,
  calendar: <CalendarDays className="h-5 w-5" />,
  chart: <BarChart2 className="h-5 w-5" />,
  user: <UserRound className="h-5 w-5" />,
  mail: <Mail className="h-5 w-5" />,
  heart: <Heart className="h-5 w-5" />,
  alert: <AlertTriangle className="h-5 w-5" />,
  refresh: <RefreshCw className="h-5 w-5" />,
};

// Simple SVG icons for integration platforms
function WeChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.495.495 0 0 1 .18-.56C23.028 18.572 24 16.862 24 14.97c0-3.299-3.09-6.023-7.062-6.112zm-2.076 2.921c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.151 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
    </svg>
  );
}

function WeComIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10.006 0C4.48 0 0 3.986 0 8.9c0 2.723 1.36 5.152 3.484 6.77l-.684 2.536a.474.474 0 0 0 .652.543l2.896-1.378A11.036 11.036 0 0 0 10.006 18c.178 0 .354-.006.53-.014C11.723 21.273 15.498 24 19.994 24c1.406 0 2.737-.296 3.943-.83l2.418 1.15a.395.395 0 0 0 .543-.452l-.57-2.116C23.376 20.462 24 18.634 24 16.667 24 12.333 20.484 8.776 15.999 8.34 14.986 3.602 12.037 0 10.006 0zm-3.08 6.095c.682 0 1.235.553 1.235 1.236a1.236 1.236 0 0 1-2.47 0c0-.683.553-1.236 1.235-1.236zm6.156 0c.683 0 1.236.553 1.236 1.236a1.236 1.236 0 0 1-2.471 0c0-.683.553-1.236 1.235-1.236zM16.07 10.4c.568 0 1.03.462 1.03 1.03a1.03 1.03 0 0 1-2.06 0c0-.568.462-1.03 1.03-1.03zm5.13 0c.569 0 1.03.462 1.03 1.03a1.03 1.03 0 0 1-2.06 0c0-.568.462-1.03 1.03-1.03z" />
    </svg>
  );
}

function FeishuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M2.564 10.476c1.464-1.904 3.675-4.26 6.17-5.79.26-.16.555.13.425.418C7.804 8.299 7.323 12.066 8.39 15.26c.044.13-.052.266-.19.254-2.098-.184-5.14-1.012-7.093-3.33a1.09 1.09 0 0 1 1.457-1.708z" />
      <path d="M21.436 10.476c-1.464-1.904-3.675-4.26-6.17-5.79-.26-.16-.555.13-.425.418 1.355 3.195 1.836 6.962.769 10.156-.044.13.052.266.19.254 2.098-.184 5.14-1.012 7.093-3.33a1.09 1.09 0 0 0-1.457-1.708z" />
      <path d="M12 1.5C7.306 1.5 3.5 5.306 3.5 10c0 3.186 1.756 5.964 4.354 7.422L12 24l4.146-6.578A8.474 8.474 0 0 0 20.5 10c0-4.694-3.806-8.5-8.5-8.5zm0 12a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
    </svg>
  );
}

function DingTalkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 11.258l-1.103.457s.15.52.213.751c.063.23.043.378-.068.378h-2.593l-.008.032-.003.016v.008l-.008.032c-.02.09-.069.358-.069.358s2.691.383 2.127 2.203c-.454 1.465-3.665 1.879-3.665 1.879l-.076-.407s1.735-.396 1.753-1.248c.018-.852-1.616-1.07-1.616-1.07l-.267 1.615s-.408.093-1.063.093c-.655 0-1.246-.188-1.246-.188l.925-3.435H8.583l-.054-.247h2.413l.397-1.458H8.822l-.054-.247h2.725l.57-1.877s.188-.022.635-.022c.448 0 .716.081.716.081L12.84 10.9h1.712l-.468 1.705h-1.647l-.278 1.046h1.535l-.042.17h.916l.04-.17h2.43c.41 0 .524-.393.524-.393z" />
    </svg>
  );
}

function SlackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}

const integrationIconMap: Record<string, (props: { className?: string }) => React.ReactNode> = {
  wechat: WeChatIcon,
  wecom: WeComIcon,
  feishu: FeishuIcon,
  dingtalk: DingTalkIcon,
  slack: SlackIcon,
};

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const team = teams.find((t) => t.id === id);
  const [showTeamWorkflowEditor, setShowTeamWorkflowEditor] = useState(false);

  if (!team) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <UsersRound className="h-16 w-16 text-neutral-700 mx-auto mb-4" />
          <h2 className="text-white mb-2" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            未找到该AI团队
          </h2>
          <Link to="/agents" className="text-neutral-400 hover:text-white transition-colors">
            返回员工/团队库
          </Link>
        </div>
      </div>
    );
  }

  const teamAgents: Agent[] = team.agentIds
    .map((aid) => agents.find((a) => a.id === aid))
    .filter(Boolean) as Agent[];

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/agents"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-300 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回员工/团队库
          </Link>

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-4xl shrink-0">
                {team.icon}
              </div>
              <div>
                <h1 className="text-white mb-1" style={{ fontSize: "2rem", fontWeight: 700 }}>
                  {team.name}
                </h1>
                <p className="text-neutral-400" style={{ fontSize: "1.125rem" }}>
                  {team.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-black hover:bg-neutral-200">
                <Rocket className="h-4 w-4 mr-1.5" />
                一键部署团队
              </Button>
              <Button variant="outline" className="border-white/20 text-neutral-300 hover:text-white hover:border-white/40 bg-transparent">
                自定义配置
              </Button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Team Capabilities */}
              <Card className="bg-neutral-900 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-white mb-5" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                    团队能力
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {team.capabilities.map((cap, i) => (
                      <motion.div
                        key={cap.title}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-2.5">
                          <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-neutral-300 shrink-0">
                            {capabilityIcons[cap.icon] || <Sparkles className="h-5 w-5" />}
                          </div>
                          <h3 className="text-white text-sm" style={{ fontWeight: 600 }}>
                            {cap.title}
                          </h3>
                        </div>
                        <p className="text-neutral-500 text-sm leading-relaxed">
                          {cap.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Software Integrations */}
              <Card className="bg-neutral-900 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <Plug className="h-5 w-5 text-neutral-400" />
                    <h2 className="text-white" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                      入口端兼容
                    </h2>
                  </div>
                  <p className="text-neutral-500 text-sm mb-5">
                    团队支持接入以下软件平台，通过机器人或 Webhook 方式与现有工作流无缝集成。
                  </p>
                  <div className="space-y-3">
                    {team.integrations.map((integration, i) => {
                      const IconComp = integrationIconMap[integration.icon];
                      return (
                        <motion.div
                          key={integration.name}
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-neutral-300 shrink-0">
                            {IconComp ? <IconComp className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white text-sm" style={{ fontWeight: 600 }}>
                                {integration.name}
                              </span>
                              {integration.status === "available" ? (
                                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  已支持
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-neutral-500 border-white/10 bg-white/5 text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  即将上线
                                </Badge>
                              )}
                            </div>
                            <p className="text-neutral-500 text-sm">{integration.description}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Team Workflow */}
              <Card className="bg-neutral-900 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                      团队协作流程
                    </h2>
                    <Button
                      variant="outline"
                      className="border-white/10 text-neutral-300 bg-transparent hover:bg-white/5 h-8 text-sm"
                      onClick={() => setShowTeamWorkflowEditor(true)}
                    >
                      <Pen className="h-3.5 w-3.5 mr-1.5" />
                      编辑
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {team.teamWorkflow.map((step, i) => (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0" style={{ fontWeight: 600 }}>
                            {step.step}
                          </div>
                          {i < team.teamWorkflow.length - 1 && (
                            <div className="w-px h-full bg-white/10 my-1" />
                          )}
                        </div>
                        <div className="pb-4 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-white" style={{ fontWeight: 600 }}>{step.title}</h3>
                            <Badge variant="outline" className="text-neutral-400 border-white/10 bg-white/5 text-xs">
                              {step.agentName}
                            </Badge>
                          </div>
                          <p className="text-neutral-500 text-sm">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Use Cases */}
              <Card className="bg-neutral-900 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-white mb-5" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                    适用场景
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {team.useCases.map((useCase, i) => (
                      <motion.div
                        key={useCase}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/5"
                      >
                        <Lightbulb className="h-4 w-4 text-neutral-400 mt-0.5 shrink-0" />
                        <span className="text-neutral-300 text-sm">{useCase}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Team Members */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Team Members */}
                <Card className="bg-neutral-900 border-white/10">
                  <CardContent className="p-6">
                    <h2 className="text-white mb-5" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                      团队成员
                    </h2>
                    <div className="space-y-3">
                      {teamAgents.map((agent, i) => (
                        <motion.div
                          key={agent.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Link
                            to={`/agents/${agent.id}`}
                            className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                                {agentIconsLg[agent.name] || <Bot className="h-6 w-6" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-sm" style={{ fontWeight: 600 }}>{agent.name}</div>
                                <div className="text-neutral-500 text-xs">{agent.role}</div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {agent.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-neutral-500 border-white/10 bg-white/5 text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Deploy */}
                <Card className="bg-neutral-900 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-white mb-3" style={{ fontWeight: 600 }}>快速部署</h3>
                    <p className="text-neutral-500 text-sm mb-4">
                      一键部署整个 {team.name}，包含 {teamAgents.length} 个 AI 员工和预配置的协作流程。
                    </p>
                    <Button className="w-full bg-white text-black hover:bg-neutral-200 mb-2">
                      <Rocket className="h-4 w-4 mr-1.5" />
                      一键部署团队
                    </Button>
                    <p className="text-xs text-neutral-600 text-center">部署后可在控制台自定义配置</p>
                  </CardContent>
                </Card>

                {/* Team Info */}
                <Card className="bg-neutral-900 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-white mb-4" style={{ fontWeight: 600 }}>团队信息</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">团队成员</span>
                        <span className="text-neutral-300">{teamAgents.length} 个 AI 员工</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">协作步骤</span>
                        <span className="text-neutral-300">{team.teamWorkflow.length} 个环节</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">核心能力</span>
                        <span className="text-neutral-300">{team.capabilities.length} 项</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">接入平台</span>
                        <span className="text-neutral-300">
                          {team.integrations.filter((i) => i.status === "available").length} 个已支持
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-500">适用场景</span>
                        <span className="text-neutral-300">{team.useCases.length} 个场景</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showTeamWorkflowEditor && team && (
        <TeamWorkflowEditor
          team={team}
          onClose={() => setShowTeamWorkflowEditor(false)}
        />
      )}
    </div>
  );
}