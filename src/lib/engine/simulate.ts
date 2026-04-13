import { Pool, LPRecommendation, ScenarioSimulation, ScenarioOutcome } from "@/lib/types";

/**
 * Pure function to simulate 30-day outcomes for a given recommendation.
 */
export function simulate(
  pool: Pool, 
  recommendation: LPRecommendation, 
  depositAmount: number = 1000 // Default to $1000 for simulation
): ScenarioSimulation {
  const { currentPrice, estimatedFeeApr, rangeLow, rangeHigh, rangeWidthPercent } = recommendation;
  
  // Scenarios are driven by the pool's volatility class
  let favorableMove: number;
  let neutralMove: number;
  let adverseMove: number;

  switch (pool.volatilityClass) {
    case "low":
      favorableMove = 0; // Price stays exactly same
      neutralMove = 0.02; // 2% drift
      adverseMove = 0.10; // 10% dump
      break;
    case "medium":
      favorableMove = 0;
      neutralMove = 0.08; 
      adverseMove = 0.25; 
      break;
    case "high":
      favorableMove = 0;
      neutralMove = 0.15;
      adverseMove = 0.45;
      break;
    case "extreme":
      favorableMove = 0;
      neutralMove = 0.30;
      adverseMove = 0.75;
      break;
    default:
      favorableMove = 0;
      neutralMove = 0.10;
      adverseMove = 0.30;
      break;
  }

  // Monthly fee accrual (base estimation if in range 100% of the time)
  const monthlyFeeRate = estimatedFeeApr / 12 / 100;
  const maxFees30d = depositAmount * monthlyFeeRate;

  // Outcome generator helper
  const createOutcome = (
    type: "favorable" | "neutral" | "adverse",
    label: string, 
    movePercent: number, 
    timeInRangePercent: number, // 0 to 1
    ilSeverity: number // multiplier for IL based on move
  ): ScenarioOutcome => {
    const newPrice = currentPrice * (1 + movePercent);
    const inRange = newPrice >= rangeLow && newPrice <= rangeHigh;
    
    // Fees are proportional to time spent in range
    const estimatedFees30d = maxFees30d * timeInRangePercent;
    
    // Rough IL calculation heuristic (real IL formula is complex, this is proxy for MVP)
    // IL gets worse quadratically the further price moves, modified by volatility severity
    const impermanentLossMultiplier = Math.pow(Math.abs(movePercent * 100), 1.5) * ilSeverity;
    const estimatedIL = -(depositAmount * (impermanentLossMultiplier / 10000));
    
    // Cap IL to -100%
    const finalIL = Math.max(-depositAmount, estimatedIL);
    
    let summary = "";
    if (type === "favorable") {
      summary = "Price remains centered. You capture maximum fees with near-zero impermanent loss.";
    } else if (type === "neutral") {
      summary = `Price drifts ${movePercent > 0 ? 'up' : 'down'} ${Math.abs(movePercent * 100).toFixed(0)}% but mostly stays in your wide range. Solid fee generation buffers minor IL.`;
    } else {
      summary = `Price crashes ${Math.abs(movePercent * 100).toFixed(0)}%. Position falls out of range, halting fees. Severe impermanent loss incurred.`;
    }

    return {
      type,
      label,
      priceMovement: movePercent * 100,
      newPrice,
      inRange,
      estimatedFees30d,
      estimatedIL: finalIL,
      netPnL: estimatedFees30d + finalIL,
      summary
    };
  };

  const scenarios: ScenarioOutcome[] = [
    createOutcome(
      "favorable", 
      "Stays Centered", 
      favorableMove, 
      0.95, // spends 95% of month in range
      0.1   // very low IL
    ),
    createOutcome(
      "neutral", 
      "Moderate Drift", 
      neutralMove, 
      0.65, // spends 65% of month in range
      1.5   // moderate IL severity
    ),
    createOutcome(
      "adverse", 
      "Severe Drop", 
      -adverseMove, // Model a drop for the adverse scenario
      0.10, // spends 10% of month in range
      4.0   // high IL severity
    )
  ];

  return {
    poolId: pool.id,
    depositAmount,
    scenarios,
    generatedAt: Date.now()
  };
}
