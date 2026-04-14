"use client";

import { CognitiveRationale } from "@/lib/types";
import { useState } from "react";

interface CognitiveLogProps {
  cognitive?: CognitiveRationale;
  isLoading?: boolean;
}

export function CognitiveLog({ cognitive, isLoading }: CognitiveLogProps) {
  const [activeStep, setActiveStep] = useState(0);

  // If loading, show simulated thinking steps
  if (isLoading || !cognitive) {
    const loadingSteps = [
      { title: "Scanning", type: "scanning", content: "Initializing market scanner and fetching real-time liquidity depth from DeFiLlama..." },
      { title: "Simulating", type: "simulating", content: "Running 30-day scenario stress tests across Favorable, Neutral, and Adverse volatility regimes..." },
      { title: "Deciding", type: "deciding", content: "Calculated optimal fee yield vs impermanent loss risk. Finalizing agentic rationale..." }
    ];

    return (
      <div className="bg-card/50 border border-accent/20 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_0_40px_rgba(52,211,153,0.05)] opacity-70">
        <div className="bg-accent/5 px-4 py-3 border-b border-accent/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-accent/80">
              Agent Thinking Process
            </span>
          </div>
          <span className="text-[10px] font-mono text-accent/40 animate-pulse">PROCESSING...</span>
        </div>
        
        <div className="p-0">
          <div className="flex border-b border-card-border/20">
            {loadingSteps.map((step, idx) => (
              <div key={idx} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-tighter text-muted text-center opacity-40">
                {step.title}
              </div>
            ))}
          </div>

          <div className="p-6 min-h-[160px] flex flex-col justify-center items-center text-center">
             <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
             <p className="text-xs text-foreground/60 italic animate-pulse">
               "Agent is currently analyzing live liquidity vectors..."
             </p>
          </div>
        </div>
      </div>
    );
  }

  // Active step should default to the last one when data arrives
  const currentStep = activeStep < cognitive.steps.length ? activeStep : cognitive.steps.length - 1;

  const icons = {
    scanning: "🔍",
    simulating: "🧪",
    deciding: "⚖️"
  };

  return (
    <div className="bg-card/50 border border-accent/20 rounded-2xl overflow-hidden backdrop-blur-sm shadow-[0_0_40px_rgba(52,211,153,0.05)]">
      <div className="bg-accent/5 px-4 py-3 border-b border-accent/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-accent/80">
            Agent Thinking Process
          </span>
        </div>
        <span className="text-[10px] font-mono text-accent/40">ENGINE: HAIKU-AGENT-V1</span>
      </div>
      
      <div className="p-0">
        {/* Steps Navigation */}
        <div className="flex border-b border-card-border/20">
          {cognitive.steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-tighter transition-colors ${
                activeStep === idx 
                  ? "bg-accent/10 text-accent border-b-2 border-accent" 
                  : "text-muted hover:bg-surface-2/50"
              }`}
            >
              {icons[step.type]} {step.title}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="p-6 min-h-[160px] animate-in fade-in duration-500">
           <div className="mb-4">
             <h4 className="text-[10px] font-bold text-muted uppercase tracking-wider mb-2">Step {currentStep + 1} Output</h4>
             <p className="text-sm text-foreground/90 leading-relaxed font-light italic">
               "{cognitive.steps[currentStep].content}"
             </p>
           </div>
           
           {currentStep === cognitive.steps.length - 1 && (
             <div className="pt-4 border-t border-card-border/40 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-2/40 p-3 rounded-xl border border-card-border/30">
                    <h4 className="text-[10px] font-bold text-risk-high/70 uppercase tracking-wider mb-1">Final Risk</h4>
                    <p className="text-[11px] text-foreground/70">{cognitive.riskAssessment}</p>
                  </div>
                  <div className="bg-surface-2/40 p-3 rounded-xl border border-card-border/30">
                    <h4 className="text-[10px] font-bold text-accent/70 uppercase tracking-wider mb-1">Context</h4>
                    <p className="text-[11px] text-foreground/70">{cognitive.marketContext}</p>
                  </div>
                </div>
                
                <div className="bg-accent/5 p-4 rounded-xl border border-accent/10">
                   <p className="text-sm font-semibold text-accent leading-snug">
                     <span className="mr-2">🏁</span>
                     {cognitive.verdict}
                   </p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
