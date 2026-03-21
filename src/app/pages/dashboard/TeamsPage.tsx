import { lazy, Suspense } from "react";
import { InlineLoader } from "../../components/common/PageLoader";

const TeamManageView = lazy(() =>
  import("../../components/dashboard/TeamManageView").then((m) => ({ default: m.TeamManageView })),
);

export function TeamsPage() {
  return (
    <Suspense fallback={<InlineLoader />}>
      <TeamManageView />
    </Suspense>
  );
}
