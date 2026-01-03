import { ClipboardCheck, TrendingUp, Timer, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat Card 1 - Adherence */}
      <Card className="flex flex-col gap-2 p-5 border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127]">
        <div className="flex justify-between items-start">
          <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium">원칙 준수율</p>
          <ClipboardCheck className="text-primary w-5 h-5" />
        </div>
        <div className="flex items-end gap-2 mt-1">
          <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">92%</p>
          <p className="text-emerald-500 text-sm font-medium mb-[2px]">+2.4%</p>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-3">
          <div className="bg-primary h-1.5 rounded-full" style={{ width: "92%" }}></div>
        </div>
      </Card>

      {/* Stat Card 2 - Win Rate */}
      <Card className="flex flex-col gap-2 p-5 border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127]">
        <div className="flex justify-between items-start">
          <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium">승률</p>
          <TrendingUp className="text-primary w-5 h-5" />
        </div>
        <div className="flex items-end gap-2 mt-1">
          <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">68%</p>
          <p className="text-emerald-500 text-sm font-medium mb-[2px]">+1.5%</p>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-3">
          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: "68%" }}></div>
        </div>
      </Card>

      {/* Stat Card 3 - Total Training */}
      <Card className="flex flex-col gap-2 p-5 border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127]">
        <div className="flex justify-between items-start">
          <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium">총 훈련 시간</p>
          <Timer className="text-primary w-5 h-5" />
        </div>
        <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none mt-1">14시간 30분</p>
        <p className="text-slate-500 dark:text-[#9dabb9] text-xs mt-3">이번 주</p>
      </Card>

      {/* Stat Card 4 - Impulse Protection */}
      <Card className="flex flex-col gap-2 p-5 border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127]">
        <div className="flex justify-between items-start">
          <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium">뇌동매매 방지</p>
          <Shield className="text-emerald-500 w-5 h-5" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <p className="text-slate-900 dark:text-white text-2xl font-bold leading-none">작동중</p>
        </div>
        <p className="text-slate-500 dark:text-[#9dabb9] text-xs mt-3">모니터링 중</p>
      </Card>
    </div>
  );
}
