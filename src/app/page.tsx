import LandingNavigation from "@/components/landing/LandingNavigation";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#101922] text-white font-sans overflow-x-hidden antialiased selection:bg-[#137fec]/30 selection:text-white">
      <LandingNavigation />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <WorkflowSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
