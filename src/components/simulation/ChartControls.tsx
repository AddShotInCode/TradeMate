"use client";

import { Rewind, Play, Pause } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";
import { useState } from "react";

export default function ChartControls() {
  const { currentPrice, nextCandle, prevCandle } = useSimulationStore();
  const intervals = ['1D', '1W', '1M', '3M', '1Y'];
  const [selectedInterval, setSelectedInterval] = useState('1D'); // Local state for UI only

  return (
    <div className="flex items-center justify-between mb-4 z-10">
      <div className="flex items-center gap-2">
        <div className="flex bg-[#283039] rounded-lg p-1">
          {intervals.map((interval) => (
             <button 
                key={interval}
                onClick={() => setSelectedInterval(interval)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${interval === selectedInterval ? 'text-white bg-[#101922] shadow-sm' : 'text-slate-400 hover:text-white'}`}
             >
                {interval}
             </button>
          ))}
        </div>
        <div className="h-6 w-px bg-[#3b4754] mx-2"></div>
        <div className="flex items-center gap-2 text-white">
          <span className="font-bold text-xl">₩{Math.round(currentPrice).toLocaleString('ko-KR')}</span>
          <span className="text-sm text-slate-400 font-mono">Vol: 1.2M</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={prevCandle}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#283039] hover:bg-[#3b4754] text-white text-sm font-medium rounded-lg border border-[#3b4754] transition-colors"
        >
          <Rewind className="w-4 h-4" />
          이전
        </button>
        <button 
          onClick={nextCandle}
          className="flex items-center gap-2 px-4 py-1.5 bg-[#137fec] hover:bg-blue-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-all"
        >
          다음 캔들
          <Play className="w-4 h-4 fill-current" />
        </button>
      </div>
    </div>
  );
}
