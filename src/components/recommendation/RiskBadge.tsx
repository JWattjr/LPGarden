import { Badge } from "@/components/ui/Badge";
import { RiskLevel } from "@/lib/types";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

export function RiskBadge({ level, className = "" }: RiskBadgeProps) {
  const config = {
    low: { variant: "success" as const, label: "Low Risk" },
    medium: { variant: "warning" as const, label: "Medium Risk" },
    high: { variant: "danger" as const, label: "High Risk" },
  };

  const { variant, label } = config[level];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
}
