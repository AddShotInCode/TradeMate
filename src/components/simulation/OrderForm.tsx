"use client";

import { Edit, HelpCircle, Minus, Plus } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";
import { useState, useEffect, useMemo } from "react";

export default function OrderForm() {
  const { placeOrder, sellPosition, currentPrice, balance, positions, isFinished } =
    useSimulationStore(); // Add positions, sellPosition
  const [activeTab, setActiveTab] = useState<"BUY" | "SELL">("BUY");
  const [qty, setQty] = useState(1);
  const [entryReason, setEntryReason] = useState("");
  const [stopLoss, setStopLoss] = useState<number | "">("");
  const [target, setTarget] = useState<number | "">("");

  // Calculate Holdings
  const totalLongQty = useMemo(
    () => positions.filter((p) => p.side === "BUY").reduce((acc, curr) => acc + curr.qty, 0),
    [positions],
  );

  const hasHoldings = totalLongQty > 0;

  // Fixed Entry Price & Auto SL/TP (Only for Initial Entry)
  useEffect(() => {
    if (currentPrice > 0 && activeTab === "BUY" && !hasHoldings) {
      const defaultSL = Math.floor(currentPrice * 0.98);
      const defaultTP = Math.floor(currentPrice * 1.04);
      setStopLoss(defaultSL);
      setTarget(defaultTP);
    } else if (hasHoldings) {
      setStopLoss("");
      setTarget("");
    }
  }, [currentPrice, activeTab, hasHoldings]);

  // Calculate Max Qty based on Tab
  const maxQty = useMemo(() => {
    if (currentPrice <= 0) return 0;

    if (activeTab === "BUY") {
      // Max based on Balance
      return Math.floor(balance / currentPrice);
    } else {
      // Max based on Holdings (Long Positions)
      return totalLongQty;
    }
  }, [balance, currentPrice, totalLongQty, activeTab]);

  // Reset quantity when switching tabs
  useEffect(() => {
    setQty(1);
  }, [activeTab]);

  // Auto-clamp qty if maxQty decreases below current qty
  useEffect(() => {
    if (maxQty > 0 && qty > maxQty) {
      setQty(maxQty);
    }
  }, [maxQty, qty]);

  if (isFinished) {
    return (
      <aside className="w-[320px] border-l border-slate-200 dark:border-[#283039] bg-white dark:bg-[#101922] flex flex-col p-6 items-center justify-center text-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">시뮬레이션 종료</h3>
        <p className="text-slate-500 dark:text-[#9dabb9] text-sm">
          종료된 시뮬레이션은 주문을 넣을 수 없습니다.
          <br />
          지난 기록을 확인해 보세요.
        </p>
      </aside>
    );
  }

  const handleOrder = () => {
    if (qty <= 0) {
      alert("수량을 입력해주세요.");
      return;
    }

    if (activeTab === "BUY") {
      // Buy Logic (Long Entry)
      if (!entryReason.trim()) {
        alert("진입 근거를 입력해주세요.");
        return;
      }

      // SL/TP are mandatory ONLY for Initial Entry
      if (!hasHoldings) {
        if (stopLoss === "" || Number(stopLoss) <= 0) {
          alert("신규 진입 시 손절가(Stop Loss) 설정은 필수입니다.");
          return;
        }
        if (target === "" || Number(target) <= 0) {
          alert("신규 진입 시 목표가(Target) 설정은 필수입니다.");
          return;
        }
      }

      const sl = stopLoss ? Number(stopLoss) : undefined;
      const tp = target ? Number(target) : undefined;
      const entryPrice = currentPrice;

      placeOrder("BUY", qty, entryPrice, sl, tp, entryReason);
      setEntryReason("");
    } else {
      // Sell Logic (Partial Close)
      if (maxQty === 0) {
        alert("보유 중인 포지션이 없습니다.");
        return;
      }
      if (qty > maxQty) {
        alert("보유 수량을 초과하여 매도할 수 없습니다.");
        return;
      }
      if (!entryReason.trim()) {
        alert("매도 근거를 입력해주세요.");
        return;
      }

      sellPosition(qty, entryReason);
      setEntryReason("");
    }
  };

  // Calculate projections (Only for Buy)
  const estimatedLoss =
    activeTab === "BUY" && stopLoss !== "" && currentPrice > 0
      ? (Number(stopLoss) - currentPrice) * qty
      : 0;
  const estimatedProfit =
    activeTab === "BUY" && target !== "" && currentPrice > 0
      ? (Number(target) - currentPrice) * qty
      : 0;

  return (
    <aside className="w-[360px] bg-white dark:bg-[#151c24] border-l border-slate-200 dark:border-[#283039] flex flex-col shadow-xl z-20">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-[#283039]">
        <button
          onClick={() => setActiveTab("BUY")}
          className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${
            activeTab === "BUY"
              ? "border-red-500 text-red-500 bg-red-500/5"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          매수 (Buy)
        </button>
        <button
          onClick={() => setActiveTab("SELL")}
          className={`flex-1 py-4 text-sm font-bold transition-colors border-b-2 ${
            activeTab === "SELL"
              ? "border-blue-500 text-blue-500 bg-blue-500/5"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          }`}
        >
          매도 (Sell)
        </button>
      </div>

      <div className="p-6 border-b border-slate-200 dark:border-[#283039]">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Edit className="text-[#137fec] w-6 h-6" />
          주문 (Order)
        </h2>
        <p className="text-slate-500 text-xs mt-1">거래 실행을 위해 필수 항목을 입력해주세요.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* BUY MODE UI */}
        {activeTab === "BUY" && (
          <div className="space-y-5">
            <div className="relative group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                진입 근거 (Entry Reason) <span className="text-red-500">*</span>
                <HelpCircle className="w-4 h-4 text-slate-600 cursor-help" />
              </label>
              <textarea
                className="w-full bg-slate-50 dark:bg-[#1c252e] border border-slate-300 dark:border-[#3b4754] rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 resize-none h-24"
                placeholder="매수 진입 근거를 입력하세요..."
                value={entryReason}
                onChange={(e) => setEntryReason(e.target.value)}
              />
            </div>

            {hasHoldings && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded p-3 text-xs text-yellow-500 mb-2">
                💡 추가 매수(물타기/불타기) 시에는 손절/목표가를 새로 설정할 수 없습니다.
              </div>
            )}

            <div
              className={`grid grid-cols-2 gap-4 ${hasHoldings ? "opacity-50 pointer-events-none grayscale" : ""}`}
            >
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  손절가 (Stop Loss) <span className="text-red-500">*</span>
                </label>
                <div className="relative mb-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    ₩
                  </span>
                  <input
                    className="w-full bg-slate-50 dark:bg-[#1c252e] border border-slate-300 dark:border-[#3b4754] rounded-lg py-2.5 pl-7 pr-3 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                    placeholder={hasHoldings ? "설정 불가" : "0"}
                    type={hasHoldings ? "text" : "number"}
                    min="0"
                    value={stopLoss}
                    onChange={(e) =>
                      setStopLoss(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    disabled={hasHoldings}
                  />
                </div>
                {/* SL Slider */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.1"
                    max="20"
                    step="0.1"
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    value={
                      currentPrice > 0 && stopLoss && typeof stopLoss === "number"
                        ? ((currentPrice - stopLoss) / currentPrice) * 100
                        : 0
                    }
                    onChange={(e) => {
                      if (currentPrice <= 0 || hasHoldings) return;
                      const pct = Number(e.target.value);
                      const price = Math.floor(currentPrice * (1 - pct / 100));
                      setStopLoss(price);
                    }}
                    disabled={hasHoldings}
                  />
                  <span className="text-[10px] font-mono w-10 text-right text-blue-500">
                    {currentPrice > 0 && stopLoss
                      ? (((currentPrice - Number(stopLoss)) / currentPrice) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  목표가 (Target) <span className="text-red-500">*</span>
                </label>
                <div className="relative mb-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    ₩
                  </span>
                  <input
                    className="w-full bg-slate-50 dark:bg-[#1c252e] border border-slate-300 dark:border-[#3b4754] rounded-lg py-2.5 pl-7 pr-3 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500/50 focus:border-red-500 outline-none transition-all"
                    placeholder={hasHoldings ? "설정 불가" : "0"}
                    type={hasHoldings ? "text" : "number"}
                    min="0"
                    value={target}
                    onChange={(e) => setTarget(e.target.value === "" ? "" : Number(e.target.value))}
                    disabled={hasHoldings}
                  />
                </div>
                {/* TP Slider */}
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0.1"
                    max="50"
                    step="0.1"
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    value={
                      currentPrice > 0 && target && typeof target === "number"
                        ? ((target - currentPrice) / currentPrice) * 100
                        : 0
                    }
                    onChange={(e) => {
                      if (currentPrice <= 0 || hasHoldings) return;
                      const pct = Number(e.target.value);
                      const price = Math.floor(currentPrice * (1 + pct / 100));
                      setTarget(price);
                    }}
                    disabled={hasHoldings}
                  />
                  <span className="text-[10px] font-mono w-10 text-right text-red-500">
                    {currentPrice > 0 && target
                      ? (((Number(target) - currentPrice) / currentPrice) * 100).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Projections */}
            <div className="bg-slate-50 dark:bg-[#1c252e] rounded-lg p-4 border border-slate-200 dark:border-[#3b4754]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-500 uppercase">
                  예상 손실 (Est. Loss)
                </span>
                <span className="text-sm font-bold text-blue-500">
                  {estimatedLoss !== 0
                    ? `-₩${Math.abs(Math.round(estimatedLoss)).toLocaleString("ko-KR")}`
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500 uppercase">
                  예상 수익 (Est. Profit)
                </span>
                <span className="text-sm font-bold text-red-500">
                  {estimatedProfit !== 0
                    ? `+₩${Math.round(estimatedProfit).toLocaleString("ko-KR")}`
                    : "-"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* SELL MODE UI */}
        {activeTab === "SELL" && (
          <div className="space-y-5">
            <div className="bg-blue-500/5 rounded-lg p-6 text-center border border-blue-500/10">
              <p className="text-slate-500 text-xs uppercase font-bold mb-1">
                총 보유 수량 (Total Holdings)
              </p>
              <p className="text-3xl font-mono font-bold text-slate-900 dark:text-white">
                {maxQty.toLocaleString()} <span className="text-sm text-slate-400">Qty</span>
              </p>
              <p className="text-xs text-slate-400 mt-2">
                보유 중인 모든 매수(Long) 포지션의 합계입니다.
              </p>
            </div>

            <div className="relative group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                매도 근거 (Exit Reason) <span className="text-blue-500">*</span>
              </label>
              <textarea
                className="w-full bg-slate-50 dark:bg-[#1c252e] border border-slate-300 dark:border-[#3b4754] rounded-lg p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 resize-none h-24"
                placeholder="매도 진입 근거를 입력하세요..."
                value={entryReason}
                onChange={(e) => setEntryReason(e.target.value)}
              />
            </div>
          </div>
        )}

        <hr className="border-slate-200 dark:border-[#283039]" />

        {/* Common Quantity Controller */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                {activeTab === "BUY" ? "주문 수량 (Order Qty)" : "매도 수량 (Sell Qty)"}
              </label>
              <span className="text-xs text-slate-500 font-mono">Max: {maxQty}</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="range"
                min="0"
                max={maxQty}
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 ${activeTab === "BUY" ? "accent-red-500" : "accent-blue-500"}`}
              />
            </div>

            <div className="flex items-center">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 bg-slate-100 dark:bg-[#283039] hover:bg-slate-200 dark:hover:bg-[#3b4754] rounded-l-lg flex items-center justify-center text-slate-500 transition-colors"
                disabled={qty <= 0}
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                className="flex-1 h-10 bg-slate-50 dark:bg-[#1c252e] border-y border-slate-200 dark:border-[#3b4754] text-center font-mono text-sm font-bold text-slate-900 dark:text-white focus:outline-none"
                type="number"
                value={qty}
                max={maxQty}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setQty(Math.min(val, maxQty));
                }}
              />
              <button
                onClick={() => setQty(Math.min(maxQty, qty + 1))}
                className="w-10 h-10 bg-slate-100 dark:bg-[#283039] hover:bg-slate-200 dark:hover:bg-[#3b4754] rounded-r-lg flex items-center justify-center text-slate-500 transition-colors"
                disabled={qty >= maxQty}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="pt-2">
            {activeTab === "BUY" ? (
              <button
                onClick={handleOrder}
                className="w-full group relative flex flex-col items-center justify-center py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-all active:scale-[0.98]"
              >
                <span className="text-lg font-bold">매수</span>
                <span className="text-xs opacity-80 mt-1">
                  ₩{currentPrice.toLocaleString()}에 진입
                </span>
              </button>
            ) : (
              <button
                onClick={handleOrder}
                className="w-full group relative flex flex-col items-center justify-center py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-all active:scale-[0.98]"
                disabled={maxQty === 0}
              >
                <span className="text-lg font-bold">매도</span>
                <span className="text-xs opacity-80 mt-1">보유 포지션 일부 또는 전량 청산</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
