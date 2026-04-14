import { Card } from "@/components/ui/Card";

interface RecommendationSummaryProps {
  confidence?: number;
}

export function RecommendationSummary({ confidence }: RecommendationSummaryProps) {
  if (confidence === undefined) {
    return (
        <Card className="p-4 bg-accent/5 border-accent/20 flex items-start gap-4 animate-pulse">
            <div className="w-10 h-10 flex items-center justify-center bg-accent/20 rounded-full shrink-0">
                🌱
            </div>
            <div className="flex-1">
                <div className="h-4 w-32 bg-accent/20 rounded mb-2" />
                <div className="h-12 w-full bg-accent/10 rounded" />
            </div>
        </Card>
    );
  }
  return (
    <Card className="p-4 bg-accent/5 border-accent/20 flex items-start gap-4">
      <div className="text-2xl mt-1 animate-pulse-glow w-10 h-10 flex items-center justify-center bg-accent/20 rounded-full shrink-0">
        🌿
      </div>
      <div>
        <h4 className="font-semibold mb-1 text-accent">Agent Intelligence</h4>
        <p className="text-sm text-foreground/80 leading-relaxed mb-3">
          I've analyzed the recent volatility profile and liquidity distribution for this pair. The suggested range is optimized to balance fee generation against impermanent loss risk.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-mono uppercase tracking-wider">Confidence Score</span>
          <div className="h-1.5 w-24 bg-surface-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent rounded-full opacity-90 transition-all duration-1000" 
              style={{ width: `${confidence}%` }} 
            />
          </div>
          <span className="text-xs font-semibold text-accent">{confidence}%</span>
        </div>
      </div>
    </Card>
  );
}
