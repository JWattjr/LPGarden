import { NextResponse } from "next/server";
import { Pool } from "@/lib/types";
import { POOLS } from "@/lib/data/pools";

// DeFiLlama coin identifiers for our tokens
const DEFILLAMA_IDS: Record<string, string> = {
  ETH: "coingecko:ethereum",
  WBTC: "coingecko:bitcoin",
  USDC: "coingecko:usd-coin",
  OKB: "coingecko:okb",
  PEPE: "coingecko:pepe",
};

interface LlamaPrice {
  price: number;
  symbol: string;
  timestamp: number;
  confidence: number;
}

async function fetchLivePrices(): Promise<Record<string, LlamaPrice>> {
  const ids = Object.values(DEFILLAMA_IDS).join(",");
  const res = await fetch(`https://coins.llama.fi/prices/current/${ids}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`DeFiLlama prices API returned ${res.status}`);
  const json = await res.json();
  return json.coins;
}

async function fetch24hChanges(): Promise<Record<string, number>> {
  const ids = Object.values(DEFILLAMA_IDS).join(",");
  const res = await fetch(
    `https://coins.llama.fi/percentage/${ids}?period=1d`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error(`DeFiLlama percentage API returned ${res.status}`);
  const json = await res.json();
  return json.coins;
}

function computePairPrice(
  prices: Record<string, LlamaPrice>,
  token0Symbol: string,
  token1Symbol: string
): number | null {
  const id0 = DEFILLAMA_IDS[token0Symbol];
  const id1 = DEFILLAMA_IDS[token1Symbol];
  if (!id0 || !id1) return null;

  const p0 = prices[id0]?.price;
  const p1 = prices[id1]?.price;
  if (!p0 || !p1) return null;

  return p0 / p1;
}

function computePair24hChange(
  changes: Record<string, number>,
  token0Symbol: string,
  token1Symbol: string
): number | null {
  const id0 = DEFILLAMA_IDS[token0Symbol];
  const id1 = DEFILLAMA_IDS[token1Symbol];
  if (!id0 || !id1) return null;

  const c0 = changes[id0];
  const c1 = changes[id1];
  if (c0 === undefined || c1 === undefined) return null;

  // The pair change is approximately the difference:
  // if ETH went +3% and USDC stayed flat, then ETH/USDC pair moved +3%
  return Math.round((c0 - c1) * 100) / 100;
}

export async function GET() {
  try {
    const [prices, changes] = await Promise.all([
      fetchLivePrices(),
      fetch24hChanges(),
    ]);

    const livePools: Pool[] = POOLS.map((pool) => {
      const livePrice = computePairPrice(
        prices,
        pool.token0.symbol,
        pool.token1.symbol
      );

      const liveChange = computePair24hChange(
        changes,
        pool.token0.symbol,
        pool.token1.symbol
      );

      return {
        ...pool,
        currentPrice: livePrice ?? pool.currentPrice,
        price24hChange: liveChange ?? pool.price24hChange,
      };
    });

    return NextResponse.json({ success: true, data: livePools });
  } catch (error) {
    console.error("Failed to fetch live prices:", error);
    // Fallback to static data so the app never breaks
    return NextResponse.json({ success: true, data: POOLS });
  }
}
