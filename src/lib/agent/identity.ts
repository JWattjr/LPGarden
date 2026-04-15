/**
 * LP Garden - Onchain Agent Identity
 * 
 * This module defines the project's official identity on X Layer,
 * backed by the OKX Agentic Wallet infrastructure (TEE-secured).
 */

export const AGENT_IDENTITY = {
    name: "LP Garden Optimizer Agent",
    version: "1.0.0",
    
    // This was populated after 'onchainos wallet login'
    evmAddress: process.env.NEXT_PUBLIC_AGENT_EVM_ADDRESS || "0x684716496604b19f3883101e744482f43b3d76d3",
    
    network: "X Layer Testnet",
    chainId: 196,
    
    features: [
        "TEE-Secured Private Keys",
        "Zero-Gas Execution (X Layer)",
        "Onchain OS Skills Integration",
        "Uniswap V3 Optimization"
    ],
    
    status: "ACTIVE",
    role: "Liquidity Strategy Coordinator"
};

/**
 * Returns the public identity of the agent for UI display
 */
export function getAgentIdentity() {
    return AGENT_IDENTITY;
}
