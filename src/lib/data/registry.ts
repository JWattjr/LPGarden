import { TOKENS } from "./tokens";

export interface PoolDefinition {
  id: string;
  token0Symbol: string;
  token1Symbol: string;
  feeTier: 0.01 | 0.05 | 0.3 | 1.0;
  // DeFiLlama Yield Pool ID (optional, for real APY/TVL)
  llamaPoolId?: string;
}

/**
 * Registry of supported LP pairs.
 * We fetch all market data dynamically based on these definitions.
 */
export const POOL_REGISTRY: PoolDefinition[] = [
  {
    id: "eth-usdc",
    token0Symbol: "ETH",
    token1Symbol: "USDC",
    feeTier: 0.05,
    llamaPoolId: "747c1d2a-c668-4682-b9a9-2f7bcdc7498c" // Uniswap V3 ETH/USDC 0.05%
  },
  {
    id: "wbtc-eth",
    token0Symbol: "WBTC",
    token1Symbol: "ETH",
    feeTier: 0.05,
    llamaPoolId: "f066b1c2-c511-477e-976b-9c60e377f09a" // Uniswap V3 WBTC/ETH 0.05%
  },
  {
    id: "pepe-eth",
    token0Symbol: "PEPE",
    token1Symbol: "ETH",
    feeTier: 1.0,
    llamaPoolId: "1458d697-7c70-4963-8a3c-979998188e6e" // Uniswap V3 PEPE/ETH 1%
  }
];

export function getPoolDefinition(id: string) {
  return POOL_REGISTRY.find(p => p.id === id);
}
