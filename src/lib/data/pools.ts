import { Pool } from "@/lib/types";
import { TOKENS } from "./tokens";

export const POOLS: Pool[] = [
  {
    id: "eth-usdc",
    token0: TOKENS.ETH,
    token1: TOKENS.USDC,
    feeTier: 0.3,
    currentPrice: 3245.80,
    price24hChange: 1.2,
    volatilityClass: "medium",
    tvl: 48_500_000,
    volume24h: 12_300_000,
    feeApr: 18.5,
  },
  {
    id: "wbtc-eth",
    token0: TOKENS.WBTC,
    token1: TOKENS.ETH,
    feeTier: 0.3,
    currentPrice: 18.42,
    price24hChange: -0.3,
    volatilityClass: "low",
    tvl: 32_100_000,
    volume24h: 8_700_000,
    feeApr: 12.1,
  },
  {
    id: "okb-usdc",
    token0: TOKENS.OKB,
    token1: TOKENS.USDC,
    feeTier: 0.3,
    currentPrice: 52.35,
    price24hChange: 2.8,
    volatilityClass: "medium",
    tvl: 14_200_000,
    volume24h: 4_100_000,
    feeApr: 22.4,
  },
  {
    id: "pepe-eth",
    token0: TOKENS.PEPE,
    token1: TOKENS.ETH,
    feeTier: 1.0,
    currentPrice: 0.00001245,
    price24hChange: -8.4,
    volatilityClass: "extreme",
    tvl: 3_800_000,
    volume24h: 9_600_000,
    feeApr: 142.0,
  },
];

export function getPoolById(id: string): Pool | undefined {
  return POOLS.find((p) => p.id === id);
}
