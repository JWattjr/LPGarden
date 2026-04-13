import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
  children: React.ReactNode;
}

export function Badge({ variant = "default", className = "", children, ...props }: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors";
  
  const variants = {
    default: "bg-surface-2 text-foreground",
    success: "bg-risk-low/10 text-risk-low border border-risk-low/20",
    warning: "bg-risk-medium/10 text-risk-medium border border-risk-medium/20",
    danger: "bg-risk-high/10 text-risk-high border border-risk-high/20",
    outline: "text-foreground border border-card-border",
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
