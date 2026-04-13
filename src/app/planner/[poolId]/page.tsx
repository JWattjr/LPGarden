import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { getPoolById } from "@/lib/data/pools";
import { AgentDashboard } from "@/components/recommendation/AgentDashboard";
import { LivePrice } from "@/components/pool/LivePrice";
import { TokenIcon } from "@/components/ui/TokenIcon";

export default async function PoolPlannerPage({ params }: { params: Promise<{ poolId: string }> }) {
  const { poolId } = await params;
  const pool = getPoolById(poolId);
  
  if (!pool) {
    notFound();
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/planner" className="p-2 rounded-lg bg-surface-2 hover:bg-card-hover border border-card-border transition-colors group">
            <span className="text-muted group-hover:text-foreground">←</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-surface-2 border-2 border-background z-10 overflow-hidden">
                <TokenIcon src={pool.token0.icon} symbol={pool.token0.symbol} />
              </div>
              <div className="w-8 h-8 rounded-full bg-surface-2 border-2 border-background z-0 overflow-hidden">
                <TokenIcon src={pool.token1.icon} symbol={pool.token1.symbol} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">
                {pool.token0.symbol} / {pool.token1.symbol}
              </h1>
              <LivePrice poolId={pool.id} />
            </div>
          </div>
        </div>
        
        {/* Render the Agent Dashboard component which will fetch from our backend */}
        <AgentDashboard poolId={pool.id} />
      </div>
    </PageShell>
  );
}
