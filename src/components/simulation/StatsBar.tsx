"use client";

import { useSimulationStore } from "@/store/simulationStore";

export default function StatsBar() {
  const { balance, positions, currentPrice } = useSimulationStore();
  
  // Calculate Unrealized P&L
  const unrealizedPnl = positions.reduce((acc, pos) => {
    return acc + (currentPrice - pos.entryPrice) * pos.qty;
  }, 0);

  const equity = balance + unrealizedPnl;
  const isProfit = unrealizedPnl >= 0;

  return (
    <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-[#151c24] border-b border-slate-200 dark:border-[#283039]">
      <div className="flex flex-col gap-1">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">주문 가능 금액 (Balance)</p>
        <p className="text-slate-900 dark:text-white text-lg font-bold font-mono">
          ₩{Math.round(balance).toLocaleString('ko-KR')}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">평가 손익 (Unrealized P&L)</p>
        <div className="flex items-center gap-2">
          <p className={`${isProfit ? 'text-green-500' : 'text-red-500'} text-lg font-bold font-mono`}>
            {isProfit ? '+' : ''}₩{Math.abs(Math.round(unrealizedPnl)).toLocaleString('ko-KR')}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">총 자산 (Equity)</p>
        <p className="text-slate-900 dark:text-white text-lg font-bold font-mono">
           ₩{Math.round(equity).toLocaleString('ko-KR')}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">보유 포지션 (Open Positions)</p>
        <p className="text-slate-500 text-lg font-bold font-mono">
           {positions.length > 0 ? `${positions.length} Open` : '--'}
        </p>
      </div>
    </div>
  );
}
