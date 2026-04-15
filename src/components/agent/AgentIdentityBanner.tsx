'use client'

import { getAgentIdentity } from '@/lib/agent/identity'
import { Shield, Cpu, ExternalLink } from 'lucide-react'

export function AgentIdentityBanner() {
  const identity = getAgentIdentity()
  const isPending = identity.evmAddress.includes('[PENDING]')

  return (
    <div className="w-full relative overflow-hidden bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-transparent border border-indigo-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Background Micro-animation simulation */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />

      <div className="flex items-center gap-4 z-10">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
          <Cpu className="w-6 h-6 text-indigo-400 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-indigo-300 font-mono tracking-wide uppercase">
              Official Agentic Identity
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              TEE SECURED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span className="font-mono text-indigo-300/70">
              Address: {identity.evmAddress}
            </span>
            {isPending && (
              <span className="animate-pulse text-risk-medium">
                (Pending Registry...)
              </span>
            )}
            {!isPending && (
              <a 
                href={`https://www.okx.com/explorer/xlayer/address/${identity.evmAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 pr-2 z-10">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">
            Powered By
          </p>
          <p className="text-xs font-semibold text-indigo-300">
            OKX Onchain OS
          </p>
        </div>
        <div className="h-8 w-[1px] bg-slate-800 hidden sm:block" />
        <div className="flex -space-x-2">
           <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center backdrop-blur-sm">
             <span className="text-[10px] font-bold">U</span>
           </div>
           <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm translate-x-1">
             <span className="text-[10px] font-bold">X</span>
           </div>
        </div>
      </div>
    </div>
  )
}
