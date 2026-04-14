import { NextResponse } from 'next/server'
import { Pool } from '@/lib/types'
import { POOL_REGISTRY } from '@/lib/data/registry'
import { TOKENS } from '@/lib/data/tokens'

// DeFiLlama coin identifiers for our tokens
const DEFILLAMA_IDS: Record<string, string> = {
  ETH: 'coingecko:ethereum',
  WBTC: 'coingecko:bitcoin',
  USDC: 'coingecko:usd-coin',
  OKB: 'coingecko:okb',
  PEPE: 'coingecko:pepe',
}

interface LlamaPrice {
  price: number
  symbol: string
  timestamp: number
  confidence: number
}

async function fetchLivePrices(): Promise<Record<string, LlamaPrice>> {
  const ids = Object.values(DEFILLAMA_IDS).join(',')
  const res = await fetch(`https://coins.llama.fi/prices/current/${ids}`, {
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error(`DeFiLlama prices API returned ${res.status}`)
  const json = await res.json()
  return json.coins
}

async function fetch24hChanges(): Promise<Record<string, number>> {
  const ids = Object.values(DEFILLAMA_IDS).join(',')
  const res = await fetch(
    `https://coins.llama.fi/percentage/${ids}?period=1d`,
    { next: { revalidate: 60 } },
  )
  if (!res.ok)
    throw new Error(`DeFiLlama percentage API returned ${res.status}`)
  const json = await res.json()
  return json.coins
}

async function fetchYieldData(): Promise<any[]> {
  try {
    const res = await fetch('https://yields.llama.fi/pools', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = await res.json()
    return json.data
  } catch {
    return []
  }
}

export async function GET() {
  try {
    const [prices, changes, yields] = await Promise.all([
      fetchLivePrices(),
      fetch24hChanges(),
      fetchYieldData(),
    ])

    const livePools: Pool[] = POOL_REGISTRY.map((def) => {
      const id0 = DEFILLAMA_IDS[def.token0Symbol]
      const id1 = DEFILLAMA_IDS[def.token1Symbol]
      
      const p0 = prices[id0]?.price || 0
      const p1 = prices[id1]?.price || 1
      const currentPrice = p0 / p1

      const c0 = changes[id0] || 0
      const c1 = changes[id1] || 0
      const price24hChange = Math.round((c0 - c1) * 100) / 100

      // Find matching yield data if possible
      const yieldInfo = yields.find(y => y.pool === def.llamaPoolId)

      return {
        id: def.id,
        token0: TOKENS[def.token0Symbol],
        token1: TOKENS[def.token1Symbol],
        feeTier: def.feeTier,
        currentPrice,
        price24hChange,
        volatilityClass: Math.abs(price24hChange) > 5 ? "high" : "medium",
        tvl: yieldInfo?.tvlUsd || 5000000, // Fallback to 5M if not found
        volume24h: (yieldInfo?.tvlUsd || 5000000) * 0.1, // Heuristic 10% utilization
        feeApr: yieldInfo?.apyBase || 15, // Fallback to 15% if not found
      }
    })

    return NextResponse.json({ success: true, data: livePools })
  } catch (error) {
    console.error('Failed to fetch live prices:', error)
    return NextResponse.json({ success: false, data: [] })
  }
}
