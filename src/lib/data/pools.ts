import { Pool } from "@/lib/types";
import { TOKENS } from "./tokens";
import { POOL_REGISTRY, getPoolDefinition } from "./registry";

/**
 * Re-exporting helpers that used to live in the static pools.ts
 * but now work with the registry.
 */

export function getPoolById(id: string): Pool | null {
  const def = getPoolDefinition(id);
  if (!def) return null;

  // Since we deleted the static data, we return a "skeleton" pool 
  // that the frontend will hydrate via the API.
  return {
    id: def.id,
    token0: TOKENS[def.token0Symbol],
    token1: TOKENS[def.token1Symbol],
    feeTier: def.feeTier,
    currentPrice: 0,
    price24hChange: 0,
    volatilityClass: "medium",
    tvl: 0,
    volume24h: 0,
    feeApr: 0
  };
}

// Minimal placeholder for parts of the UI that still rely on a POOLS array
export const POOLS: Pool[] = POOL_REGISTRY.map(def => getPoolById(def.id)!);
