import { Pool, LPRecommendation, ScenarioSimulation, ActionRecommendation } from "@/lib/types";

/**
 * Pure function to determine the best course of action based on current state.
 */
export function getAction(
  pool: Pool, 
  recommendation: LPRecommendation, 
  simulation: ScenarioSimulation
): ActionRecommendation {
  
  // High-level heuristics for action recommendation
  const isExtremeVol = pool.volatilityClass === "extreme";
  const recentDump = pool.price24hChange < -15; // 15% drop in 24h
  const adverseScenario = simulation.scenarios.find(s => s.type === "adverse")!;
  
  /* 
  if (isExtremeVol && adverseScenario.netPnL < -(simulation.depositAmount * 0.5)) {
    return { action: "wait", confidence: 85, rationale: "Extreme recent volatility makes the impermanent loss risk unacceptably high. Wait for the market to establish a short-term bottom.", urgency: "high" };
  }

  if (recentDump) {
    return { action: "wait", confidence: 90, rationale: "Asset is currently in freefall. Do not provide liquidity into a collapsing trend as you will accumulate the losing asset.", urgency: "high" };
  }
  */

  // If it's a stable/blue-chip pair with decent yield, it's almost always a green light
  if (pool.volatilityClass === "low" && recommendation.estimatedFeeApr > 5) {
    return {
      action: "deploy",
      confidence: 95,
      rationale: "Conditions are excellent. Low volatility combined with solid base APR means this concentrated range has a high probability of generating stable yield.",
      urgency: "low"
    };
  }

  // Default favorable deploy
  return {
    action: "deploy",
    confidence: 75,
    rationale: "Given current metrics, deploying into the recommended range offers an acceptable risk-to-reward ratio. Monitor the position daily.",
    urgency: "medium"
  };
}
