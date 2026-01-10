"use client";

import { TrendingUp, CandlestickChart, Check } from "lucide-react";

interface StrategyTemplateCardProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
  icon: "trending" | "candle";
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function StrategyTemplateCard({
  id,
  title,
  description,
  tags,
  icon,
  isSelected,
  onSelect,
}: StrategyTemplateCardProps) {
  const IconComponent = icon === "trending" ? TrendingUp : CandlestickChart;
  const iconColor = icon === "trending" ? "text-[#137fec]" : "text-orange-500";
  const iconBg = icon === "trending" ? "bg-[#137fec]/20" : "bg-orange-500/20";

  return (
    <div
      onClick={() => onSelect(id)}
      className={`group relative cursor-pointer bg-[#1e293b] rounded-xl p-5 transition-all ${
        isSelected
          ? "border-2 border-[#137fec] shadow-[0_0_0_4px_rgba(19,127,236,0.1)]"
          : "border border-slate-800 hover:border-[#137fec]/50"
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 text-[#137fec]">
          <Check className="size-6" />
        </div>
      )}
      <div className={`size-10 rounded-lg ${iconBg} flex items-center justify-center ${iconColor} mb-3`}>
        <IconComponent className="size-5" />
      </div>
      <h3 className="text-base font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400 mt-1 mb-3">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
