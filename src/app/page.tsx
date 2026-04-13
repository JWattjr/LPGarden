import PageShell from "@/components/layout/PageShell";
import Hero from "@/components/landing/Hero";
import FeatureCards from "@/components/landing/FeatureCards";
import HowItWorks from "@/components/landing/HowItWorks";

export default function Home() {
  return (
    <PageShell className="flex flex-col items-center">
      <Hero />
      <FeatureCards />
      <HowItWorks />
    </PageShell>
  );
}
