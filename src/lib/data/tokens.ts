import { Token } from "@/lib/types";

export const TOKENS: Record<string, Token> = {
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    icon: "https://assets.coingecko.com/coins/images/6319/small/usdc.png",
  },
  WBTC: {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    decimals: 8,
    icon: "https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png",
  },
  OKB: {
    symbol: "OKB",
    name: "OKB",
    decimals: 18,
    icon: "https://assets.coingecko.com/coins/images/4463/small/WeChat_Image_20220118095654.png",
  },
  PEPE: {
    symbol: "PEPE",
    name: "Pepe",
    decimals: 18,
    icon: "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
  },
};
