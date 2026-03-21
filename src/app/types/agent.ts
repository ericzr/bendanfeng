export interface KnowledgeBase {
  id: string;
  name: string;
  description: string;
  type: "document" | "qa" | "web" | "database" | "api" | "memory";
  docCount: number;
  size: string;
  lastUpdated: string;
  status: "active" | "indexing" | "inactive";
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tags: string[];
  description: string;
  category: string;
  workflow: { step: number; title: string; description: string }[];
  inputExample: string;
  outputExample: string;
  knowledgeBases?: KnowledgeBase[];
}

export interface DeployedAgent {
  id: string;
  agentId: string;
  name: string;
  role: string;
  status: "online" | "offline" | "busy" | "error";
  deployedAt: string;
  tasksCompleted: number;
  tasksRunning: number;
  successRate: number;
  avgResponseTime: string;
  lastActive: string;
  config: {
    model: string;
    temperature: number;
    maxTokens: number;
    autoRetry: boolean;
  };
}
