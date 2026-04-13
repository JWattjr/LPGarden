import { Pool, LPRecommendation, RiskLevel } from "@/lib/types";

/**
 * Pure heuristic recommendation engine for LP ranges based on volatility class.
 */
export function recommend(pool: Pool): LPRecommendation {
  const { currentPrice, volatilityClass, feeApr } = pool;

  let rangePercent: number;
  let riskLevel: RiskLevel;
  let ilRisk: number; // 0-100 scale

  // Heuristics based on volatility class
  switch (volatilityClass) {
    case "low":
      // Stable or very correlated pairs (e.g., stable-stable or WBTC-ETH)
      rangePercent = 0.05; // ±5%
      riskLevel = "low";
      ilRisk = 15;
      break;
    case "medium":
      // Standard blue-chip pairs
      rangePercent = 0.15; // ±15%
      riskLevel = "medium";
      ilRisk = 35;
      break;
    case "high":
      // Volatile pairs
      rangePercent = 0.30; // ±30%
      riskLevel = "high";
      ilRisk = 65;
      break;
    case "extreme":
      // Meme coins, etc.
      rangePercent = 0.60; // ±60%
      riskLevel = "high";
      ilRisk = 90;
      break;
    default:
      rangePercent = 0.20;
      riskLevel = "medium";
      ilRisk = 40;
  }

  const rangeLow = currentPrice * (1 - rangePercent);
  const rangeHigh = currentPrice * (1 + rangePercent);
  
  // Calculate a projected APR based on concentration multiplier vs base pool APR
  // Tighter ranges have a much higher multiplier.
  const concentrationMultiplier = 1 / (rangePercent * 2);
  // Cap the theoretical return to something realistic
  const estimatedFeeApr = Math.min(feeApr * (concentrationMultiplier * 0.4), feeApr * 5);

  let rationale = "";
  if (volatilityClass === "low") {
    rationale = `Given ${pool.token0.symbol}/${pool.token1.symbol}'s low volatility, a concentrated ±${(rangePercent * 100).toFixed(0)}% range maximizes fee generation while keeping impermanent loss risk minimal.`;
  } else if (volatilityClass === "medium") {
    rationale = `A moderate ±${(rangePercent * 100).toFixed(0)}% range balances fee accrual with breathing room for standard market swings.`;
  } else if (volatilityClass === "high") {
    rationale = `High volatility requires a wider ±${(rangePercent * 100).toFixed(0)}% buffer to prevent the position from easily exiting the range and halting fee generation.`;
  } else {
    rationale = `Extreme volatility detected. A very wide ±${(rangePercent * 100).toFixed(0)}% range is advised to capture swings, though impermanent loss risk remains severe.`;
  }

  // Confidence scales inversely with volatility: well-understood pairs = higher confidence.
  const confidenceMap = {
    low: 92,
    medium: 78,
    high: 65,
    extreme: 40,
  };

  return {
    poolId: pool.id,
    rangeLow,
    rangeHigh,
    currentPrice,
    rangeWidthPercent: rangePercent * 2 * 100,
    estimatedFeeApr,
    estimatedILRisk: ilRisk,
    riskLevel,
    rationale,
    confidence: confidenceMap[volatilityClass],
  };
}
