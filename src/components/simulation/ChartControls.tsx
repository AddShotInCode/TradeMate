"use client";

import { Play, FileText } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";
import { useState } from "react";
import FinancialStatementModal from "./FinancialStatementModal";

export default function ChartControls() {
  const { currentPrice, nextCandle, interval, setInterval, isFinished } =
    useSimulationStore();
  const intervals = ["1D", "1W", "1M"] as const;
  const [isStatementOpen, setIsStatementOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-2">
          <div className="flex bg-[#283039] rounded-lg p-1">
            {intervals.map((int) => (
              <button
                key={int}
                onClick={() => setInterval(int)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${int === interval ? "text-white bg-[#101922] shadow-sm" : "text-slate-400 hover:text-white"}`}
              >
                {int}
              </button>
            ))}
          </div>
          <div className="h-6 w-px bg-[#3b4754] mx-2"></div>
          <div className="flex items-center gap-2 text-white">
            <span className="font-bold text-xl">
              ₩{Math.round(currentPrice).toLocaleString("ko-KR")}
            </span>
            <span className="text-sm text-slate-400 font-mono">Vol: 1.2M</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStatementOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#283039] hover:bg-[#3b4754] text-slate-300 hover:text-white text-sm font-medium rounded-lg border border-[#3b4754] transition-colors"
          >
            <FileText className="w-4 h-4" />
            재무제표
          </button>
          <div className="h-6 w-px bg-[#3b4754] mx-2"></div>
          <button
            onClick={nextCandle}
            disabled={isFinished}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-lg shadow-lg transition-all ${isFinished ? "bg-gray-600 cursor-not-allowed opacity-50" : "bg-[#137fec] hover:bg-blue-600 text-white shadow-blue-500/20"}`}
          >
            다음 캔들
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      <FinancialStatementModal isOpen={isStatementOpen} onClose={() => setIsStatementOpen(false)} />
    </>
  );
}
