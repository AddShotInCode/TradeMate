"use client";

interface ActionBarProps {
  onSave: () => void;
  disabled?: boolean;
}

export default function ActionBar({ onSave, disabled = false }: ActionBarProps) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={disabled}
      title={disabled ? "원칙 비율 합계를 100%로 맞춰주세요." : undefined}
      className={
        "w-full sm:w-auto self-end px-6 py-2.5 rounded-lg text-white font-bold text-sm shadow-lg transition-all " +
        (disabled
          ? "bg-slate-600/60 cursor-not-allowed shadow-none"
          : "bg-[#137fec] hover:bg-blue-600 shadow-blue-500/20")
      }
    >
      저장
    </button>
  );
}
