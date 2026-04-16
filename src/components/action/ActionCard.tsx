'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { Card } from '@/components/ui/Card'
import { ActionBadge } from './ActionBadge'
import { ActionRecommendation, LPRecommendation, Pool } from '@/lib/types'
import { useAgentAnalysis } from '@/lib/engine/hooks'
import { useCreateStrategy, RiskLevel } from '@/lib/web3/hooks'
import { usePlanner } from '@/lib/context/PlannerContext'

interface ActionCardProps {
  pool: Pool | null
  recommendation?: LPRecommendation
  actionRec?: ActionRecommendation
}

export function ActionCard({
  pool,
  recommendation,
  actionRec,
}: ActionCardProps) {
  const router = useRouter()
  const { address } = useAccount()
  const { data } = useAgentAnalysis(pool?.id)
  const { savePosition } = usePlanner()
  const [depositAmount, setDepositAmount] = useState<number>(1000)

  const proof = (data as any)?.authorization?.proof
  const isAuthorized = (data as any)?.authorization?.authorized

  const {
    createStrategy,
    isConfirmingWallet,
    isPendingTx,
    isConfirmed,
    error,
    hash,
  } = useCreateStrategy()

  if (!pool || !recommendation || !actionRec) {
    return (
      <Card className="sticky top-24 p-6 border-card-border bg-surface-2 animate-pulse min-h-[400px]">
        <div className="h-6 w-32 bg-card rounded mb-4" />
        <div className="h-10 w-24 bg-card rounded mb-6" />
        <div className="h-20 w-full bg-card rounded mb-8" />
        <div className="h-12 w-full bg-card rounded" />
      </Card>
    )
  }

  const isDeploy = actionRec.action === 'deploy'

  const handleDeploy = () => {
    // Map string volatility to RiskLevel enum
    const riskMap: Record<string, RiskLevel> = {
      low: RiskLevel.Low,
      medium: RiskLevel.Medium,
      high: RiskLevel.High,
      extreme: RiskLevel.Extreme,
    }

    // Trigger onchain write
    createStrategy(
      pool.id,
      recommendation.rangeLow,
      recommendation.rangeHigh,
      riskMap[pool.volatilityClass] ?? RiskLevel.Medium,
      actionRec.action,
    )

    // Provide fallback to local storage (in case testnet breaks during demo)
    savePosition({
      poolId: pool.id,
      rangeLow: recommendation.rangeLow,
      rangeHigh: recommendation.rangeHigh,
      depositAmount: depositAmount,
      entryPrice: pool.currentPrice,
      currentPrice: pool.currentPrice,
    })
  }

  if (isConfirmed) {
    // Show success state and redirect quickly
    setTimeout(() => {
      router.push('/monitor')
    }, 4000) // 4 seconds to let them see the explorer link
  }

  return (
    <Card className="sticky top-24 p-6 border-accent/20 bg-accent/5 overflow-hidden group">
      {/* Background glow when recommended to deploy */}
      {isDeploy && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/4 pointer-events-none transition-opacity group-hover:opacity-100 opacity-60" />
      )}

      <div className="relative z-10">
        <h3 className="text-xl font-semibold mb-4">Recommended Action</h3>

        <div className="mb-6 flex">
          <ActionBadge
            action={actionRec.action}
            className="text-base py-1.5 px-4"
          />
        </div>

        <p className="text-sm text-foreground/80 leading-relaxed mb-8">
          Deploy liquidity based on the results of the thinking process.
        </p>

        {/* Transaction Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-risk-high/10 border border-risk-high/30 text-risk-high text-xs">
            Transaction failed or rejected.
          </div>
        )}

        {/* Agentic Wallet Verification (Hackathon Mandatory Identity) */}
        <div
          className={`mb-6 p-3 rounded-xl border ${isAuthorized ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-risk-medium/30 bg-risk-medium/5'} flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-lg ${isAuthorized ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-risk-medium/10 border-risk-medium/20'} flex items-center justify-center border`}
            >
              <span
                className={`text-xs font-bold ${isAuthorized ? 'text-indigo-400' : 'text-risk-medium'}`}
              >
                AI
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-indigo-300/80 uppercase tracking-wider">
                Strategy Authorized By
              </span>
              <span className="text-xs font-mono text-slate-300">
                0x68471...76d3
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${isAuthorized ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-risk-medium/10 border-risk-medium/20 text-risk-medium'}`}
            >
              {isAuthorized ? 'TEE SIGNED' : 'WAITING...'}
            </span>
            <span className="text-[8px] text-slate-500 mt-1 font-mono">
              Proof: {proof ? `${proof.substring(0, 8)}...` : 'pending'}
            </span>
          </div>
        </div>

        {/* Transaction Success Alert */}
        {isConfirmed && hash && (
          <div className="mb-4 p-3 rounded-lg bg-risk-low/10 border border-risk-low/30 text-risk-low text-xs flex flex-col gap-1">
            <span>Transaction confirmed!</span>
            <a
              href={`https://web3.okx.com/explorer/x-layer-testnet/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              View on X Layer Explorer ↗
            </a>
          </div>
        )}

        <div className="space-y-4">
          {isDeploy ? (
            <>
              <div className="p-4 rounded-xl border border-card-border bg-surface-1 flex items-center justify-between mb-4">
                <span className="text-sm text-muted">Deposit Amount</span>
                <div className="flex items-center gap-1.5 focus-within:text-accent transition-colors">
                  <span className="font-mono text-muted">$</span>
                  <input
                    type="number"
                    value={depositAmount || ''}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-24 bg-transparent text-right font-mono text-lg font-semibold outline-none text-foreground appearance-none"
                    min="1"
                  />
                </div>
              </div>

              {!address ? (
                <ConnectKitButton.Custom>
                  {({ show }) => (
                    <button
                      onClick={show}
                      className="w-full rounded-xl border border-accent/50 bg-surface-1 px-6 py-4 text-sm font-semibold text-accent transition-all hover:bg-accent/10"
                    >
                      Connect Wallet to Commit
                    </button>
                  )}
                </ConnectKitButton.Custom>
              ) : (
                <button
                  onClick={handleDeploy}
                  disabled={
                    isConfirmingWallet ||
                    isPendingTx ||
                    isConfirmed ||
                    depositAmount <= 0
                  }
                  className={`w-full rounded-xl px-6 py-4 text-sm font-semibold transition-all flex justify-center items-center gap-2
                    ${isConfirmed ? 'bg-card border border-accent/50 text-accent' : 'bg-accent text-background hover:bg-accent-dim shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)]'} 
                    disabled:opacity-70 disabled:pointer-events-none`}
                >
                  {isConfirmingWallet && (
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  )}
                  {isPendingTx && (
                    <span className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  )}

                  {isConfirmingWallet
                    ? 'Please Sign in Wallet...'
                    : isPendingTx
                      ? 'Pending on X Layer...'
                      : isConfirmed
                        ? 'Confirmed! Redirecting...'
                        : 'Commit Strategy Onchain'}
                </button>
              )}
            </>
          ) : (
            <button
              className="w-full rounded-xl border border-card-border bg-surface-2 px-6 py-4 text-sm font-semibold text-foreground transition-all hover:bg-card-hover"
              disabled
            >
              Deployment Not Advised
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
