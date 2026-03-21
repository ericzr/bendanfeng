import { lazy, Suspense } from "react";
import { InlineLoader } from "../../components/common/PageLoader";

const AppDashboardView = lazy(() =>
  import("../../components/dashboard/AppDashboardView").then((m) => ({ default: m.AppDashboardView })),
);

export function AppsPage() {
  return (
    <Suspense fallback={<InlineLoader />}>
      <AppDashboardView />
    </Suspense>
  );
}
