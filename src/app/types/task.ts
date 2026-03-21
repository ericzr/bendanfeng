export type TaskStatus = "running" | "done" | "pending";
export type LogLevel = "info" | "success" | "warning" | "error";

export interface TaskLog {
  time: string;
  message: string;
  status: TaskStatus;
}

export interface DashboardTask {
  id: string;
  name: string;
  agent: string;
  status: TaskStatus;
  progress: number;
  startTime: string;
  logs: TaskLog[];
}

export interface LogEntry {
  id: string;
  timestamp: string;
  agent: string;
  taskName: string;
  level: LogLevel;
  message: string;
  duration?: string;
}
