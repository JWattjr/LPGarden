"use client";

import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from "wagmi";
import { API_GARDEN_STRATEGY_REGISTRY, CONTRACT_ADDRESS } from "./abi";

export enum RiskLevel { Low = 0, Medium = 1, High = 2, Extreme = 3 }
export enum Status { Active = 0, Inactive = 1, Closed = 2 }

export function useCreateStrategy() {
  const { data: hash, isPending: isConfirmingWallet, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isPendingTx, isSuccess: isConfirmed, error: txError } = useWaitForTransactionReceipt({
    hash,
  });

  const createStrategy = (
    poolId: string, 
    lowerBound: number, 
    upperBound: number, 
    riskLevel: RiskLevel, 
    recommendedAction: string
  ) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: API_GARDEN_STRATEGY_REGISTRY,
      functionName: "createStrategy",
      args: [
        poolId, 
        BigInt(Math.floor(lowerBound * 1e6)), // scaling bounds for basic fractional safety
        BigInt(Math.floor(upperBound * 1e6)),
        riskLevel,
        recommendedAction
      ],
    });
  };

  return {
    createStrategy,
    isConfirmingWallet,
    isPendingTx,
    isConfirmed,
    error: writeError || txError,
    hash
  };
}

export function useUserStrategies() {
  const { address } = useAccount();

  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: API_GARDEN_STRATEGY_REGISTRY,
    functionName: "getStrategiesByOwner",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    }
  });
}

// In a full multi-call setup we would hook wagmi's `useReadContracts` directly onto the 
// returned array above. For this MVP demonstration, we will just use basic individual hooks 
// OR a secondary component that loops through the array fetching `getStrategy`.
export function useStrategyDetails(strategyId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: API_GARDEN_STRATEGY_REGISTRY,
    functionName: "getStrategy",
    args: strategyId !== undefined ? [strategyId] : undefined,
    query: {
      enabled: strategyId !== undefined,
    }
  });
}

export function useCloseStrategy() {
  const { data: hash, isPending: isConfirmingWallet, writeContract, error: writeError } = useWriteContract();

  const { isLoading: isPendingTx, isSuccess: isConfirmed, error: txError } = useWaitForTransactionReceipt({
    hash,
  });

  const closeStrategy = (id: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: API_GARDEN_STRATEGY_REGISTRY,
      functionName: "closeStrategy",
      args: [id],
    });
  };

  return {
    closeStrategy,
    isConfirmingWallet,
    isPendingTx,
    isConfirmed,
    error: writeError || txError,
    hash
  };
}
