"use client";

import { useState } from "react";
import { LineChart, CandlestickChart } from "lucide-react";

const timeRanges = ["1D", "1W", "1M", "3M", "1Y"];

export default function StockChart() {
  const [selectedRange, setSelectedRange] = useState("1M");
  const [chartType, setChartType] = useState<"line" | "candle">("line");

  return (
    <div className="bg-[#1e293b] rounded-xl border border-[#334155] p-1 shadow-sm">
      {/* Chart Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#334155]/50">
        <div className="flex gap-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                selectedRange === range
                  ? "bg-[#137fec]/10 text-[#137fec]"
                  : "hover:bg-slate-700 text-slate-400"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("line")}
            className={`p-1.5 rounded transition-colors ${
              chartType === "line"
                ? "text-[#137fec] bg-[#137fec]/10"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            <LineChart className="size-5" />
          </button>
          <button
            onClick={() => setChartType("candle")}
            className={`p-1.5 rounded transition-colors ${
              chartType === "candle"
                ? "text-[#137fec] bg-[#137fec]/10"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            <CandlestickChart className="size-5" />
          </button>
        </div>
      </div>

      {/* Chart Visual */}
      <div className="relative h-[300px] sm:h-[400px] w-full bg-[#151c24] rounded-b-lg overflow-hidden flex items-end">
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`border-slate-800/50 ${
                (i + 1) % 6 !== 0 ? "border-r" : ""
              } ${i < 18 ? "border-b" : ""}`}
            />
          ))}
        </div>

        {/* Abstract Chart Path */}
        <svg
          className="absolute inset-0 w-full h-full p-4"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Area fill */}
          <path
            d="M0,100 L0,70 Q10,65 20,75 T40,60 T60,50 T80,30 T100,20 L100,100 Z"
            fill="url(#gradient)"
            opacity="0.2"
          />
          {/* Line */}
          <path
            d="M0,70 Q10,65 20,75 T40,60 T60,50 T80,30 T100,20"
            fill="none"
            stroke="#137fec"
            strokeWidth="0.5"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#137fec", stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: "#137fec", stopOpacity: 0 }} />
            </linearGradient>
          </defs>
        </svg>

        {/* Volume Bars */}
        <div className="flex items-end justify-between w-full h-24 px-4 pb-2 absolute bottom-0 gap-1 opacity-40">
          {[30, 45, 20, 60, 50, 35, 40, 25, 70, 55, 30, 45].map((height, i) => (
            <div
              key={i}
              className={`w-full ${
                [2, 5, 10].includes(i)
                  ? "bg-red-500"
                  : [0, 7].includes(i)
                    ? "bg-slate-500"
                    : "bg-green-500"
              }`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
