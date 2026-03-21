import { lazy, Suspense } from "react";
import { InlineLoader } from "../../components/common/PageLoader";

const GlobalBrainView = lazy(() =>
  import("../../components/dashboard/GlobalBrainView").then((m) => ({ default: m.GlobalBrainView })),
);

export function BrainPage() {
  return (
    <Suspense fallback={<InlineLoader />}>
      <GlobalBrainView />
    </Suspense>
  );
}
