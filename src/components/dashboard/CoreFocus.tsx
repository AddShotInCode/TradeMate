import { ShieldAlert, CheckCircle } from "lucide-react";

export default function CoreFocus() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-slate-900 dark:text-white text-xl font-bold">핵심 훈련 목표</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Feature 1 */}
        <div className="flex gap-4 rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-5 hover:border-primary/50 transition-colors">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/10 text-red-500">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-slate-900 dark:text-white text-base font-bold">뇌동매매 차단</h3>
            <p className="text-slate-500 dark:text-[#9dabb9] text-sm">감정적인 진입을 막기 위해 Impulse Block AI가 모니터링합니다.</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex gap-4 rounded-xl border border-slate-200 dark:border-[#3b4754] bg-white dark:bg-[#1c2127] p-5 hover:border-primary/50 transition-colors">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-slate-900 dark:text-white text-base font-bold">원칙 준수 평가</h3>
            <p className="text-slate-500 dark:text-[#9dabb9] text-sm">설정된 원칙에 따라 매매 행동을 자동으로 점수화합니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
