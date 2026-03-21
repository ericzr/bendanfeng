import type { KnowledgeBase } from "./agent";

export interface Team {
  id: string;
  name: string;
  description: string;
  problem: string;
  agentIds: string[];
  icon: string;
  benefits: string[];
  useCases: string[];
  teamWorkflow: { step: number; title: string; description: string; agentName: string }[];
  stats: { label: string; value: string }[];
  capabilities: { title: string; description: string; icon: string }[];
  integrations: { name: string; icon: string; description: string; status: "available" | "coming-soon" }[];
  knowledgeBases?: KnowledgeBase[];
}

export interface ManagedTeam {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: "active" | "paused" | "draft";
  members: { name: string; role: string; status: "online" | "offline" | "busy" | "error" }[];
  tasksToday: number;
  tasksTotal: number;
  createdAt: string;
}
