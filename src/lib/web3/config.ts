import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { xLayer, xLayerTestnet } from "wagmi/chains";

export const wagmiConfig = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [xLayerTestnet, xLayer],
    transports: {
      [xLayerTestnet.id]: http(),
      [xLayer.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo_project_id",

    // Required App Info
    appName: "LP Garden",
    appDescription: "Agent-assisted liquidity management for X Layer",
    appUrl: "https://lpgarden.com", 
    appIcon: "https://lpgarden.com/icon.png", 
  })
);
