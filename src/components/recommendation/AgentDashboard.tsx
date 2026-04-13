"use client";

import { useQuery } from "@tanstack/react-query";
import { RangeDetails } from "@/components/recommendation/RangeDetails";
import { RangeVisualizer } from "@/components/recommendation/RangeVisualizer";
import { RecommendationSummary } from "@/components/recommendation/RecommendationSummary";
import { SimulationPanel } from "@/components/simulation/SimulationPanel";
import { ActionCard } from "@/components/action/ActionCard";
import { LPRecommendation, Pool, ScenarioSimulation, ActionRecommendation } from "@/lib/types";

interface AgentResponse {
  pool: Pool;
  recommendation: LPRecommendation;
  simulation: ScenarioSimulation;
  action: ActionRecommendation;
}

export function AgentDashboard({ poolId }: { poolId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["agent-analysis", poolId],
    queryFn: async () => {
      const res = await fetch("/api/agent/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ poolId })
      });
      if (!res.ok) throw new Error("Agent failed to analyze");
      const json = await res.json();
      return json.data as AgentResponse;
    },
    // The agent analysis shouldn't refresh constantly, cache it.
    staleTime: 60000,
  });

  if (isLoading) {
    return (
      <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 w-full animate-pulse">
        <div className="lg:col-span-3 space-y-6 opacity-30">
          <div className="h-[120px] bg-surface-2 rounded-2xl border border-card-border/50" />
          <div className="h-[280px] bg-surface-2 rounded-2xl border border-card-border/50" />
          <div className="h-[180px] bg-surface-2 rounded-2xl border border-card-border/50" />
        </div>
        <div className="lg:col-span-2 space-y-6 opacity-30">
          <div className="h-[460px] bg-surface-2 rounded-2xl border border-card-border/50" />
        </div>
        
        {/* Agent Loading Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-32 pointer-events-none">
          <div className="flex flex-col items-center justify-center py-8 px-10 rounded-2xl bg-card/90 border border-accent/20 shadow-[0_0_50px_rgba(52,211,153,0.1)] backdrop-blur-xl max-w-sm w-full mx-auto">
             <div className="w-12 h-12 text-3xl animate-pulse-glow flex items-center justify-center bg-accent/20 rounded-full mb-4">
               🌿
             </div>
             <p className="font-semibold text-accent tracking-wide mb-1 animate-pulse">Agent Processing</p>
             <p className="text-sm text-foreground/60 text-center">Analyzing live liquidity and running scenario simulations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 border border-risk-high/30 rounded-2xl bg-risk-high/10 text-risk-high">
        Failed to communicate with OKX Agent OS. Please try again.
      </div>
    );
  }

  const { pool, recommendation, simulation, action } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6">
        <RecommendationSummary confidence={recommendation.confidence} />
        <RangeVisualizer recommendation={recommendation} />
        <RangeDetails pool={pool} recommendation={recommendation} />
        <SimulationPanel simulation={simulation} />
      </div>
      
      {/* Sidebar / Action Area */}
      <div className="lg:col-span-2 space-y-6 relative">
        <ActionCard pool={pool} recommendation={recommendation} actionRec={action} />
      </div>
    </div>
  );
}
