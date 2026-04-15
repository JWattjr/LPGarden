# LP Garden 🌱

> **AI-Powered LP Range Optimization on X Layer.** Stop guessing your Uniswap V3 ranges. Let the agent calculate, commit, and monitor for you.

[![Live Demo](https://img.shields.io/badge/Status-Hackathon_MVP-success)](#) 
[![X Layer](https://img.shields.io/badge/Network-X_Layer_Testnet-black)](#)
[![Stack](https://img.shields.io/badge/Stack-Next.js_|_Wagmi_|_Foundry-blue)](#)

---

## 📖 Project Intro & Ecosystem Positioning

**LP Garden** is an intelligent liquidity management interface built specifically for **X Layer**. Liquidity providing on concentrated DEXs (like Uniswap V3) is notoriously difficult for retail users due to impermanent loss and the constant need to rebalance ranges. 

LP Garden solves this by introducing an **Autonomous Agent Layer** that sits between the user and the DEX. By leveraging the fast finality and low fees of the X Layer ecosystem, LP Garden allows users to offload the cognitive burden of LPing. Our agent analyzes real-time volatility, simulates 30-day outcomes, and recommends optimal risk-adjusted ranges. 

## ⚙️ Working Mechanics & Architecture

LP Garden operates in a two-stage architecture bridging offchain intelligence with onchain execution:

1. **Intelligence Layer (Offchain):** The typescript-based Agent Engine (`src/lib/engine`) continuously monitors live pair data (via DeFiLlama). It categorizes volatility, generates concentrated range bounds, and runs Monte Carlo-style impermanent loss simulations mapping across favorable, neutral, and adverse scenarios to formulate a definitive "Thinking Process".
2. **Execution Layer (Onchain):** Users review the agent's logic and securely sign the transaction via their wallet. The optimal configuration is committed to the `GardenStrategyRegistry.sol` smart contract on the X Layer Testnet, creating an immutable blueprint for autonomous execution.

```text
┌──────────────────────────────────────────────────────────┐
│                    LP Garden Frontend                     │
│              Next.js 15 · React 19 · wagmi                │
├──────────────┬───────────────────────┬───────────────────┤
│  /planner    │  Agent Engine (TS)    │  /monitor         │
│  Pool select │  recommend.ts         │  Read strategies  │
│  Live prices │  simulate.ts          │  from X Layer     │
│  (DeFiLlama) │  action.ts            │  via useReadContract│
├──────────────┴───────────────────────┴───────────────────┤
│                    wagmi / viem                            │
│         useWriteContract ←→ useReadContract               │
├──────────────────────────────────────────────────────────┤
│               X Layer Testnet (Chain 195)                 │
│          GardenStrategyRegistry.sol (Foundry)             │
│   createStrategy · updateStrategy · closeStrategy         │
└──────────────────────────────────────────────────────────┘
```

## 🧠 Core hackathon implementation details

### Agentic Wallet Identity
In the context of the hackathon, our AI agent requires an onchain identity to natively interact with the network and execute transactions on behalf of users in the future. 
We utilize a dedicated **Agent EOA (Externally Owned Account)** `[Agent_Wallet_Address_Here]` which acts as the core signing authority for the automated rebalancing backend logic (planned for V2). Currently, users sign the initial strategy definition, and the Agent Wallet is authorized to monitor those specific bounds onchain.

### Onchain OS / Uniswap Skills Usage
This project heavily utilizes core **Uniswap V3 LP Skills**:
- **Concentrated Liquidity Math Simulation:** The agent engine mathematically formulates optimal `tickLower` and `tickUpper` equivalents (represented as price boundaries) based on simulated market volatility profiles.
- **Impermanent Loss / Fee Yield Modeling:** Our `/simulate` pipeline directly mimics Uniswap V3's fee accrual mechanics against IL quadratics to spit out 30-day realistic trajectory scenarios.

### ⛓️ Smart Contract Deployment
**Contract:** `GardenStrategyRegistry.sol`  
**Network:** X Layer Testnet (Chain ID: 195)  
**Contract Address:** `0xca897becDBd37456331abB362e7ee9F15e9F41c0`
**Explorer Link:** [View on OKX Web3 Explorer](https://web3.okx.com/explorer/x-layer-testnet/address/0xca897becDBd37456331abB362e7ee9F15e9F41c0)

---

## 🚀 Quick Start & Repo Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm run dev

# 3. Open http://localhost:3000
# 4. Connect wallet to X Layer Testnet
# 5. Pick a pool → Agent analyzes → Commit strategy onchain
```

## 👥 Team Members

- **Runexbt** (Fullstack / Smart Contracts)
- **Velikanghost** (Frontend / Agent Logic)
