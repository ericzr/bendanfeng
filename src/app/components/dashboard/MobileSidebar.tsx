import { useLocation, useNavigate } from "react-router";
import { sidebarItems } from "./sidebar-config";

interface MobileSidebarProps {
  onClose: () => void;
}

export function MobileSidebar({ onClose }: MobileSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  const handleNavClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="md:hidden fixed inset-0 z-20 bg-black/50" onClick={onClose}>
      <div
        className="w-56 h-full bg-neutral-950 border-r border-white/10 pt-28"
        onClick={(e) => e.stopPropagation()}
      >
        <nav className="px-3 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = activePath.startsWith(item.path);
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.special
                    ? isActive
                      ? "bg-white text-black"
                      : "bg-white/10 text-white hover:bg-white/15"
                    : isActive
                      ? "bg-white/10 text-white"
                      : "text-neutral-500 hover:text-neutral-300 hover:bg-white/5"
                }`}
                style={item.special ? { fontWeight: 600 } : undefined}
              >
                {item.icon}
                {item.label}
                {item.special && (
                  <span className={`ml-auto w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-green-400"} animate-pulse`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
