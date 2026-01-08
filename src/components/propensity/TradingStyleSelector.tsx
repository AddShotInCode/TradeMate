"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";

const tradingStyles = [
  { id: "scalping", label: "스캘핑" },
  { id: "daytrading", label: "데이트레이딩" },
  { id: "swing", label: "스윙" },
];

const styleDescriptions = {
  scalping: {
    title: "스캘핑 (Scalping)",
    description: "초단타 매매로, 몇 초~몇 분 내에 소액의 이익을 반복적으로 취하는 전략입니다. 빠른 판단력과 집중력이 필요합니다.",
  },
  daytrading: {
    title: "데이트레이딩 (Day Trading)",
    description: "하루 내에 매수와 매도를 완료하는 전략입니다. 장 중 추세와 변동성을 활용하며, 약간의 인내심이 필요합니다.",
  },
  swing: {
    title: "스윙 (Swing Trading)",
    description: "몇 일~몇 주간 포지션을 보유하는 전략입니다. 중기적인 추세를 포착하며, 잦은 모니터링이 필요하지 않습니다.",
  },
};

interface TradingStyleSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TradingStyleSelector({ value, onChange }: TradingStyleSelectorProps) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <label className="text-sm font-medium text-slate-300">
          주요 투자 스타일
        </label>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="size-5 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          type="button"
        >
          <HelpCircle className="size-3.5" />
        </button>
      </div>

      {/* Help Dialog */}
      {showHelp && (
        <div className="mb-4 p-4 bg-[#111418] border border-slate-700 rounded-lg relative">
          <button
            onClick={() => setShowHelp(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-white"
            type="button"
          >
            <X className="size-4" />
          </button>
          <div className="space-y-3 pr-6">
            {Object.entries(styleDescriptions).map(([key, info]) => (
              <div key={key}>
                <h4 className="text-sm font-bold text-white">{info.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex bg-[#111418] p-1 rounded-lg">
        {tradingStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onChange(style.id)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
              value === style.id
                ? "bg-[#1e293b] text-[#137fec] shadow-sm ring-1 ring-white/10"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
}
