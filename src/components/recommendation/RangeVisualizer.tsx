import { Card } from "@/components/ui/Card";
import { LPRecommendation } from "@/lib/types";

interface RangeVisualizerProps {
  recommendation: LPRecommendation;
}

export function RangeVisualizer({ recommendation }: RangeVisualizerProps) {
  // Purely visual: calculate positions for a nice chart graphic
  const { currentPrice, rangeLow, rangeHigh } = recommendation;
  
  // Create a visual bounding box that represents out-of-range territory
  // We'll map the total width to ±(rangeWidthPercent * 1.5) to give padding
  const paddingBuffer = recommendation.rangeWidthPercent * 0.5; 
  const viewMin = currentPrice * (1 - (recommendation.rangeWidthPercent / 100 / 2) - paddingBuffer / 100);
  const viewMax = currentPrice * (1 + (recommendation.rangeWidthPercent / 100 / 2) + paddingBuffer / 100);
  const viewRange = viewMax - viewMin;
  
  // Percentages relative to the visual container
  const lowPercent = Math.max(0, ((rangeLow - viewMin) / viewRange) * 100);
  const highPercent = Math.min(100, ((rangeHigh - viewMin) / viewRange) * 100);
  const currentPercent = ((currentPrice - viewMin) / viewRange) * 100;
  
  const widthPercent = highPercent - lowPercent;

  return (
    <Card className="p-6 overflow-hidden">
      <h3 className="text-xl font-semibold mb-6">Price Range Position</h3>
      
      <div className="relative h-40 w-full mt-8">
        {/* Background "Out of Range" Zones */}
        <div className="absolute inset-0 bg-surface-2 rounded-lg border border-card-border/50" />
        
        {/* "In Range" Active Zone */}
        <div 
          className="absolute top-0 bottom-0 bg-accent/20 border-x-2 border-accent/80 transition-all duration-1000 ease-out flex flex-col justify-between py-2"
          style={{ left: `${lowPercent}%`, width: `${widthPercent}%` }}
        >
          {/* Subtle gradient fill for active zone */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/10 pointer-events-none" />
        </div>
        
        {/* Current Price Marker */}
        <div 
          className="absolute top-0 bottom-0 w-px bg-foreground transition-all duration-1000 z-10"
          style={{ left: `${currentPercent}%` }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono font-bold bg-card border border-card-border px-2 py-1 rounded-md">
            Current Price
          </div>
        </div>
        
        {/* Estimated Liquidity Distribution curve (SVG overlay) */}
        <svg preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-30 text-accent pointer-events-none" viewBox="0 0 100 100">
          <path 
            d={`M 0 100 Q ${currentPercent} -50 100 100`} 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            className="drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
          />
        </svg>

        {/* Labels for Min/Max limits */}
        <div 
          className="absolute -top-7 text-xs text-muted font-mono -translate-x-1/2 transition-all duration-1000"
          style={{ left: `${lowPercent}%` }}
        >
          MIN
        </div>
        <div 
          className="absolute -top-7 text-xs text-muted font-mono -translate-x-1/2 transition-all duration-1000"
          style={{ left: `${highPercent}%` }}
        >
          MAX
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-12 text-xs text-muted">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-surface-2 border border-card-border" />
          <span>Out of range (0 fees)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-accent/20 border-x border-accent/80" />
          <span>In range (Earning)</span>
        </div>
      </div>
    </Card>
  );
}
