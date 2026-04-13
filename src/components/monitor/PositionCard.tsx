import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TokenIcon } from "@/components/ui/TokenIcon";
import { LocalPosition } from "@/lib/types";
import { formatUSD, formatPrice } from "@/lib/utils/format";
import { getPoolById } from "@/lib/data/pools";

interface PositionCardProps {
  position: LocalPosition;
  onDelete: (id: string) => void;
}

export function PositionCard({ position, onDelete }: PositionCardProps) {
  const pool = getPoolById(position.poolId);
  if (!pool) return null;

  // Health calculation based on current price vs. committed range
  const inRange = pool.currentPrice >= position.rangeLow && pool.currentPrice <= position.rangeHigh;
  const isHealthy = inRange; // Simplify for MVP
  
  // Calculate how centered it is (0 to 100%)
  const rangeWidth = position.rangeHigh - position.rangeLow;
  const distanceFromMin = pool.currentPrice - position.rangeLow;
  let centerPercent = (distanceFromMin / rangeWidth) * 100;
  // Clamp for display
  centerPercent = Math.max(-10, Math.min(110, centerPercent));

  return (
    <Card className="p-6 relative group border-card-border overflow-hidden">
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
            <p className="text-xs text-muted font-mono">Local Fallback</p>
          </div>
        </div>
        
        <Badge variant={isHealthy ? "success" : "danger"}>
          {isHealthy ? "Healthy (In Range)" : "At Risk (Out of Range)"}
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div>
          <p className="text-xs text-muted mb-1">Deposit</p>
          <p className="font-mono text-base font-semibold">{formatUSD(position.depositAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Current Price</p>
          <p className="font-mono text-base">{formatPrice(pool.currentPrice)}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Min Price</p>
          <p className="font-mono text-base text-muted">{formatPrice(position.rangeLow)}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Max Price</p>
          <p className="font-mono text-base text-muted">{formatPrice(position.rangeHigh)}</p>
        </div>
      </div>

      {/* Health Indicator Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>Range Distribution</span>
          <span>{inRange ? "Generating Fees" : "0 Fees"}</span>
        </div>
        <div className="h-4 w-full bg-surface-2 rounded-full relative overflow-hidden border border-card-border/50">
          <div className={`absolute top-0 bottom-0 left-0 right-0 ${inRange ? "bg-accent/20" : "bg-risk-high/10"}`} />
          
          {/* Current price marker */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-foreground transition-all duration-500 rounded-full"
            style={{ left: `calc(${centerPercent}% - 2px)` }}
          >
            <div className={`absolute -top-1 -bottom-1 -left-1 -right-1 rounded-full opacity-50 ${inRange ? "bg-accent blur-sm" : "bg-risk-high blur-sm"}`} />
          </div>
        </div>
      </div>

      {/* Action overlay */}
      <button 
        onClick={() => onDelete(position.id)}
        className="absolute top-4 right-4 text-muted hover:text-risk-high opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-surface-2 rounded-lg"
      >
        Close
      </button>
    </Card>
  );
}
