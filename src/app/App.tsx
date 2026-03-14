import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { Navbar } from "./components/Navbar";
import { lazy, Suspense } from "react";

// ── Lazy-loaded pages (code splitting) ──
const LandingPage = lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })));
const AgentStorePage = lazy(() => import("./pages/AgentStorePage").then(m => ({ default: m.AgentStorePage })));
const AgentDetailPage = lazy(() => import("./pages/AgentDetailPage").then(m => ({ default: m.AgentDetailPage })));
const TeamDetailPage = lazy(() => import("./pages/TeamDetailPage").then(m => ({ default: m.TeamDetailPage })));
const DashboardPage = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const SkillsMarketPage = lazy(() => import("./pages/SkillsMarketPage").then(m => ({ default: m.SkillsMarketPage })));
const DataMarketPage = lazy(() => import("./pages/DataMarketPage").then(m => ({ default: m.DataMarketPage })));

function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-neutral-500 text-sm">加载中...</span>
      </div>
    </div>
  );
}

function RootLayout() {
  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="agents" element={<AgentStorePage />} />
          <Route path="agents/:id" element={<AgentDetailPage />} />
          <Route path="teams/:id" element={<TeamDetailPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="skills" element={<SkillsMarketPage />} />
          <Route path="datamarket" element={<DataMarketPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}