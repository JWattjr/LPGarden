"use client";

import PageShell from "@/components/layout/PageShell";
import Link from "next/link";
import { useUserStrategies } from "@/lib/web3/hooks";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { StrategyCard } from "@/components/monitor/StrategyCard";

export default function MonitorPage() {
  const { address } = useAccount();
  const { data: strategyIds, isLoading } = useUserStrategies();

  return (
    <PageShell>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto flex-1 w-full mt-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Monitor Positions</h1>
          <p className="text-muted text-lg">Track the health and performance of your onchain strategy commitments.</p>
        </div>
        
        <div className="flex flex-col gap-6">
          {!address ? (
            <div className="h-48 rounded-2xl border border-dashed border-card-border bg-card/50 flex flex-col items-center justify-center text-muted">
              <span className="text-2xl mb-4 text-accent/50">🔌</span>
              <p className="mb-4 text-center max-w-sm">Connect your wallet to view your active LP strategies on X Layer.</p>
              <ConnectKitButton />
            </div>
          ) : isLoading ? (
             <div className="h-48 rounded-2xl flex flex-col items-center justify-center text-muted">
               <span className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
               <p>Fetching onchain strategies...</p>
             </div>
          ) : strategyIds && strategyIds.length > 0 ? (
            /* We reverse the array to show newest first! */
            [...strategyIds].reverse().map((idStr) => (
              <StrategyCard key={idStr.toString()} strategyId={idStr} />
            ))
          ) : (
            <div className="h-48 rounded-2xl border border-dashed border-card-border bg-card/50 flex flex-col items-center justify-center text-muted">
              <span className="text-2xl mb-2">🌿</span>
              <p className="mb-4">No active strategies found onchain.</p>
              <Link href="/planner" className="px-4 py-2 bg-accent text-background font-medium rounded-lg hover:bg-accent-dim transition-colors">
                Explore Pools
              </Link>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
