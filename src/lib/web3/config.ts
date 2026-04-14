import { getDefaultConfig } from 'connectkit'
import { http } from 'viem'
import { xLayer } from 'viem/chains'
import { createConfig } from 'wagmi'

const xLayerTestnetCustom = {
  id: 1952,
  name: 'X Layer Testnet',
  nativeCurrency: { name: 'OKB', symbol: 'OKB', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testrpc.xlayer.tech/terigon'] },
  },
  blockExplorers: {
    default: {
      name: 'OKX Explorer',
      url: 'https://www.okx.com/web3/explorer/xlayer-test',
    },
  },
} as const

export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [xLayerTestnetCustom, xLayer],
    transports: {
      [xLayerTestnetCustom.id]: http(),
      [xLayer.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo_project_id',

    // Required App Info
    appName: 'LP Garden',
    appDescription: 'Agent-assisted liquidity management for X Layer',
    appUrl: 'https://lpgarden.com',
    appIcon: 'https://lpgarden.com/icon.png',

    // Disable Aave Account to remove errors and "Continue with Aave" option
    enableAaveAccount: false,
  }),
)
