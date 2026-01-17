"use client";

import { ChevronDown } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";

export default function TradeLog() {
  const { tradeLogs } = useSimulationStore();

  return (
    <div className="h-48 bg-[#1c252e] border-t border-slate-200 dark:border-[#283039] flex flex-col">
      <div className="px-4 py-2 bg-[#283039] flex items-center justify-between">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">세션 거래 기록 (Session Trade Log)</h3>
        <button className="text-slate-400 hover:text-white">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#151c24] text-slate-400 text-xs uppercase sticky top-0">
            <tr>
              <th className="px-4 py-3 font-medium">시간 (Time)</th>
              <th className="px-4 py-3 font-medium">종목 (Symbol)</th>
              <th className="px-4 py-3 font-medium">포지션 (Side)</th>
              <th className="px-4 py-3 font-medium">가격 (Price)</th>
              <th className="px-4 py-3 font-medium">수량 (Qty)</th>
              <th className="px-4 py-3 font-medium">슬리피지 (Slippage)</th>
              <th className="px-4 py-3 font-medium">수수료 (Fee)</th>
              <th className="px-4 py-3 font-medium text-right">실현 손익 (Net P&L)</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-300 divide-y divide-[#283039]">
            {tradeLogs.map((log) => (
              <tr key={log.id} className="hover:bg-[#283039]/50">
                <td className="px-4 py-2 font-mono text-slate-500">{log.time}</td>
                <td className="px-4 py-2 font-bold text-white">{log.symbol}</td>
                <td className={`px-4 py-2 ${log.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                  {log.side}
                </td>
                <td className="px-4 py-2 font-mono">{log.price.toLocaleString('ko-KR')}</td>
                <td className="px-4 py-2 font-mono">{log.qty}</td>
                <td className={`px-4 py-2 text-xs ${log.slippage < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                  {log.slippage !== 0 ? `₩${log.slippage.toLocaleString('ko-KR')}` : '0'}
                </td>
                <td className="px-4 py-2 text-slate-500 text-xs">₩{log.fee.toLocaleString('ko-KR')}</td>
                <td className={`px-4 py-2 text-right font-mono font-bold ${log.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {log.pnl !== 0 ? `${log.pnl > 0 ? '+' : ''}₩${Math.round(log.pnl).toLocaleString('ko-KR')}` : '-'}
                </td>
              </tr>
            ))}
            {tradeLogs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                  거래 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
