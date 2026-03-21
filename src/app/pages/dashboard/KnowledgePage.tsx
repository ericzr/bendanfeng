import { lazy, Suspense } from "react";
import { InlineLoader } from "../../components/common/PageLoader";

const KnowledgeBaseView = lazy(() =>
  import("../../components/dashboard/KnowledgeBaseView").then((m) => ({ default: m.KnowledgeBaseView })),
);

export function KnowledgePage() {
  return (
    <Suspense fallback={<InlineLoader />}>
      <KnowledgeBaseView />
    </Suspense>
  );
}
