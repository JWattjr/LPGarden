import { Badge } from "@/components/ui/Badge";
import { ActionType } from "@/lib/types";

interface ActionBadgeProps {
  action: ActionType;
  className?: string;
}

export function ActionBadge({ action, className = "" }: ActionBadgeProps) {
  const config = {
    deploy: { variant: "success" as const, label: "Deploy Liquidity", icon: "🚀" },
    wait: { variant: "warning" as const, label: "Wait", icon: "⏳" },
    widen: { variant: "outline" as const, label: "Widen Range", icon: "↔️" },
    rebalance: { variant: "warning" as const, label: "Rebalance", icon: "⚖️" },
    exit: { variant: "danger" as const, label: "Exit Position", icon: "🚪" },
  };

  const { variant, label, icon } = config[action];

  return (
    <Badge variant={variant} className={`gap-1.5 ${className}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </Badge>
  );
}
