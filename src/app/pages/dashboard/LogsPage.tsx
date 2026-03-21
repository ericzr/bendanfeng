import { lazy, Suspense } from "react";
import { InlineLoader } from "../../components/common/PageLoader";

const ExecutionLogsView = lazy(() =>
  import("../../components/dashboard/ExecutionLogsView").then((m) => ({ default: m.ExecutionLogsView })),
);

export function LogsPage() {
  return (
    <Suspense fallback={<InlineLoader />}>
      <ExecutionLogsView />
    </Suspense>
  );
}
