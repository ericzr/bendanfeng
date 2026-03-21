import type { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="bg-black text-white min-h-screen pt-16">
      <div className="flex h-[calc(100vh-4rem)]">{children}</div>
    </div>
  );
}
