import { Suspense } from "react";
import { Outlet } from "react-router";
import { Navbar } from "../components/Navbar";
import { PageLoader } from "../components/common/PageLoader";

export function RootLayout() {
  return (
    <div className="dark min-h-screen bg-black">
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </div>
  );
}
