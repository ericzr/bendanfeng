import { DataMarketView } from "../components/dashboard/DataMarketView";

export function DataMarketPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-16">
      <div className="flex h-[calc(100vh-4rem)]">
        <DataMarketView />
      </div>
    </div>
  );
}
