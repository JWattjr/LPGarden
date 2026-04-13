"use client";

import React, { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider } from "connectkit";
import { wagmiConfig } from "./config";

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider 
          mode="dark"
          customTheme={{
            "--ck-font-family": "var(--font-inter), sans-serif",
            "--ck-border-radius": "1rem",
            "--ck-overlay-background": "rgba(7, 8, 12, 0.8)",
            "--ck-body-background": "#0d0f17",
            "--ck-body-color": "#f0f2f5",
            "--ck-body-color-muted": "#94a3b8",
            "--ck-primary-button-background": "rgba(52, 211, 153, 0.1)",
            "--ck-primary-button-hover-background": "rgba(52, 211, 153, 0.2)",
            "--ck-primary-button-color": "#34d399",
            "--ck-secondary-button-background": "#111320",
            "--ck-secondary-button-hover-background": "#161929",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
