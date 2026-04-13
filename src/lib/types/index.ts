// ─── Core Token & Pool Types ────────────────────────────────────────

export interface Token {
  symbol: string;
  name: string;
  decimals: number;
  icon: string; // emoji for now, replaced with real icons later
}

export type VolatilityClass = "low" | "medium" | "high" | "extreme";
export type RiskLevel = "low" | "medium" | "high";
export type FeeTier = 0.01 | 0.05 | 0.3 | 1.0;

export interface Pool {
  id: string;
  token0: Token;
  token1: Token;
  feeTier: FeeTier;
  currentPrice: number;
  price24hChange: number; // percentage
  volatilityClass: VolatilityClass;
  tvl: number;
  volume24h: number;
  feeApr: number; // estimated annual percentage
}

// ─── Recommendation Types ───────────────────────────────────────────

export interface LPRecommendation {
  poolId: string;
  rangeLow: number;
  rangeHigh: number;
  currentPrice: number;
  rangeWidthPercent: number;
  estimatedFeeApr: number;
  estimatedILRisk: number; // 0-100
  riskLevel: RiskLevel;
  rationale: string;
  confidence: number; // 0-100
}

// ─── Simulation Types ───────────────────────────────────────────────

export type ScenarioType = "favorable" | "neutral" | "adverse";

export interface ScenarioOutcome {
  type: ScenarioType;
  label: string;
  priceMovement: number; // percentage change
  newPrice: number;
  inRange: boolean;
  estimatedFees30d: number; // USD
  estimatedIL: number; // USD (negative = loss)
  netPnL: number; // USD
  summary: string;
}

export interface ScenarioSimulation {
  poolId: string;
  depositAmount: number; // USD
  scenarios: ScenarioOutcome[];
  generatedAt: number; // timestamp
}

// ─── Action Types ───────────────────────────────────────────────────

export type ActionType = "deploy" | "wait" | "widen" | "rebalance" | "exit";

export interface ActionRecommendation {
  action: ActionType;
  confidence: number; // 0-100
  rationale: string;
  urgency: "low" | "medium" | "high";
}

// ─── Position & Health Types ────────────────────────────────────────

export interface LocalPosition {
  id: string;
  poolId: string;
  rangeLow: number;
  rangeHigh: number;
  depositAmount: number;
  entryPrice: number;
  currentPrice: number;
  createdAt: number;
}

export interface PositionHealth {
  positionId: string;
  inRange: boolean;
  rangeUtilization: number; // 0-100, how centered price is in range
  distanceToEdge: number; // percentage to nearest edge
  accruedFees: number;
  unrealizedIL: number;
  riskLevel: RiskLevel;
  recommendation: ActionRecommendation;
}

// ─── User Preferences ──────────────────────────────────────────────

export interface UserPreferences {
  defaultDepositAmount: number;
  riskTolerance: RiskLevel;
}
