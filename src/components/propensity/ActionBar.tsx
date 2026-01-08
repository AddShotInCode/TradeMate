"use client";

import { CheckCircle, ArrowRight } from "lucide-react";

interface ActionBarProps {
  activePrinciplesCount: number;
  onSaveDraft: () => void;
  onSaveAndStart: () => void;
}

export default function ActionBar({
  activePrinciplesCount,
  onSaveDraft,
  onSaveAndStart,
}: ActionBarProps) {
  return (
    <div className="sticky bottom-4 z-40 bg-[#1e293b] p-4 rounded-xl shadow-lg border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <CheckCircle className="size-5 text-green-500" />
        <span>프로필 완료. {activePrinciplesCount}개의 원칙이 활성화되어 있습니다.</span>
      </div>
      <div className="flex w-full sm:w-auto gap-3">
        <button
          onClick={onSaveDraft}
          className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg border border-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
        >
          임시 저장
        </button>
        <button
          onClick={onSaveAndStart}
          className="flex-1 sm:flex-none px-6 py-2.5 rounded-lg bg-[#137fec] hover:bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          <span>저장 후 훈련 시작</span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
