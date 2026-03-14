import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Rocket,
  Search,
  Pen,
  Target,
  BarChart3,
  Package,
  Sparkles,
  Users,
  Send,
  Pencil,
} from "lucide-react";
import { agents } from "../data/mock-data";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { WorkflowEditor } from "../components/WorkflowEditor";

const agentIcons: Record<string, React.ReactNode> = {
  "小研": <Search className="h-8 w-8" />,
  "小文": <Pen className="h-8 w-8" />,
  "小拓": <Target className="h-8 w-8" />,
  "小数": <BarChart3 className="h-8 w-8" />,
  "小产": <Package className="h-8 w-8" />,
  "小媒": <Sparkles className="h-8 w-8" />,
  "小客": <Users className="h-8 w-8" />,
  "小搜": <Search className="h-8 w-8" />,
};

export function AgentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const agent = agents.find((a) => a.id === id);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "agent"; content: string }[]
  >([]);
  const [showWorkflowEditor, setShowWorkflowEditor] = useState(false);

  if (!agent) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-16 w-16 text-neutral-700 mx-auto mb-4" />
          <h2 className="text-white mb-2" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            未找到该AI员工
          </h2>
          <Link to="/agents" className="text-neutral-400 hover:text-white transition-colors">
            返回员工/团队库
          </Link>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", content: chatInput },
      {
        role: "agent",
        content: `收到您的任务："${chatInput}"。我将按照以下步骤执行：\n\n${agent.workflow
          .map((w) => `${w.step}. ${w.title}`)
          .join("\n")}\n\n正在启动任务，预计 3-5 分钟完成...`,
      },
    ]);
    setChatInput("");
  };

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

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Agent Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-neutral-900 border-white/10">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4">
                      {agentIcons[agent.name] || <Bot className="h-8 w-8" />}
                    </div>
                    <h1 className="text-white mb-1" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                      {agent.name}
                    </h1>
                    <p className="text-neutral-400 mb-4">{agent.role}</p>
                    <p className="text-neutral-500 text-sm leading-relaxed mb-4">
                      {agent.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {agent.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-neutral-300 border-white/10 bg-white/5">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full bg-white text-black hover:bg-neutral-200">
                      <Rocket className="h-4 w-4" />
                      立即部署
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Workflow */}
              <Card className="bg-neutral-900 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                      工作流程
                    </h2>
                    <Button
                      variant="outline"
                      className="border-white/10 text-neutral-300 bg-transparent hover:bg-white/5 h-8 text-sm"
                      onClick={() => setShowWorkflowEditor(true)}
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      编辑
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {agent.workflow.map((step, i) => (
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
                          {i < agent.workflow.length - 1 && (
                            <div className="w-px h-full bg-white/10 my-1" />
                          )}
                        </div>
                        <div className="pb-4">
                          <h3 className="text-white" style={{ fontWeight: 600 }}>{step.title}</h3>
                          <p className="text-neutral-500 text-sm">{step.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Input/Output Examples */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-neutral-900 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-white mb-4" style={{ fontWeight: 600 }}>输入示例</h3>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <p className="text-neutral-300 text-sm font-mono">{agent.inputExample}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-neutral-900 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-white mb-4" style={{ fontWeight: 600 }}>输出示例</h3>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10 max-h-40 overflow-y-auto">
                      <pre className="text-neutral-300 text-sm whitespace-pre-wrap font-mono">
                        {agent.outputExample}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chat Simulation */}
              <Card className="bg-neutral-900 border-white/10">
                <CardContent className="p-6">
                  <h2 className="text-white mb-4" style={{ fontSize: "1.25rem", fontWeight: 600 }}>
                    模拟对话
                  </h2>
                  <div className="h-64 overflow-y-auto mb-4 space-y-3 p-3 rounded-lg bg-black/40">
                    {chatMessages.length === 0 && (
                      <div className="text-center text-neutral-600 pt-20">
                        输入任务指令，与{agent.name}对话
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2 rounded-xl text-sm whitespace-pre-wrap ${
                            msg.role === "user"
                              ? "bg-white/10 text-neutral-200 border border-white/10"
                              : "bg-white/5 text-neutral-300 border border-white/10"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder={`给${agent.name}下达任务...`}
                      className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus-visible:border-white/30 focus-visible:ring-white/20"
                    />
                    <Button
                      onClick={handleSendMessage}
                      className="bg-white text-black hover:bg-neutral-200"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showWorkflowEditor && (
        <WorkflowEditor
          agentName={agent.name}
          initialWorkflow={agent.workflow}
          onClose={() => setShowWorkflowEditor(false)}
        />
      )}
    </div>
  );
}