"use client";

import { useState } from "react";
import LandingNavigation from "@/components/landing/LandingNavigation";
import LandingFooter from "@/components/landing/LandingFooter";
import PropensityAssessment from "@/components/propensity/PropensityAssessment";
import StrategyTemplates from "@/components/propensity/StrategyTemplates";
import PrinciplesCustomizer from "@/components/propensity/PrinciplesCustomizer";
import ActionBar from "@/components/propensity/ActionBar";

interface Principle {
  id: string;
  icon: "pie" | "newspaper" | "layers";
  title: string;
  description: string;
  hasInput?: boolean;
  inputValue?: string;
  inputUnit?: string;
  enabled: boolean;
  hasTooltip?: boolean;
  tooltipText?: string;
}

const defaultPrinciples: Principle[] = [
  {
    id: "max-risk",
    icon: "pie",
    title: "거래당 최대 위험",
    description: "연속 손실 시 계좌 보호를 위한 설정입니다.",
    hasInput: true,
    inputValue: "2.0",
    inputUnit: "%",
    enabled: true,
    hasTooltip: true,
    tooltipText: "단일 거래에 투자되는 계좌 자산의 비율입니다.",
  },
  {
    id: "no-news-trading",
    icon: "newspaper",
    title: "중요 뉴스 발표 시 거래 금지",
    description: "예측 불가능한 변동성 급등을 피합니다.",
    enabled: true,
  },
  {
    id: "max-positions",
    icon: "layers",
    title: "최대 동시 보유 포지션",
    description: "시장에 대한 노출을 제한합니다.",
    hasInput: true,
    inputValue: "3",
    enabled: false,
  },
];

export default function PropensityPage() {
  // Propensity Assessment State
  const [tradingStyle, setTradingStyle] = useState("daytrading");
  const [riskAppetite, setRiskAppetite] = useState(65);
  const [maxLoss, setMaxLoss] = useState("");

  // Strategy Template State
  const [selectedTemplate, setSelectedTemplate] = useState("trend-follower");

  // Principles State
  const [principles, setPrinciples] = useState(defaultPrinciples);

  const handleTogglePrinciple = (id: string) => {
    setPrinciples((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleUpdatePrincipleValue = (id: string, value: string) => {
    setPrinciples((prev) =>
      prev.map((p) => (p.id === id ? { ...p, inputValue: value } : p))
    );
  };

  const handleReset = () => {
    setPrinciples(defaultPrinciples);
  };

  const handleSaveDraft = () => {
    // TODO: Implement save draft logic
    console.log("Saving draft...", {
      tradingStyle,
      riskAppetite,
      maxLoss,
      selectedTemplate,
      principles,
    });
  };

  const handleSaveAndStart = () => {
    // TODO: Implement save and start training logic
    console.log("Saving and starting training...", {
      tradingStyle,
      riskAppetite,
      maxLoss,
      selectedTemplate,
      principles,
    });
  };

  const activePrinciplesCount = principles.filter((p) => p.enabled).length;

  return (
    <div className="min-h-screen bg-[#101922] text-white font-sans flex flex-col">
      {/* Navigation */}
      <LandingNavigation />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full px-4 sm:px-10 py-8">
        <div className="w-full max-w-[1024px] flex flex-col gap-8">
          {/* Page Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
              나만의 투자 스타일 정의하기
            </h1>
            <p className="text-[#9dabb9] text-base sm:text-lg font-normal leading-normal max-w-2xl">
              투자 스타일에 맞는 템플릿을 선택하고, 나만의 규칙으로 조정하세요.
              이를 통해 맞춤형 훈련 환경을 제공해 드립니다.
            </p>
          </div>

          {/* Content Grid: 2 Columns for larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Assessment (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <PropensityAssessment
                tradingStyle={tradingStyle}
                onTradingStyleChange={setTradingStyle}
                riskAppetite={riskAppetite}
                onRiskAppetiteChange={setRiskAppetite}
                maxLoss={maxLoss}
                onMaxLossChange={setMaxLoss}
              />
            </div>

            {/* Right Column: Templates & Rules (Span 7) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <StrategyTemplates
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
              <PrinciplesCustomizer
                principles={principles}
                onTogglePrinciple={handleTogglePrinciple}
                onUpdatePrincipleValue={handleUpdatePrincipleValue}
                onReset={handleReset}
              />
            </div>
          </div>

          {/* Footer / Action Bar */}
          <ActionBar
            activePrinciplesCount={activePrinciplesCount}
            onSaveDraft={handleSaveDraft}
            onSaveAndStart={handleSaveAndStart}
          />
        </div>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
