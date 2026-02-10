import LandingNavigation from "@/components/landing/LandingNavigation";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import CTASection from "@/components/landing/CTASection";
import LandingFooter from "@/components/landing/LandingFooter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TradeMate - 원칙 중심의 주식 매매 훈련 플랫폼",
  description:
    "시장을 정복하고, 나 자신을 정복하라. 충동적인 매매를 차단하고 원칙 준수를 평가하는 주식 매매 훈련 플랫폼. 손익이 아닌 원칙 준수를 점수화하는 트레이딩 시뮬레이션.",
  openGraph: {
    title: "TradeMate - 원칙 중심의 주식 매매 훈련 플랫폼",
    description: "시장을 정복하고, 나 자신을 정복하라. 충동적인 매매를 차단하고 원칙 준수를 평가합니다.",
  },
};

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
