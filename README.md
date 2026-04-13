# LP Garden 🌱

> **AI-Powered LP Range Optimization on X Layer.** Stop guessing your Uniswap V3 ranges. Let the agent calculate, commit, and monitor for you.

[![Live Demo](https://img.shields.io/badge/Status-Hackathon_MVP-success)](#) 
[![X Layer](https://img.shields.io/badge/Network-X_Layer_Testnet-black)](#)
[![Stack](https://img.shields.io/badge/Stack-Next.js_|_Wagmi_|_Foundry-blue)](#)

---

## 🏛 Architecture 

```
┌──────────────────────────────────────────────────────────┐
│                    LP Garden Frontend                     │
│              Next.js 15 · React 19 · wagmi                │
├──────────────┬───────────────────────┬───────────────────┤
│  /planner    │  Agent Engine (TS)    │  /monitor         │
│  Pool select │  recommend.ts         │  Read strategies  │
│  Live prices │  simulate.ts          │  from X Layer     │
│  (DeFiLlama)│  action.ts            │  via useReadContract│
├──────────────┴───────────────────────┴───────────────────┤
│                    wagmi / viem                            │
│         useWriteContract ←→ useReadContract               │
├──────────────────────────────────────────────────────────┤
│               X Layer Testnet (Chain 195)                 │
│          GardenStrategyRegistry.sol (Foundry)             │
│   createStrategy · updateStrategy · closeStrategy         │
└──────────────────────────────────────────────────────────┘
```

LP Garden is built in two layers:

- **Intelligence Layer (Offchain):** A TypeScript agent engine pulls **live real-time pricing via DeFiLlama**, calculates token volatility classes, and runs 30-day Monte Carlo-style simulations to predict Impermanent Loss vs. Fee Accrual across three scenario outcomes.
- **Execution Layer (Onchain):** Users securely sign and commit their optimal LP strategy parameters to `GardenStrategyRegistry.sol` on **X Layer Testnet**. The contract stores range bounds, risk levels, and recommended actions as a verifiable source of truth for future autonomous execution agents.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open http://localhost:3000
# 4. Connect wallet to X Layer Testnet
# 5. Pick a pool → Agent analyzes → Commit strategy onchain
```

## ⛓️ Smart Contract

**Contract:** `GardenStrategyRegistry.sol`  
**Network:** X Layer Testnet (Chain ID: 195)  
**Compiler:** Solidity ^0.8.20, Foundry

### Functions

| Function | Type | Description |
|---|---|---|
| `createStrategy()` | Write | Commit a new LP range + risk level onchain |
| `updateStrategy()` | Write | Modify bounds or status of an active strategy |
| `closeStrategy()` | Write | Permanently close a strategy |
| `getStrategiesByOwner()` | Read | Fetch all strategy IDs for a wallet |
| `getStrategy()` | Read | Fetch full strategy struct by ID |

### Running Tests

```bash
cd contracts
forge test -vvv
```

## 🧠 Agent Engine

The core intelligence lives in `src/lib/engine/`:

- **`recommend.ts`** — Calculates optimal LP range width based on token volatility class (low/medium/high/extreme). Outputs price bounds, estimated APR with concentration multiplier, and IL risk score.
- **`simulate.ts`** — Runs 3 scenario projections (Favorable/Neutral/Adverse) modeling 30-day fee accrual vs. impermanent loss for a given deposit amount.
- **`action.ts`** — Decision tree that evaluates simulation outcomes + 24h price action to output a final action (Deploy/Wait/Widen/Rebalance/Exit) with confidence scoring.

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS v4 |
| Web3 | wagmi v3, viem, ConnectKit |
| Contracts | Foundry, Solidity ^0.8.20 |
| Pricing | DeFiLlama API (live, no key required) |
| Chain | X Layer Testnet (OKX) |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # Server-side API routes (agent, pools)
│   ├── monitor/            # Position monitoring dashboard
│   └── planner/            # Pool selection + agent analysis
├── components/
│   ├── action/             # Deploy/commit UI
│   ├── landing/            # Hero, features, how-it-works
│   ├── monitor/            # StrategyCard (onchain read)
│   ├── pool/               # PoolCard, LivePrice
│   ├── recommendation/     # Agent output visualization
│   ├── simulation/         # 30-day scenario cards
│   └── ui/                 # Shared primitives (Card, Badge, TokenIcon)
├── lib/
│   ├── data/               # Token + pool definitions
│   ├── engine/             # Agent logic (recommend, simulate, action)
│   ├── web3/               # wagmi config, hooks, ABI
│   └── types/              # TypeScript interfaces
contracts/
├── src/                    # Solidity source
├── script/                 # Foundry deployment scripts
└── test/                   # Foundry test suite
```
