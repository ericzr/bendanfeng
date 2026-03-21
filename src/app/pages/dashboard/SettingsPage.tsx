import { lazy, Suspense } from "react";
import { InlineLoader } from "../../components/common/PageLoader";

const SettingsView = lazy(() =>
  import("../../components/dashboard/SettingsView").then((m) => ({ default: m.SettingsView })),
);

export function SettingsPage() {
  return (
    <Suspense fallback={<InlineLoader />}>
      <SettingsView />
    </Suspense>
  );
}
