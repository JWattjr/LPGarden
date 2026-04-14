"use client";

import { useAgentAnalysis } from "@/lib/engine/hooks";
import { formatPrice } from "@/lib/utils/format";

export function LivePrice({ poolId }: { poolId: string }) {
  const { data } = useAgentAnalysis(poolId);

  if (!data) {
    return <div className="h-8 w-24 bg-surface-2 animate-pulse rounded-lg" />;
  }

  return (
    <span className="text-2xl font-mono text-muted bg-surface-1 px-3 py-1 rounded-lg border border-card-border/50 animate-shimmer min-w-[120px] text-center">
      {formatPrice(data.pool.currentPrice)}
    </span>
  );
}
