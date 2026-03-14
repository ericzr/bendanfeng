import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import logoImg from "@/assets/9029735ff07ec438509bff8d0513e653f98f5671.png";
import logoIconImg from "@/assets/c2e01a6770a6e47dddd52f9d4ea4d418103613e6.png";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "首页" },
    { to: "/agents", label: "员工/团队库" },
    { to: "/skills", label: "技能/应用广场" },
    { to: "/datamarket", label: "数据/知识市场" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Desktop logo - left aligned */}
          <Link
            to="/"
            className="hidden md:flex items-center gap-2"
          >
            <img
              src={logoImg}
              alt="笨蛋蜂"
              className="h-6 invert"
            />
          </Link>

          {/* Mobile: hamburger left */}
          <button
            className="md:hidden text-neutral-400"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Mobile logo - centered */}
          <Link
            to="/"
            className="md:hidden absolute left-1/2 -translate-x-1/2"
          >
            <img
              src={logoIconImg}
              alt="笨蛋蜂"
              className="h-6 invert"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm transition-colors ${
                  location.pathname === link.to
                    ? "text-white"
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-neutral-400 hover:text-white"
            >
              登录
            </Button>
            <Button
              className="bg-white text-black hover:bg-neutral-200"
              onClick={() => {
                setMobileOpen(false);
                window.location.href = "/dashboard";
              }}
            >
              控制台
            </Button>
          </div>

          {/* Mobile: placeholder to balance flex layout */}
          <div className="md:hidden w-6" />
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm ${
                  location.pathname === link.to
                    ? "text-white"
                    : "text-neutral-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <Button
                variant="ghost"
                className="w-full text-neutral-300"
              >
                登录
              </Button>
              <Button
                className="w-full bg-white text-black hover:bg-neutral-200"
                onClick={() => {
                  setMobileOpen(false);
                  window.location.href = "/dashboard";
                }}
              >
                控制台
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}