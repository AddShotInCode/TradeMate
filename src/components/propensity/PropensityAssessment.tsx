"use client";

type IndicatorWeight = {
  name: string;
  weight: string;
};

interface PropensityAssessmentProps {
  stopLossPct: string;
  onStopLossPctChange: (value: string) => void;
  takeProfitPct: string;
  onTakeProfitPctChange: (value: string) => void;
  expectedRoiPct: string;
  onExpectedRoiPctChange: (value: string) => void;
  indicators: IndicatorWeight[];
  onIndicatorChange: (index: number, next: IndicatorWeight) => void;
}

export default function PropensityAssessment({
  stopLossPct,
  onStopLossPctChange,
  takeProfitPct,
  onTakeProfitPctChange,
  expectedRoiPct,
  onExpectedRoiPctChange,
  indicators,
  onIndicatorChange,
}: PropensityAssessmentProps) {
  const totalWeight = indicators.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);

  return (
    <section className="bg-[#1e293b] rounded-xl p-6 shadow-sm border border-slate-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-8 rounded-full bg-[#137fec]/10 flex items-center justify-center text-[#137fec] font-bold">
          1
        </div>
        <h2 className="text-xl font-bold text-white">전략 입력 (점수 산정 기준)</h2>
      </div>

      {/* SL/TP & Expected ROI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">손절 기준</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={stopLossPct}
              onChange={(e) => onStopLossPctChange(e.target.value.replace(/[^0-9.]/g, ""))}
              className="block w-full h-10 px-4 bg-[#111418] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#137fec] focus:border-transparent text-sm"
              placeholder="2.0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-500 text-sm">%</span>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-400">원칙 준수(Compliance) 평가에 사용됩니다.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">익절 기준</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={takeProfitPct}
              onChange={(e) => onTakeProfitPctChange(e.target.value.replace(/[^0-9.]/g, ""))}
              className="block w-full h-10 px-4 bg-[#111418] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#137fec] focus:border-transparent text-sm"
              placeholder="4.0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-500 text-sm">%</span>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-400">원칙 준수(Compliance) 평가에 사용됩니다.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">예상 상승률</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={expectedRoiPct}
              onChange={(e) => onExpectedRoiPctChange(e.target.value.replace(/[^0-9.]/g, ""))}
              className="block w-full h-10 px-4 bg-[#111418] border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-[#137fec] focus:border-transparent text-sm"
              placeholder="3.0"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-slate-500 text-sm">%</span>
            </div>
          </div>
          <p className="mt-1.5 text-xs text-slate-400">성과(Performance) 평가에 사용됩니다.</p>
        </div>
      </div>

      {/* Indicator weights */}
      <div className="bg-[#111418] border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-bold text-white">지표 가중치 (합계 100%)</p>
          <p className={totalWeight === 100 ? "text-xs font-bold text-green-400" : "text-xs font-bold text-rose-400"}>
            합계: {totalWeight}%
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {indicators.map((item, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-400 mb-1">지표 이름</label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => onIndicatorChange(index, { ...item, name: e.target.value })}
                  className="block w-full py-2 px-3 bg-slate-900/40 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-[#137fec] focus:border-transparent text-sm"
                  placeholder="예: RSI, Volume, MA"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-400 mb-1">가중치</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={item.weight}
                    onChange={(e) => onIndicatorChange(index, { ...item, weight: e.target.value.replace(/[^0-9]/g, "") })}
                    className="block w-full py-2 px-3 pr-8 bg-slate-900/40 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-[#137fec] focus:border-transparent text-sm"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-slate-500 text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          주문 확정 시점에 지표 가중치와 SL/TP/Expected ROI는 고정(Hypothesis Lock)되어, 거래 종료 전까지 수정할 수 없도록 설계됩니다.
        </p>
      </div>
    </section>
  );
}
