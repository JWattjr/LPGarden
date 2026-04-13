"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectKitButton } from "connectkit";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/planner", label: "Planner" },
  { href: "/monitor", label: "Monitor" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-xl">🌿</span>
          <span className="text-lg font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors">
            LP Garden
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-accent bg-accent/10"
                    : "text-muted hover:text-foreground hover:bg-card-hover"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Wallet Connect */}
        <ConnectKitButton.Custom>
          {({ isConnected, show, address, ensName }) => {
            return (
              <button 
                onClick={show}
                className="flex items-center gap-2 rounded-xl border border-card-border bg-surface-1 px-4 py-2 text-sm text-foreground font-medium transition-all hover:bg-card-hover hover:border-accent/30 shadow-sm"
              >
                {isConnected ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    {ensName ?? (address ? `${address.slice(0,6)}...${address.slice(-4)}` : "Connected")}
                  </>
                ) : (
                  <>
                    Connect Wallet
                  </>
                )}
              </button>
            );
          }}
        </ConnectKitButton.Custom>
      </div>
    </nav>
  );
}
