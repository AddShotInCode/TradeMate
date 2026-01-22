import { Play, Edit, BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuickActions() {
  return (
    <div className="flex flex-col gap-6">


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

    </div>
  );
}
