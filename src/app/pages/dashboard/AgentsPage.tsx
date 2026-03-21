import { lazy, Suspense } from "react";
import { useNavigate } from "react-router";
import { InlineLoader } from "../../components/common/PageLoader";

const AgentManageView = lazy(() =>
  import("../../components/dashboard/AgentManageView").then((m) => ({ default: m.AgentManageView })),
);

export function AgentsPage() {
  const navigate = useNavigate();

  return (
    <Suspense fallback={<InlineLoader />}>
      <AgentManageView onSelectAgent={(id) => navigate(`/dashboard/agents/${id}`)} />
    </Suspense>
  );
}
