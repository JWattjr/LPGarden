import { ScenarioOutcome } from "@/lib/types";
import { formatUSD, formatPercent } from "@/lib/utils/format";

interface ScenarioCardProps {
  outcome: ScenarioOutcome;
}

export function ScenarioCard({ outcome }: ScenarioCardProps) {
  const isPositivePnL = outcome.netPnL >= 0;

  // Visual theming based on scenario type
  const theme = {
    favorable: {
      border: "border-risk-low/30 hover:border-risk-low/60",
      bg: "bg-risk-low/5",
      color: "text-risk-low"
    },
    neutral: {
      border: "border-card-border hover:border-muted",
      bg: "bg-surface-2",
      color: "text-muted"
    },
    adverse: {
      border: "border-risk-high/30 hover:border-risk-high/60",
      bg: "bg-risk-high/5",
      color: "text-risk-high"
    }
  }[outcome.type];

  return (
    <div className={`p-5 rounded-2xl border transition-all h-full flex flex-col ${theme.border} ${theme.bg}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold">{outcome.label}</h4>
        </div>
        <div className="text-right">
          <span className={`text-sm font-semibold ${outcome.priceMovement === 0 ? "text-muted" : (outcome.priceMovement > 0 ? "text-risk-low" : "text-risk-high")}`}>
            {outcome.priceMovement > 0 ? "↗" : (outcome.priceMovement < 0 ? "↘" : "−")} {formatPercent(Math.abs(outcome.priceMovement), false)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted mb-6 flex-1 leading-relaxed">
        {outcome.summary}
      </p>

      {/* Math Breakdown */}
      <div className="space-y-3 mb-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Est. 30d Fees</span>
          <span className="font-mono text-risk-low">+{formatUSD(outcome.estimatedFees30d)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Impermanent Loss</span>
          <span className="font-mono text-risk-high">{formatUSD(outcome.estimatedIL)}</span>
        </div>
      </div>

      {/* Net Result Bar */}
      <div className="pt-4 border-t border-card-border/50 flex items-center justify-between">
        <span className="font-medium text-sm">Net 30d PnL</span>
        <span className={`font-mono font-bold text-lg ${isPositivePnL ? "text-risk-low" : "text-risk-high"}`}>
          {isPositivePnL ? "+" : ""}{formatUSD(outcome.netPnL)}
        </span>
      </div>
    </div>
  );
}
