import { NextResponse } from "next/server";
import { Pool } from "@/lib/types";
import { POOLS } from "@/lib/data/pools";
import { recommend } from "@/lib/engine/recommend";
import { simulate } from "@/lib/engine/simulate";
import { getAction } from "@/lib/engine/action";

// DeFiLlama coin identifiers — duplicated here so the agent route is self-contained
const DEFILLAMA_IDS: Record<string, string> = {
  ETH: "coingecko:ethereum",
  WBTC: "coingecko:bitcoin",
  USDC: "coingecko:usd-coin",
  OKB: "coingecko:okb",
  PEPE: "coingecko:pepe",
};

async function fetchLivePool(poolId: string): Promise<Pool | null> {
  const pool = POOLS.find((p) => p.id === poolId);
  if (!pool) return null;

  try {
    const id0 = DEFILLAMA_IDS[pool.token0.symbol];
    const id1 = DEFILLAMA_IDS[pool.token1.symbol];
    if (!id0 || !id1) return pool;

    const res = await fetch(
      `https://coins.llama.fi/prices/current/${id0},${id1}`,
      { next: { revalidate: 30 } }
    );

    if (!res.ok) return pool;

    const json = await res.json();
    const p0 = json.coins[id0]?.price;
    const p1 = json.coins[id1]?.price;

    if (p0 && p1) {
      return { ...pool, currentPrice: p0 / p1 };
    }
    return pool;
  } catch {
    return pool; // fallback to static
  }
}

export async function POST(req: Request) {
  try {
    const { poolId } = await req.json();

    if (!poolId) {
      return NextResponse.json({ error: "Missing poolId" }, { status: 400 });
    }

    // Fetch pool with live pricing
    const pool = await fetchLivePool(poolId);
    if (!pool) {
      return NextResponse.json({ error: "Pool not found" }, { status: 404 });
    }

    // Simulate agent reasoning time (replace with real OKX Agent OS call later)
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Run the agent chains
    const recommendation = recommend(pool);
    const simulation = simulate(pool, recommendation);
    const action = getAction(pool, recommendation, simulation);

    return NextResponse.json({
      success: true,
      data: {
        pool,
        recommendation,
        simulation,
        action,
      },
    });
  } catch (error) {
    console.error("Agent analysis failed:", error);
    return NextResponse.json(
      { success: false, error: "Agent analysis failed" },
      { status: 500 }
    );
  }
}
