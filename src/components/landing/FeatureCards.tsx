"use client";

const FEATURES = [
  {
    title: "Smarter Ranges",
    description: "Our agent analyzes token volatility and recommends optimal concentration ranges for max fee yield.",
    icon: "🎯",
  },
  {
    title: "Scenario Simulation",
    description: "See exactly what happens to your position if price moves up, down, or stays sideways.",
    icon: "🔮",
  },
  {
    title: "Actionable Insights",
    description: "Don't guess what to do next. Get clear recommendations to wait, deploy, rebalance, or exit.",
    icon: "⚡",
  },
];

export default function FeatureCards() {
  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {FEATURES.map((feature, i) => (
          <div 
            key={i}
            className={`animate-fade-in-up-delay-${i + 1} p-6 rounded-2xl bg-card border border-card-border hover:border-accent/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5 group`}
          >
            <div className="h-12 w-12 rounded-xl bg-surface-2 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-accent/10 transition-all">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {feature.title}
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
