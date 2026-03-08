"use client";

interface MaxLossInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MaxLossInput({ value, onChange }: MaxLossInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">
        일일 최대 손실 한도 (원)
      </label>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => {
            const numericValue = e.target.value.replace(/[^0-9]/g, "");
            onChange(numericValue);
          }}
          className="block w-full py-2.5 px-4 bg-[#111418] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#137fec] focus:border-transparent text-sm"
          placeholder="500000"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-slate-500 text-sm">원</span>
        </div>
      </div>
      <p className="mt-1.5 text-xs text-slate-400">이 한도를 초과하면 당일 거래가 제한됩니다.</p>
    </div>
  );
}
