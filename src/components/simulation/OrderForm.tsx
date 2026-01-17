"use client";

import { Edit, HelpCircle, Minus, Plus } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";
import { useState, useEffect } from "react";

export default function OrderForm() {
  const { placeOrder, currentPrice } = useSimulationStore();
  const [qty, setQty] = useState(100);
  const [entryPrice, setEntryPrice] = useState<number | ''>('');
  const [entryReason, setEntryReason] = useState("");
  const [stopLoss, setStopLoss] = useState<number | ''>('');
  const [target, setTarget] = useState<number | ''>('');

  // Auto-fill prices
  useEffect(() => {
    if (currentPrice > 0) {
        if (entryPrice === '') setEntryPrice(currentPrice);
        if (stopLoss === '') setStopLoss(currentPrice);
        if (target === '') setTarget(currentPrice);
    }
  }, [currentPrice]);

  const handleBuy = () => {
    // Basic validation
    if (qty <= 0) {
        alert("수량을 입력해주세요.");
        return;
    }
    if (!entryReason.trim()) {
        alert("진입 근거를 입력해주세요.");
        return;
    }
    if (entryPrice === '' || stopLoss === '' || target === '') {
        alert("진입가, 손절가, 목표가를 모두 입력해주세요.");
        return;
    }

    placeOrder('BUY', qty, Number(entryPrice), Number(stopLoss), Number(target));
    setEntryReason("");
  };

  // Calculate projections
  const epValue = entryPrice === '' ? 0 : Number(entryPrice);
  const slValue = stopLoss === '' ? 0 : Number(stopLoss);
  const tpValue = target === '' ? 0 : Number(target);
  
  // Assuming Long Position
  const estimatedLoss = (slValue && epValue) ? (slValue - epValue) * qty : 0;
  const estimatedProfit = (tpValue && epValue) ? (tpValue - epValue) * qty : 0;
  
  const risk = Math.abs(epValue - slValue);
  const reward = Math.abs(tpValue - epValue);
  const rrRatio = (risk > 0 && reward > 0) ? (reward / risk).toFixed(2) : '0.00';

  // Progress bar percentages (visual representation)
  const totalRange = Math.abs(estimatedLoss) + Math.abs(estimatedProfit);
  const lossPct = totalRange > 0 ? (Math.abs(estimatedLoss) / totalRange) * 100 : 50;
  const profitPct = totalRange > 0 ? (Math.abs(estimatedProfit) / totalRange) * 100 : 50;

  return (
    <aside className="w-[360px] bg-white dark:bg-[#151c24] border-l border-slate-200 dark:border-[#283039] flex flex-col shadow-xl z-20">
      <div className="p-6 border-b border-slate-200 dark:border-[#283039]">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Edit className="text-[#137fec] w-6 h-6" />
          신규 진입 (New Position)
        </h2>
        <p className="text-slate-500 text-xs mt-1">거래 실행을 위해 필수 항목을 입력해주세요.</p>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-5">
          <div className="relative group">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              진입 근거 (Entry Reason) <span className="text-red-500">*</span>
              <HelpCircle className="w-4 h-4 text-slate-600 cursor-help" />
            </label>
            <textarea 
              className="w-full bg-slate-50 dark:bg-[#1c252e] border border-slate-300 dark:border-[#3b4754] rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent outline-none transition-all placeholder:text-slate-600 resize-none h-24" 
              placeholder="예: 200 EMA 지지 및 거래량 증가 확인..."
              value={entryReason}
              onChange={(e) => setEntryReason(e.target.value)}
            />
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 font-medium">최소 10자</div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              진입가 (Entry Price) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₩</span>
              <input 
                className="w-full bg-slate-50 dark:bg-[#1c252e] border border-slate-300 dark:border-[#3b4754] rounded-lg py-2.5 pl-7 pr-3 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-[#137fec] focus:border-transparent outline-none transition-all" 
                placeholder="0" 
                type="number" 
                min="0"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                손절가 (Stop Loss) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₩</span>
                <input 
                  className="w-full bg-slate-50 dark:bg-[#1c252e] border border-slate-300 dark:border-[#3b4754] rounded-lg py-2.5 pl-7 pr-3 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all" 
                  placeholder="0" 
                  type="number" 
                  min="0"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                목표가 (Target) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₩</span>
                <input 
                  className="w-full bg-slate-50 dark:bg-[#1c252e] border border-slate-300 dark:border-[#3b4754] rounded-lg py-2.5 pl-7 pr-3 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-green-500/50 focus:border-green-500 outline-none transition-all" 
                  placeholder="0" 
                  type="number"
                  min="0"
                  value={target}
                  onChange={(e) => setTarget(e.target.value === '' ? '' : Number(e.target.value))} 
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#137fec]/5 dark:bg-[#137fec]/10 rounded-lg p-4 border border-[#137fec]/10 dark:border-[#137fec]/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase">손익비 (Risk/Reward)</span>
            <span className="text-sm font-bold text-[#137fec]">1 : {rrRatio}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase">예상 손실 (Est. Loss)</span>
            <span className="text-sm font-bold text-red-500">
               {estimatedLoss !== 0 ? `₩${Math.round(estimatedLoss).toLocaleString('ko-KR')}` : '-'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-slate-500 uppercase">예상 수익 (Est. Profit)</span>
            <span className="text-sm font-bold text-green-500">
              {estimatedProfit !== 0 ? `+₩${Math.round(estimatedProfit).toLocaleString('ko-KR')}` : '-'}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-[#283039] h-1.5 rounded-full mt-3 overflow-hidden flex">
            <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${lossPct}%` }}></div>
            <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${profitPct}%` }}></div>
          </div>
        </div>
        <hr className="border-slate-200 dark:border-[#283039]"/>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              수량 (Quantity)
            </label>
            <div className="flex items-center">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 bg-slate-100 dark:bg-[#283039] hover:bg-slate-200 dark:hover:bg-[#3b4754] rounded-l-lg flex items-center justify-center text-slate-500 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input 
                className="flex-1 h-10 bg-slate-50 dark:bg-[#1c252e] border-y border-slate-200 dark:border-[#3b4754] text-center font-mono text-sm font-bold text-slate-900 dark:text-white focus:outline-none" 
                type="number" 
                value={qty}
                onChange={(e) => setQty(parseInt(e.target.value) || 0)}
              />
              <button 
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 bg-slate-100 dark:bg-[#283039] hover:bg-slate-200 dark:hover:bg-[#3b4754] rounded-r-lg flex items-center justify-center text-slate-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={handleBuy}
              className="group relative flex flex-col items-center justify-center py-4 bg-green-500 text-white rounded-lg shadow-lg hover:bg-[#0bc050] hover:shadow-green-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm font-bold uppercase tracking-wide">성가 매수 (Buy / Long)</span>
              <span className="text-[10px] opacity-80 font-mono mt-1">@ MKT</span>
            </button>
            <button 
              className="group relative flex flex-col items-center justify-center py-4 bg-slate-200 dark:bg-[#283039] text-slate-400 dark:text-slate-500 rounded-lg cursor-not-allowed border border-transparent dark:border-[#3b4754]" 
              disabled
            >
              <span className="text-sm font-bold uppercase tracking-wide">성가 매도 (Sell / Short)</span>
              <span className="text-[10px] opacity-60 font-mono mt-1">@ MKT</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
