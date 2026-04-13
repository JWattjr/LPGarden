import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}

export function Card({ children, className = "", hoverable = false, ...props }: CardProps) {
  const hoverClasses = hoverable 
    ? "hover:border-accent/30 hover:bg-card-hover hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1" 
    : "";

  return (
    <div 
      className={`rounded-2xl border border-card-border bg-card transition-all ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
