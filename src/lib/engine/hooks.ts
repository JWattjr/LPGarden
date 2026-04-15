"use client";

import { useQuery } from "@tanstack/react-query";
import { Pool, LPRecommendation, ScenarioSimulation, ActionRecommendation } from "@/lib/types";

export interface AgentResponse {
  pool: Pool;
  recommendation: LPRecommendation;
  simulation: ScenarioSimulation;
  action: ActionRecommendation;
}

/**
 * Shared hook to fetch AI agent analysis and simulations for a pool.
 * Centralizing this ensures all components (Dashboard, LivePrice, StrategyCard)
 * use the same query configuration and fetcher.
 */
import { executeLiquidityPlan } from "@/lib/agent/onchain-os";

export function useAgentAnalysis(poolId: string | undefined) {
  return useQuery({
    queryKey: ["agent-analysis", poolId],
    queryFn: async () => {
      if (!poolId) throw new Error("No pool ID provided");
      
      const res = await fetch("/api/agent/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poolId })
      });
      
      if (!res.ok) throw new Error("Agent failed to analyze");
      const json = await res.json();
      const analysis = json.data as AgentResponse;

      // 🛑 NEW: Perform REAL Agentic Signature Bridge
      const auth = await executeLiquidityPlan(analysis.pool, analysis.recommendation);
      
      return {
        ...analysis,
        authorization: auth // Dynamic signature from the local CLI
      };
    },
    enabled: !!poolId,
    staleTime: 60000,
  });
}
