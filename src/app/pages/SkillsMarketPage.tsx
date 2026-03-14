import { SkillsMarketView } from "../components/dashboard/SkillsMarketView";

export function SkillsMarketPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        <SkillsMarketView />
      </div>
    </div>
  );
}
