"use client";

const STEPS = [
  {
    step: "01",
    title: "Select Pool",
    description: "Choose an X Layer pair you want to provide liquidity for.",
  },
  {
    step: "02",
    title: "Review Strategy",
    description: "Our engine suggests a range and simulates the exact impermanent loss risk.",
  },
  {
    step: "03",
    title: "Take Action",
    description: "Deploy your liquidity with confidence, or wait if conditions are poor.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 border-t border-card-border mt-10">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tight mb-4">How it works</h2>
        <p className="text-muted text-lg max-w-xl mx-auto">
          A seamless flow designed to protect your capital and maximize fee generation.
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-card-border -z-10" />

          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative">
              <div className="h-12 w-12 rounded-full bg-card border border-accent/40 text-accent font-mono font-bold flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(52,211,153,0.15)] ring-4 ring-background">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted text-sm max-w-[250px]">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
