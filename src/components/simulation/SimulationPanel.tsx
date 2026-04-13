import { ScenarioSimulation } from "@/lib/types";
import { ScenarioCard } from "./ScenarioCard";

interface SimulationPanelProps {
  simulation: ScenarioSimulation;
}

export function SimulationPanel({ simulation }: SimulationPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold">30-Day Scenario Simulation</h3>
        <p className="text-sm text-muted mt-1">
          Based on a simulated deposit of ${simulation.depositAmount.toLocaleString()}. Modeling outcomes based on the token's historical volatility pattern over a 30-day projection window.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {simulation.scenarios.map((scenario) => (
          <ScenarioCard key={scenario.type} outcome={scenario} />
        ))}
      </div>
    </div>
  );
}
