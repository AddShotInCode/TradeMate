"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PropensityAssessment from "@/components/propensity/PropensityAssessment";
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
    id: "score-compliance",
    icon: "pie",
    title: "원칙 준수 (Compliance) 비중",
    description: "SL/TP 이탈 여부 및 편차에 따른 감점을 반영합니다.",
    hasInput: true,
    inputValue: "40",
    inputUnit: "%",
    enabled: true,
    hasTooltip: true,
    tooltipText: "SL/TP 준수 여부를 점수에 얼마나 반영할지 결정합니다.",
  },
  {
    id: "score-validity",
    icon: "newspaper",
    title: "가설 적중 (Validity) 비중",
    description: "진입 후 지표가 가설대로 움직였는지 평가합니다.",
    hasInput: true,
    inputValue: "40",
    inputUnit: "%",
    enabled: true,
  },
  {
    id: "score-performance",
    icon: "layers",
    title: "성과 (Performance) 비중",
    description: "실제 수익률과 예상 상승률(Expected ROI)의 일치도를 평가합니다.",
    hasInput: true,
    inputValue: "20",
    inputUnit: "%",
    enabled: true,
  },
];

export default function PropensityPage() {
  // Strategy inputs for scoring
  const [stopLossPct, setStopLossPct] = useState("2.0");
  const [takeProfitPct, setTakeProfitPct] = useState("4.0");
  const [expectedRoiPct, setExpectedRoiPct] = useState("3.0");
  const [indicators, setIndicators] = useState([
    { name: "RSI", weight: "40" },
    { name: "Volume", weight: "30" },
    { name: "MA", weight: "30" },
  ]);

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
      stopLossPct,
      takeProfitPct,
      expectedRoiPct,
      indicators,
      principles,
    });
  };

  const handleSaveAndStart = () => {
    // TODO: Implement save and start training logic
    console.log("Saving and starting training...", {
      stopLossPct,
      takeProfitPct,
      expectedRoiPct,
      indicators,
      principles,
    });
  };

  const activePrinciplesCount = principles.filter((p) => p.enabled).length;

  return (
    <div className="relative flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] overflow-hidden">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto w-full">
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-8">
          {/* Page Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
              나만의 투자 스타일 정의하기
            </h1>
            <p className="text-slate-600 dark:text-[#9dabb9] text-base sm:text-lg font-normal leading-normal max-w-2xl">
              투자 스타일에 맞는 템플릿을 선택하고, 나만의 규칙으로 조정하세요.
              이를 통해 맞춤형 훈련 환경을 제공해 드립니다.
            </p>
          </div>

          {/* Content Grid: 2 Columns for larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Assessment (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <PropensityAssessment
                stopLossPct={stopLossPct}
                onStopLossPctChange={setStopLossPct}
                takeProfitPct={takeProfitPct}
                onTakeProfitPctChange={setTakeProfitPct}
                expectedRoiPct={expectedRoiPct}
                onExpectedRoiPctChange={setExpectedRoiPct}
                indicators={indicators}
                onIndicatorChange={(index, next) =>
                  setIndicators((prev) => prev.map((item, i) => (i === index ? next : item)))
                }
              />
            </div>

            {/* Right Column: Templates & Rules (Span 7) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
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
    </div>
  );
}
