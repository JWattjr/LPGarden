'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { TokenIcon } from '@/components/ui/TokenIcon'
import { formatPrice } from '@/lib/utils/format'
import { getPoolById } from '@/lib/data/pools'
import { useStrategyDetails, useCloseStrategy, Status } from '@/lib/web3/hooks'

import { useAgentAnalysis } from '@/lib/engine/hooks'

interface StrategyCardProps {
  strategyId: bigint
}

export function StrategyCard({ strategyId }: StrategyCardProps) {
  const { data: strategy, isLoading } = useStrategyDetails(strategyId)
  const { closeStrategy, isConfirmingWallet, isPendingTx, isConfirmed } =
    useCloseStrategy()
  const isClosing = isConfirmingWallet || isPendingTx

  // We still fetch live price to calculate health
  const { data: liveData } = useAgentAnalysis(strategy?.poolId)

  if (isLoading || !strategy) {
    return <div className="h-48 bg-surface-2 rounded-2xl animate-pulse" />
  }

  const pool = getPoolById(strategy.poolId)
  const currentPrice = liveData?.pool.currentPrice || pool?.currentPrice || 0

  // Descale bounds (we scaled by 1e6 in the smart contract)
  const rangeLow = Number(strategy.lowerBound) / 1e6
  const rangeHigh = Number(strategy.upperBound) / 1e6

  // Health calculation
  const inRange = currentPrice >= rangeLow && currentPrice <= rangeHigh
  const isActive = strategy.status === Status.Active

  // Calculate how centered it is (0 to 100%)
  const rangeWidth = rangeHigh - rangeLow
  const distanceFromMin = currentPrice - rangeLow
  let centerPercent = rangeWidth > 0 ? (distanceFromMin / rangeWidth) * 100 : 50
  centerPercent = Math.max(-10, Math.min(110, centerPercent))

  const riskMap = ['Low Risk', 'Medium Risk', 'High Risk', 'Extreme Volatility']

  return (
    <Card
      className={`p-6 relative group border-card-border overflow-hidden card-hover-glow ${!isActive ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-surface-2 border-2 border-card z-10 overflow-hidden">
              {pool ? (
                <TokenIcon src={pool.token0.icon} symbol={pool.token0.symbol} />
              ) : (
                '🪙'
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-2 border-2 border-card z-0 overflow-hidden">
              {pool ? (
                <TokenIcon src={pool.token1.icon} symbol={pool.token1.symbol} />
              ) : (
                '🪙'
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight uppercase">
              {pool
                ? `${pool.token0.symbol} / ${pool.token1.symbol}`
                : strategy.poolId}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted font-mono">
                Onchain Strategy #{strategy.id.toString()}
              </p>
              <span className="text-[10px] bg-surface-2 px-1.5 py-0.5 rounded text-muted">
                {riskMap[strategy.riskLevel]}
              </span>
            </div>
          </div>
        </div>

        <Badge variant={!isActive ? 'default' : inRange ? 'success' : 'danger'}>
          {!isActive
            ? 'Closed'
            : inRange
              ? 'Active (In Range)'
              : 'At Risk (Out of Range)'}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div>
          <p className="text-xs text-muted mb-1">Current Price</p>
          <p className="font-mono text-base">{formatPrice(currentPrice)}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Min Price</p>
          <p className="font-mono text-base text-muted">
            {formatPrice(rangeLow)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Max Price</p>
          <p className="font-mono text-base text-muted">
            {formatPrice(rangeHigh)}
          </p>
        </div>
      </div>

      {/* Health Indicator Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>Range Distribution</span>
          <span>{isActive && inRange ? 'Generating LP Fees' : '0 Fees'}</span>
        </div>
        <div className="h-4 w-full bg-surface-2 rounded-full relative overflow-hidden border border-card-border/50">
          <div
            className={`absolute top-0 bottom-0 left-0 right-0 ${isActive && inRange ? 'bg-accent/20' : 'bg-risk-high/10'}`}
          />

          {/* Current price marker */}
          {isActive && (
            <div
              className="absolute top-0 bottom-0 w-1 bg-foreground transition-all duration-500 rounded-full"
              style={{ left: `calc(${centerPercent}% - 2px)` }}
            >
              <div
                className={`absolute -top-1 -bottom-1 -left-1 -right-1 rounded-full opacity-50 ${inRange ? 'bg-accent blur-sm' : 'bg-risk-high blur-sm'}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action overlay */}
      {isActive && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <button className="text-xs font-semibold text-muted hover:text-foreground py-1 px-3 bg-surface-2 rounded-lg transition-colors border border-card-border hover:border-accent/30 disabled:opacity-50">
            Edit
          </button>
          <button
            onClick={() => closeStrategy(strategyId)}
            disabled={isClosing || isConfirmed}
            className="text-xs font-semibold text-muted hover:text-risk-high hover:bg-risk-high/10 py-1 px-3 bg-surface-2 rounded-lg transition-colors border border-card-border hover:border-risk-high/30 disabled:opacity-50 flex items-center gap-1"
          >
            {isClosing && (
              <span className="w-3 h-3 border-2 border-muted border-t-transparent rounded-full animate-spin"></span>
            )}
            {isConfirmed
              ? 'Closed!'
              : isClosing
                ? 'Closing...'
                : 'Close Strategy'}
          </button>
        </div>
      )}
    </Card>
  )
}
