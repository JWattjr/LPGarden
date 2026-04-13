/**
 * Number formatting utilities for LP Garden
 */

export function formatUSD(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  if (value < 0.01 && value > 0) {
    return `$${value.toExponential(2)}`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  if (price >= 0.01) return price.toFixed(4);
  if (price >= 0.000001) return price.toFixed(8);
  
  // For extremely small tokens (PEPE), show up to 10 decimals cleanly without tailing zeros
  return price.toFixed(10).replace(/0+$/, '').replace(/\.$/, '');
}

export function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

export function formatAPR(value: number): string {
  return `${value.toFixed(1)}%`;
}
