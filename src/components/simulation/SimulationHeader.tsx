"use client";

import { Timer, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export default function SimulationHeader() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timeString = formatTime(seconds);

  return (
    <header className="h-16 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#283039] bg-white dark:bg-[#101922] px-6 shrink-0 z-30">
      <div className="flex items-center gap-4">
        <h2 className="text-slate-600 dark:text-slate-300 text-sm font-medium">세션 #42 - 블라인드 시뮬레이션</h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1c252e] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#3b4754]">
          <Timer className="w-5 h-5 text-slate-500" />
          <div className="flex items-center gap-1 font-mono text-sm font-bold text-slate-700 dark:text-white">
            <span>{timeString.split(':')[0]}</span>:
            <span>{timeString.split(':')[1]}</span>:
            <span>{timeString.split(':')[2]}</span>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          세션 종료
        </button>
      </div>
    </header>
  );
}
