import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TokenIcon } from "@/components/ui/TokenIcon";
import { Pool } from "@/lib/types";
import { formatUSD, formatAPR, formatPercent, formatPrice } from "@/lib/utils/format";

interface PoolCardProps {
  pool: Pool;
  index: number;
}

export function PoolCard({ pool, index }: PoolCardProps) {
  const isPositive = pool.price24hChange >= 0;
  
  // Map volatility class to badge variant
  const volConfig = {
    low: { variant: "success" as const, label: "Low Vol" },
    medium: { variant: "warning" as const, label: "Med Vol" },
    high: { variant: "danger" as const, label: "High Vol" },
    extreme: { variant: "danger" as const, label: "Extreme Vol" },
  };

  const vol = volConfig[pool.volatilityClass];

  return (
    <Link href={`/planner/${pool.id}`} className="block outline-none">
      <Card className={`p-5 h-full flex flex-col justify-between animate-fade-in-up-delay-${index + 1} card-hover-glow`}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-surface-2 border-2 border-card z-10 overflow-hidden">
                <TokenIcon src={pool.token0.icon} symbol={pool.token0.symbol} />
              </div>
              <div className="w-8 h-8 rounded-full bg-surface-2 border-2 border-card z-0 overflow-hidden">
                <TokenIcon src={pool.token1.icon} symbol={pool.token1.symbol} />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {pool.token0.symbol} / {pool.token1.symbol}
              </h3>
              <p className="text-xs text-muted font-mono">{formatPercent(pool.feeTier, false)} tier</p>
            </div>
          </div>
          <Badge variant={vol.variant}>{vol.label}</Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-muted mb-1">Fee APR</p>
            <p className="font-mono text-lg text-accent font-semibold">{formatAPR(pool.feeApr)}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">24h Vol</p>
            <p className="font-mono text-lg">{formatUSD(pool.volume24h)}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">TVL</p>
            <p className="font-mono text-lg">{formatUSD(pool.tvl)}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Price</p>
            <div className="flex items-center gap-2">
              <p className="font-mono text-lg">{formatPrice(pool.currentPrice)}</p>
              <span className={`text-xs ${isPositive ? "text-risk-low" : "text-risk-high"}`}>
                {isPositive ? "↗" : "↘"} {formatPercent(Math.abs(pool.price24hChange), false)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="pt-4 border-t border-card-border/50 flex items-center justify-between text-sm group-hover:text-accent transition-colors text-muted">
          <span>Analyze range</span>
          <span>→</span>
        </div>
      </Card>
    </Link>
  );
}
