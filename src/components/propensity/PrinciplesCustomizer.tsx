"use client";

import PrincipleItem from "./PrincipleItem";

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

interface PrinciplesCustomizerProps {
  principles: Principle[];
  onTogglePrinciple: (id: string) => void;
  onUpdatePrincipleValue: (id: string, value: string) => void;
  onReset: () => void;
}

export default function PrinciplesCustomizer({
  principles,
  onTogglePrinciple,
  onUpdatePrincipleValue,
  onReset,
}: PrinciplesCustomizerProps) {
  const totalWeight = principles.reduce(
    (sum, p) => sum + (p.enabled ? (Number(p.inputValue) || 0) : 0),
    0
  );

  return (
    <section className="bg-[#1e293b] rounded-xl p-6 shadow-sm border border-slate-800 flex flex-col gap-4 w-full max-w-[880px] mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">평가 항목 비중 설정</h2>
        </div>
        <div className="flex items-center gap-3">
          <p className={totalWeight === 100 ? "text-xs font-bold text-green-400" : "text-xs font-bold text-rose-400"}>
            합계: {totalWeight}%
          </p>
          <button
            onClick={onReset}
            className="text-sm font-medium text-[#137fec] hover:text-[#137fec]/80"
          >
            기본값으로 초기화
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-400">
        총 평가 점수는 원칙 준수(Compliance), 가설 적중(Validity), 성과(Performance)를 종합하여 계산됩니다.
      </p>

      {principles.map((principle) => (
        <PrincipleItem
          key={principle.id}
          icon={principle.icon}
          title={principle.title}
          description={principle.description}
          hasInput={principle.hasInput}
          inputValue={principle.inputValue}
          inputUnit={principle.inputUnit}
          onInputChange={(value) => onUpdatePrincipleValue(principle.id, value)}
          enabled={principle.enabled}
          onToggle={() => onTogglePrinciple(principle.id)}
          hasTooltip={principle.hasTooltip}
          tooltipText={principle.tooltipText}
        />
      ))}
    </section>
  );
}
