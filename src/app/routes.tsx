import { lazy } from "react";
import { Route } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { Navigate } from "react-router";

import { BrainPage } from "./pages/dashboard/BrainPage";
import { AgentsPage } from "./pages/dashboard/AgentsPage";
import { AgentDetailDashboardPage } from "./pages/dashboard/AgentDetailDashboardPage";
import { TeamsPage } from "./pages/dashboard/TeamsPage";
import { TasksPage } from "./pages/dashboard/TasksPage";
import { AppsPage } from "./pages/dashboard/AppsPage";
import { KnowledgePage } from "./pages/dashboard/KnowledgePage";
import { LogsPage } from "./pages/dashboard/LogsPage";
import { SettingsPage } from "./pages/dashboard/SettingsPage";

const LandingPage = lazy(() =>
  import("./pages/LandingPage").then((m) => ({ default: m.LandingPage })),
);
const AgentStorePage = lazy(() =>
  import("./pages/AgentStorePage").then((m) => ({ default: m.AgentStorePage })),
);
const AgentDetailPage = lazy(() =>
  import("./pages/AgentDetailPage").then((m) => ({ default: m.AgentDetailPage })),
);
const TeamDetailPage = lazy(() =>
  import("./pages/TeamDetailPage").then((m) => ({ default: m.TeamDetailPage })),
);
const SkillsMarketPage = lazy(() =>
  import("./pages/SkillsMarketPage").then((m) => ({ default: m.SkillsMarketPage })),
);
const DataMarketPage = lazy(() =>
  import("./pages/DataMarketPage").then((m) => ({ default: m.DataMarketPage })),
);

export function AppRoutes() {
  return (
    <Route element={<RootLayout />}>
      {/* Top-level pages */}
      <Route index element={<LandingPage />} />
      <Route path="agents" element={<AgentStorePage />} />
      <Route path="agents/:id" element={<AgentDetailPage />} />
      <Route path="teams/:id" element={<TeamDetailPage />} />
      <Route path="skills" element={<SkillsMarketPage />} />
      <Route path="datamarket" element={<DataMarketPage />} />

      {/* Dashboard with nested routes */}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="brain" replace />} />
        <Route path="brain" element={<BrainPage />} />
        <Route path="agents" element={<AgentsPage />} />
        <Route path="agents/:id" element={<AgentDetailDashboardPage />} />
        <Route path="teams" element={<TeamsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="apps" element={<AppsPage />} />
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Route>
  );
}
