import { NextResponse } from "next/server";
import { Pool } from "@/lib/types";
import { getPoolDefinition } from "@/lib/data/registry";
import { TOKENS } from "@/lib/data/tokens";
import { recommend } from "@/lib/engine/recommend";
import { simulate } from "@/lib/engine/simulate";
import { getAction } from "@/lib/engine/action";
import { reason } from "@/lib/engine/reason";

// DeFiLlama coin identifiers
const DEFILLAMA_IDS: Record<string, string> = {
  ETH: "coingecko:ethereum",
  WBTC: "coingecko:bitcoin",
  USDC: "coingecko:usd-coin",
  OKB: "coingecko:okb",
  PEPE: "coingecko:pepe",
};

async function fetchLivePool(poolId: string): Promise<Pool | null> {
  const def = getPoolDefinition(poolId);
  if (!def) return null;

  try {
    const id0 = DEFILLAMA_IDS[def.token0Symbol];
    const id1 = DEFILLAMA_IDS[def.token1Symbol];
    
    // Fetch prices and yields in parallel
    const [priceRes, yieldRes] = await Promise.all([
        fetch(`https://coins.llama.fi/prices/current/${id0},${id1}`, { next: { revalidate: 30 } }),
        fetch('https://yields.llama.fi/pools', { next: { revalidate: 3600 } })
    ]);

    const priceJson = await priceRes.json();
    const yieldJson = await yieldRes.json();

    const p0 = priceJson.coins[id0]?.price || 0;
    const p1 = priceJson.coins[id1]?.price || 1;
    const yieldInfo = yieldJson.data.find((y: any) => y.pool === def.llamaPoolId);

    return {
      id: def.id,
      token0: TOKENS[def.token0Symbol],
      token1: TOKENS[def.token1Symbol],
      feeTier: def.feeTier,
      currentPrice: p0 / p1,
      price24hChange: 0, // Simplified for analyze route
      volatilityClass: "medium",
      tvl: yieldInfo?.tvlUsd || 5000000,
      volume24h: (yieldInfo?.tvlUsd || 5000000) * 0.1,
      feeApr: yieldInfo?.apyBase || 15
    };
  } catch (e) {
    console.error("fetchLivePool failed", e);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { poolId } = await req.json();

    if (!poolId) {
      return NextResponse.json({ error: "Missing poolId" }, { status: 400 });
    }

    // Fetch pool with live pricing and metrics
    const pool = await fetchLivePool(poolId);
    if (!pool) {
      return NextResponse.json({ error: "Pool not found" }, { status: 404 });
    }

    // Run the quantitative engine
    const recommendation = recommend(pool);
    const simulation = simulate(pool, recommendation);
    const action = getAction(pool, recommendation, simulation);

    // AI Agent Cognitive reasoning (Qualitative)
    let cognitiveReasoning;
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        cognitiveReasoning = await reason(pool, recommendation, simulation);
      } catch (e) {
        console.warn("LLM Reasoning failed", e);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        pool,
        recommendation,
        simulation,
        action: {
          ...action,
          cognitive: cognitiveReasoning
        },
      },
    });
  } catch (error) {
    console.error("Agent analysis failed:", error);
    return NextResponse.json({ success: false, error: "Agent analysis failed" }, { status: 500 });
  }
}
