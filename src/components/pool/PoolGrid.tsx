"use client";

import { useQuery } from "@tanstack/react-query";
import { Pool } from "@/lib/types";
import { PoolCard } from "./PoolCard";

export function PoolGrid() {
  const { data: pools, isLoading, error } = useQuery({
    queryKey: ["live-pools"],
    queryFn: async () => {
      const res = await fetch("/api/pools");
      if (!res.ok) throw new Error("Failed to fetch pools");
      const json = await res.json();
      return json.data as Pool[];
    },
    refetchInterval: 10000, // Refetch every 10s for the "live" feel
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-surface-2 animate-pulse border border-card-border/50" />
        ))}
      </div>
    );
  }

  if (error || !pools || pools.length === 0) {
    return (
      <div className="h-48 rounded-2xl border border-dashed border-card-border bg-card/50 flex flex-col items-center justify-center text-muted">
        <p>No pools available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pools.map((pool, i) => (
        <PoolCard key={pool.id} pool={pool} index={i} />
      ))}
    </div>
  );
}
