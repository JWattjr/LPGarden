import { Card } from "@/components/ui/Card";
import { RiskBadge } from "./RiskBadge";
import { LPRecommendation, Pool } from "@/lib/types";
import { formatPrice, formatAPR } from "@/lib/utils/format";

interface RangeDetailsProps {
  pool: Pool | null;
  recommendation?: LPRecommendation;
}

export function RangeDetails({ pool, recommendation }: RangeDetailsProps) {
  if (!pool || !recommendation) {
    return (
      <Card className="p-6 h-[250px] bg-surface-2 animate-pulse border-card-border/50">
        <div className="h-6 w-48 bg-card rounded mb-4" />
        <div className="grid grid-cols-2 gap-4">
           <div className="h-16 bg-card rounded-xl" />
           <div className="h-16 bg-card rounded-xl" />
        </div>
        <div className="h-10 w-full bg-card rounded-xl mt-4" />
      </Card>
    );
  }
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-1">Recommended Range</h3>
          <p className="text-muted text-sm tracking-tight text-balance">
            {recommendation.rationale}
          </p>
        </div>
        <RiskBadge level={recommendation.riskLevel} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Min Price */}
        <div className="p-4 rounded-xl bg-surface-2 border border-card-border/50">
          <p className="text-xs text-muted mb-1 text-center">Min Price ({pool.token1.symbol})</p>
          <p className="text-lg font-mono font-semibold text-center">
            {formatPrice(recommendation.rangeLow)}
          </p>
        </div>
        
        {/* Max Price */}
        <div className="p-4 rounded-xl bg-surface-2 border border-card-border/50">
          <p className="text-xs text-muted mb-1 text-center">Max Price ({pool.token1.symbol})</p>
          <p className="text-lg font-mono font-semibold text-center">
            {formatPrice(recommendation.rangeHigh)}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-card-border/50 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted mb-0.5">Est. APR</p>
          <p className="text-accent font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            {formatAPR(recommendation.estimatedFeeApr)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted mb-0.5">IL Risk Parameter</p>
          <div className="flex items-center gap-2 justify-end">
            <div className="h-1.5 w-16 bg-surface-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-risk-high rounded-full opacity-80" 
                style={{ width: `${recommendation.estimatedILRisk}%` }} 
              />
            </div>
            <p className="text-sm font-medium">{recommendation.estimatedILRisk}/100</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
