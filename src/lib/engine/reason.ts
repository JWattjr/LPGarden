import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";
import { Pool, LPRecommendation, ScenarioSimulation, CognitiveRationale } from "@/lib/types";

/**
 * Generates qualitative agentic reasoning for an LP strategy using Claude 3 Haiku.
 * This version provides a multi-step thought process for the UI.
 */
export async function reason(
  pool: Pool,
  recommendation: LPRecommendation,
  simulation: ScenarioSimulation
): Promise<CognitiveRationale> {
  const model = anthropic("claude-3-haiku-20240307");

  const prompt = `
    You are an expert DeFi Liquidity Providing (LP) agent named LP Garden Builder. 
    Analyze the following quantitative metrics for a Uniswap V3 position and provide your "Cognitive Rationale".
    
    POOL DATA:
    - Pair: ${pool.token0.symbol}/${pool.token1.symbol}
    - 24h Price Change: ${pool.price24hChange}%
    - TVL: $${(pool.tvl / 1e6).toFixed(2)}M
    - Fee APR: ${pool.feeApr}%
    
    RECOMMENDED STRATEGY:
    - Range: ${recommendation.rangeLow.toFixed(4)} to ${recommendation.rangeHigh.toFixed(4)}
    - Range Width: ${recommendation.rangeWidthPercent}%
    - Projected Fee APR: ${recommendation.estimatedFeeApr}%
    - Estimated IL Risk: ${recommendation.estimatedILRisk}/100
    
    SIMULATION OUTCOMES (30-day):
    ${simulation.scenarios.map(s => `- ${s.label}: ${s.summary} (PnL: $${s.netPnL.toFixed(2)})`).join("\n")}
    
    TASK:
    First, outline your step-by-step thinking process in the "steps" array (Scanning, Simulating, Deciding).
    Then provide the nuanced analysis.
    
    1. "analysis": How does current market volatility interact with this concentration?
    2. "riskAssessment": What is the primary danger (e.g., permanent loss vs. out-of-range)?
    3. "marketContext": How should a user interpret the current 24h price action?
    4. "verdict": A precise, final sentence advising the user.
  `;

  const { object } = await generateObject({
    model,
    schema: z.object({
      steps: z.array(z.object({
        title: z.string(),
        content: z.string(),
        type: z.enum(["scanning", "simulating", "deciding"])
      })),
      analysis: z.string(),
      riskAssessment: z.string(),
      marketContext: z.string(),
      verdict: z.string(),
    }),
    prompt,
  });

  return object;
}
