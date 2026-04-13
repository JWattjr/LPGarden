<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# LP Garden — Agent Context

## What This Project Does

LP Garden is an AI-powered liquidity position (LP) range optimizer built on X Layer. It uses a TypeScript agent engine to:
1. Fetch live token prices from DeFiLlama
2. Calculate optimal Uniswap V3 LP range bounds based on volatility classification
3. Simulate 30-day fee accrual vs. impermanent loss across 3 scenarios
4. Output a deterministic action recommendation (Deploy/Wait/Widen/Rebalance/Exit)
5. Commit the final strategy parameters to an onchain `GardenStrategyRegistry` smart contract on X Layer Testnet

## Onchain Integration

- **Contract:** `GardenStrategyRegistry.sol` (Solidity ^0.8.20, Foundry)
- **Chain:** X Layer Testnet (Chain ID 195, RPC: https://testrpc.xlayer.tech)
- **Write Functions:** `createStrategy()`, `updateStrategy()`, `closeStrategy()`
- **Read Functions:** `getStrategiesByOwner()`, `getStrategy()`
- **Frontend Hooks:** `useCreateStrategy`, `useCloseStrategy`, `useUserStrategies`, `useStrategyDetails` (wagmi v3 + viem)
- **Events Emitted:** `StrategyCreated`, `StrategyUpdated`, `StrategyClosed`

## Key Files

| File | Purpose |
|---|---|
| `contracts/src/GardenStrategyRegistry.sol` | Core onchain registry contract |
| `contracts/test/GardenStrategyRegistry.t.sol` | Foundry test suite (100% function coverage) |
| `src/lib/engine/recommend.ts` | Agent range recommendation logic |
| `src/lib/engine/simulate.ts` | 30-day scenario simulation engine |
| `src/lib/engine/action.ts` | Action decision tree |
| `src/lib/web3/hooks.ts` | wagmi hooks for onchain read/write |
| `src/lib/web3/abi.ts` | Contract ABI + deployed address |
| `src/app/api/pools/route.ts` | DeFiLlama live price integration |

## Tech Stack

Next.js 15 (App Router), React 19, Tailwind CSS v4, wagmi v3, viem, ConnectKit, Foundry, Solidity ^0.8.20
