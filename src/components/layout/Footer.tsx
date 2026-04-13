export default function Footer() {
  return (
    <footer className="border-t border-card-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <span>🌿</span>
          <span>LP Garden</span>
          <span className="text-card-border">·</span>
          <span>Built on X Layer</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted/60">
          <span>Live Prices (DeFiLlama) · Onchain Strategy Registry</span>
        </div>
      </div>
    </footer>
  );
}
