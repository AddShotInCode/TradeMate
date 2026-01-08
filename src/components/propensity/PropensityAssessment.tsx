"use client";

import TradingStyleSelector from "./TradingStyleSelector";
import RiskAppetiteSlider from "./RiskAppetiteSlider";
import MaxLossInput from "./MaxLossInput";

interface PropensityAssessmentProps {
  tradingStyle: string;
  onTradingStyleChange: (value: string) => void;
  riskAppetite: number;
  onRiskAppetiteChange: (value: number) => void;
  maxLoss: string;
  onMaxLossChange: (value: string) => void;
}

export default function PropensityAssessment({
  tradingStyle,
  onTradingStyleChange,
  riskAppetite,
  onRiskAppetiteChange,
  maxLoss,
  onMaxLossChange,
}: PropensityAssessmentProps) {
  return (
    <section className="bg-[#1e293b] rounded-xl p-6 shadow-sm border border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-8 rounded-full bg-[#137fec]/10 flex items-center justify-center text-[#137fec] font-bold">
          1
        </div>
        <h2 className="text-xl font-bold text-white">투자 성향 분석</h2>
      </div>

      <TradingStyleSelector value={tradingStyle} onChange={onTradingStyleChange} />
      <RiskAppetiteSlider value={riskAppetite} onChange={onRiskAppetiteChange} />
      <MaxLossInput value={maxLoss} onChange={onMaxLossChange} />
    </section>
  );
}
