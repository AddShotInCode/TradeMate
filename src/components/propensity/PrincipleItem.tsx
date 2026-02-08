"use client";

import { Info, PieChart, Newspaper, Layers, LucideIcon } from "lucide-react";

interface PrincipleItemProps {
  icon: "pie" | "newspaper" | "layers";
  title: string;
  description: string;
  hasInput?: boolean;
  inputValue?: string;
  inputUnit?: string;
  onInputChange?: (value: string) => void;
  enabled: boolean;
  onToggle: () => void;
  hasTooltip?: boolean;
  tooltipText?: string;
}

const iconMap: Record<string, LucideIcon> = {
  pie: PieChart,
  newspaper: Newspaper,
  layers: Layers,
};

export default function PrincipleItem({
  icon,
  title,
  description,
  hasInput,
  inputValue,
  inputUnit,
  onInputChange,
  enabled,
  onToggle,
  hasTooltip,
  tooltipText,
}: PrincipleItemProps) {
  const IconComponent = iconMap[icon];

  return (
    <div
      className={`flex items-start sm:items-center gap-4 p-4 rounded-lg bg-[#111418] border border-slate-700 ${
        !enabled ? "opacity-60" : ""
      }`}
    >
      <div className="text-slate-400 mt-1 sm:mt-0">
        <IconComponent className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-white">{title}</h4>
          {hasTooltip && (
            <span className="cursor-help" title={tooltipText}>
              <Info className="size-4 text-slate-500" />
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        {hasInput && (
          <div className="flex items-center relative">
            <input
              type="text"
              inputMode="numeric"
              value={inputValue}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9.]/g, "");
                onInputChange?.(numericValue);
              }}
              disabled={!enabled}
              className={`w-16 py-1 px-2 text-right border border-slate-600 rounded text-sm font-medium focus:ring-1 focus:ring-[#137fec] focus:border-[#137fec] ${
                enabled ? "bg-slate-800 text-white" : "bg-slate-900 text-slate-500"
              }`}
            />
            {inputUnit && <span className="ml-1 text-sm text-slate-500">{inputUnit}</span>}
          </div>
        )}
        {/* Toggle Switch */}
        <button
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            enabled ? "bg-[#137fec]" : "bg-slate-700"
          }`}
        >
          <span
            className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              enabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
