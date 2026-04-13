import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PlannerProvider } from "@/lib/context/PlannerContext";
import { Web3Provider } from "@/lib/web3/Web3Provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LP Garden — Smart Liquidity Management for X Layer",
  description:
    "Agent-assisted Uniswap liquidity management. Choose better LP ranges, understand risk, simulate outcomes, and know when to rebalance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className={`${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased dark`}
      >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Web3Provider>
          <PlannerProvider>
            <Navbar />
            {children}
            <Footer />
          </PlannerProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
