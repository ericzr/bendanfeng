import { useState, Suspense } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "../components/dashboard/Sidebar";
import { MobileSidebar } from "../components/dashboard/MobileSidebar";
import { InlineLoader } from "../components/common/PageLoader";
import { useSidebarResize } from "../hooks/useSidebarResize";
import { Menu, X } from "lucide-react";
import { sidebarItems, type SidebarItemKey } from "../components/dashboard/sidebar-config";

export function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const resize = useSidebarResize();

  return (
    <div className="bg-black text-white min-h-screen pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop sidebar */}
        <Sidebar resize={resize} />

        {/* Mobile top bar */}
        <MobileTopBar
          mobileMenuOpen={mobileMenuOpen}
          onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <MobileSidebar onClose={() => setMobileMenuOpen(false)} />
        )}

        {/* Main content */}
        <main className="flex-1 flex overflow-hidden md:mt-0 mt-10">
          <Suspense fallback={<InlineLoader />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function MobileTopBar({
  mobileMenuOpen,
  onToggle,
}: {
  mobileMenuOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="md:hidden fixed top-16 left-0 right-0 z-30 bg-neutral-950 border-b border-white/10 px-4 py-2 flex items-center justify-between">
      <button onClick={onToggle} className="text-neutral-400 p-1">
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      <span className="text-white text-sm" style={{ fontWeight: 600 }}>
        控制台
      </span>
      <div className="w-7" />
    </div>
  );
}
