"use client";

interface RiskAppetiteSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const riskLabels = ["매우 보수적", "보수적", "보통", "적극적", "매우 적극적"];

function getRiskLabel(value: number): string {
  if (value <= 20) return riskLabels[0];
  if (value <= 40) return riskLabels[1];
  if (value <= 60) return riskLabels[2];
  if (value <= 80) return riskLabels[3];
  return riskLabels[4];
}

export default function RiskAppetiteSlider({ value, onChange }: RiskAppetiteSliderProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-slate-300">위험 성향</label>
        <span className="text-xs font-bold text-[#137fec] bg-[#137fec]/10 px-2 py-0.5 rounded">
          {getRiskLabel(value)}
        </span>
      </div>
      <div className="relative h-2 w-full bg-slate-700 rounded-full mt-4">
        <div className="absolute h-full bg-[#137fec] rounded-full" style={{ width: `${value}%` }} />
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute size-5 bg-white border-2 border-[#137fec] rounded-full top-1/2 -translate-y-1/2 shadow pointer-events-none"
          style={{ left: `calc(${value}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between mt-3 mb-4">
        <span className="text-xs text-slate-400">보수적</span>
        <span className="text-xs text-slate-400">적극적</span>
      </div>
    </div>
  );
}
