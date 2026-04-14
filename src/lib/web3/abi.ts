export const API_GARDEN_STRATEGY_REGISTRY = [
  {
    "inputs": [
      { "internalType": "string", "name": "_poolId", "type": "string" },
      { "internalType": "uint256", "name": "_lowerBound", "type": "uint256" },
      { "internalType": "uint256", "name": "_upperBound", "type": "uint256" },
      { "internalType": "enum GardenStrategyRegistry.RiskLevel", "name": "_riskLevel", "type": "uint8" },
      { "internalType": "string", "name": "_recommendedAction", "type": "string" }
    ],
    "name": "createStrategy",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_id", "type": "uint256" },
      { "internalType": "uint256", "name": "_lowerBound", "type": "uint256" },
      { "internalType": "uint256", "name": "_upperBound", "type": "uint256" },
      { "internalType": "string", "name": "_recommendedAction", "type": "string" },
      { "internalType": "enum GardenStrategyRegistry.Status", "name": "_status", "type": "uint8" }
    ],
    "name": "updateStrategy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "closeStrategy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }],
    "name": "getStrategiesByOwner",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }],
    "name": "getStrategy",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "address", "name": "owner", "type": "address" },
          { "internalType": "string", "name": "poolId", "type": "string" },
          { "internalType": "uint256", "name": "lowerBound", "type": "uint256" },
          { "internalType": "uint256", "name": "upperBound", "type": "uint256" },
          { "internalType": "enum GardenStrategyRegistry.RiskLevel", "name": "riskLevel", "type": "uint8" },
          { "internalType": "string", "name": "recommendedAction", "type": "string" },
          { "internalType": "uint256", "name": "createdAt", "type": "uint256" },
          { "internalType": "enum GardenStrategyRegistry.Status", "name": "status", "type": "uint8" }
        ],
        "internalType": "struct GardenStrategyRegistry.Strategy",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// IMPORTANT: Replace this with the actual deployed address after running Step 4
export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xca897becDBd37456331abB362e7ee9F15e9F41c0") as `0x${string}`;
