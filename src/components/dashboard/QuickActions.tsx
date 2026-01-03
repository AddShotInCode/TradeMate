import { Play, Edit, BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  return (
    <div className="flex flex-col gap-6">
      {/* CTA Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-primary to-blue-600 p-6 shadow-lg shadow-blue-500/20 text-white">
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <h2 className="relative text-2xl font-black leading-tight mb-2">훈련 준비 되셨나요?</h2>
        <p className="relative text-blue-100 text-sm mb-6">새로운 시뮬레이션을 시작하여 전략을 테스트해보세요.</p>
        <Button className="relative w-full gap-2 bg-white text-primary font-bold hover:bg-blue-50 shadow-sm">
          <Play className="w-5 h-5 fill-current" />
          시뮬레이션 시작
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-5">
        <h3 className="text-slate-900 dark:text-white font-bold text-lg">빠른 작업</h3>
        
        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#252b32] hover:bg-slate-100 dark:hover:bg-[#2f3640] transition-colors group">
          <div className="flex items-center gap-3">
            <div className="bg-purple-500/10 p-2 rounded-md text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <Edit className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-slate-900 dark:text-white text-sm font-medium">원칙 수정</p>
              <p className="text-slate-500 dark:text-[#9dabb9] text-xs">규칙 업데이트</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400 w-[18px] h-[18px]" />
        </button>

        <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-[#252b32] hover:bg-slate-100 dark:hover:bg-[#2f3640] transition-colors group">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/10 p-2 rounded-md text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-slate-900 dark:text-white text-sm font-medium">실수 복기</p>
              <p className="text-slate-500 dark:text-[#9dabb9] text-xs">오류 분석</p>
            </div>
          </div>
          <ChevronRight className="text-slate-400 w-[18px] h-[18px]" />
        </button>
      </div>

      {/* Chart Placeholder (Equity Curve) */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-5 h-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-slate-900 dark:text-white font-bold text-sm">자산 곡선</h3>
          <span className="text-xs text-green-500 font-medium">+12%</span>
        </div>
        <div className="flex-1 w-full bg-slate-50 dark:bg-[#252b32] rounded-lg relative overflow-hidden flex items-end px-2 pb-2 gap-1 min-h-[120px]">
          {/* Fake bars using Tailwind heights to mimic the design */}
          <div className="bg-primary/30 w-1/6 h-[30%] rounded-sm"></div>
          <div className="bg-primary/40 w-1/6 h-[50%] rounded-sm"></div>
          <div className="bg-primary/30 w-1/6 h-[40%] rounded-sm"></div>
          <div className="bg-primary/50 w-1/6 h-[65%] rounded-sm"></div>
          <div className="bg-primary/70 w-1/6 h-[55%] rounded-sm"></div>
          <div className="bg-primary w-1/6 h-[80%] rounded-sm"></div>
        </div>
      </div>
    </div>
  );
}
