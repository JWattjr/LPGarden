"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background glow effects */}
      <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-accent/20 opacity-20 blur-[100px]" />
      
      <div className="mx-auto max-w-4xl text-center">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            Live on X Layer Testnet
          </span>
        </div>
        
        <h1 className="animate-fade-in-up-delay-1 mt-6 text-5xl font-bold tracking-tight sm:text-7xl">
          Liquidity provision, <br />
          <span className="text-accent underline decoration-accent/40 underline-offset-8">
            managed by AI agents.
          </span>
        </h1>
        
        <p className="animate-fade-in-up-delay-2 mt-6 text-lg tracking-tight text-muted sm:text-xl max-w-2xl mx-auto">
          Choose better LP ranges, understand your risk, simulate outcomes, and know exactly when to rebalance. Stop guessing and start planning.
        </p>
        
        <div className="animate-fade-in-up-delay-3 mt-10 flex items-center justify-center gap-4">
          <Link
            href="/planner"
            className="rounded-xl bg-accent px-8 py-4 text-sm font-bold text-background transition-all hover:bg-accent-dim hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] uppercase tracking-wider"
          >
            Launch App
          </Link>
          <Link
            href="/monitor"
            className="rounded-xl border border-card-border bg-card px-8 py-4 text-sm font-semibold text-foreground transition-all hover:bg-card-hover hover:border-accent/30"
          >
            View Demo Positions
          </Link>
        </div>

        {/* Powered By Ecosystem Strip */}
        <div className="mt-20 pt-10 border-t border-card-border/50 animate-fade-in-up-delay-3">
          <p className="text-xs text-muted mb-6 uppercase tracking-widest font-semibold">Integrations & Infrastructure</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale contrast-200">
            {/* Using text blocks since we don't have SVGs downloaded */}
            <div className="font-bold text-xl tracking-tight">X Layer</div>
            <div className="font-bold text-xl tracking-tighter">Uniswap V3</div>
            <div className="font-bold text-xl tracking-tight text-[#00E676]">DeFiLlama</div>
            <div className="font-bold text-xl tracking-widest">OKX API</div>
          </div>
        </div>
      </div>
    </section>
  );
}
