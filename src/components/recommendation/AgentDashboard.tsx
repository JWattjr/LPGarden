'use client'

import { useAgentAnalysis } from '@/lib/engine/hooks'
import { RangeDetails } from '@/components/recommendation/RangeDetails'
import { RangeVisualizer } from '@/components/recommendation/RangeVisualizer'
import { RecommendationSummary } from '@/components/recommendation/RecommendationSummary'
import { SimulationPanel } from '@/components/simulation/SimulationPanel'
import { ActionCard } from '@/components/action/ActionCard'
import { CognitiveLog } from '@/components/recommendation/CognitiveLog'
import { getPoolById } from '@/lib/data/pools'

export function AgentDashboard({ poolId }: { poolId: string }) {
  const { data, isLoading, error } = useAgentAnalysis(poolId)
  const initialPool = getPoolById(poolId)

  if (error) {
    return (
      <div className="p-6 border border-risk-high/30 rounded-2xl bg-risk-high/10 text-risk-high">
        Failed to fetch agent analysis. Please try again.
      </div>
    )
  }

  // Use live data if available, otherwise fallback to registry skeleton
  const pool = data?.pool || initialPool
  const recommendation = data?.recommendation
  const simulation = data?.simulation
  const action = data?.action

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Main Content Area */}
      <div className="lg:col-span-3 space-y-6">
        <RecommendationSummary confidence={recommendation?.confidence} />
        <RangeVisualizer recommendation={recommendation} />
        {pool && <RangeDetails pool={pool} recommendation={recommendation} />}
        <SimulationPanel simulation={simulation} />
      </div>

      {/* Sidebar / Action Area */}
      <div className="lg:col-span-2 space-y-6 relative">
        <ActionCard
          pool={pool}
          recommendation={recommendation}
          actionRec={action}
        />
        <CognitiveLog cognitive={action?.cognitive} isLoading={isLoading} />
      </div>
    </div>
  )
}
