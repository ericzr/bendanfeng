import { lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router";
import { InlineLoader } from "../../components/common/PageLoader";

const AgentDetailView = lazy(() =>
  import("../../components/dashboard/AgentDetailView").then((m) => ({ default: m.AgentDetailView })),
);

export function AgentDetailDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <Suspense fallback={<InlineLoader />}>
      <AgentDetailView agentId={id ?? ""} onBack={() => navigate("/dashboard/agents")} />
    </Suspense>
  );
}
