"use client";

import { PlusCircle } from "lucide-react";
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
  return (
    <section className="bg-[#1e293b] rounded-xl p-6 shadow-sm border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-[#137fec]/10 flex items-center justify-center text-[#137fec] font-bold">
            3
          </div>
          <h2 className="text-xl font-bold text-white">투자 원칙 설정</h2>
        </div>
        <button
          onClick={onReset}
          className="text-sm font-medium text-[#137fec] hover:text-[#137fec]/80"
        >
          기본값으로 초기화
        </button>
      </div>

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

      {/* Add Custom Rule Button */}
      <button className="flex items-center justify-center w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:text-[#137fec] hover:border-[#137fec] transition-all font-medium text-sm gap-2 group">
        <PlusCircle className="size-5 group-hover:scale-110 transition-transform" />
        사용자 정의 원칙 추가
      </button>
    </section>
  );
}
