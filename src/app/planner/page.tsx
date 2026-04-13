import PageShell from "@/components/layout/PageShell";
import { PoolGrid } from "@/components/pool/PoolGrid";

export default function PlannerPage() {
  return (
    <PageShell>
      <div className="flex flex-col gap-8 flex-1 max-w-4xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold tracking-tight mb-3">Select Pool</h1>
            <p className="text-muted text-lg">Choose a token pair to analyze and deploy liquidity.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 shrink-0 mx-auto sm:mx-0">
            <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">Live Prices</span>
          </div>
        </div>
        
        <PoolGrid />
      </div>
    </PageShell>
  );
}
