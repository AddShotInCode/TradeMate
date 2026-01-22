"use client";

import { ChevronDown } from "lucide-react";
import { useSimulationStore } from "@/store/simulationStore";
import { useState, useEffect, useRef, MouseEvent, Fragment } from "react";

export default function TradeLog() {
  const { tradeLogs } = useSimulationStore();
  
  /* Resizing Logic */
  const [height, setHeight] = useState(250);
  const [activeTab, setActiveTab] = useState<'positions' | 'logs'>('logs');
  
  // Use refs for drag state to avoid closure staleness and global window pollution
  const isResizing = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isResizing.current) return;
      
      // Calculate delta: moving UP (negative delta) should INCREASE height
      // distinct from movementY which is delta per frame
      const deltaY = e.clientY - startY.current;
      const newHeight = startHeight.current - deltaY; // moving up (lower Y) -> increase height
      
      setHeight(Math.max(150, Math.min(800, newHeight)));
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto'; // Re-enable text selection
    };

    // Attach to document to catch events outside the window/component
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default drag behavior
    isResizing.current = true;
    startY.current = e.clientY;
    startHeight.current = height;
    
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none'; // Prevent text selection while dragging
  };

  return (
    <div 
        style={{ height: `${height}px` }}
        className="relative bg-[#1c252e] border-t border-slate-200 dark:border-[#283039] flex flex-col transition-none flex-none"
    >
      {/* Resizer Handle - Increased hit area */}
      <div 
        onMouseDown={handleMouseDown}
        className="absolute top-[-5px] left-0 w-full h-[10px] cursor-row-resize z-50 flex items-center justify-center group bg-transparent"
      >
        <div className="w-full h-1 bg-transparent group-hover:bg-[#137fec] transition-colors relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1.5 bg-slate-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Header / Tabs */}
      <div className="px-4 py-2 bg-[#283039] flex items-center justify-between shrink-0 border-t border-[#283039]">
        <div className="flex items-center gap-4">
            <button 
                onClick={() => setActiveTab('logs')}
                className={`text-xs font-bold uppercase tracking-wider pb-1 border-b-2 transition-colors ${activeTab === 'logs' ? 'text-white border-[#137fec]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
                거래 기록 (Trade Log)
            </button>
            {/* 탭 구분선 */}
            <div className="h-3 w-px bg-slate-600"></div>
            <button 
                onClick={() => setActiveTab('positions')}
                className={`text-xs font-bold uppercase tracking-wider pb-1 border-b-2 transition-colors ${activeTab === 'positions' ? 'text-white border-[#137fec]' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
            >
                보유 포지션 (Open Positions)
            </button>
        </div>
        <button className="text-slate-400 hover:text-white">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'logs' ? (
            <table className="w-full text-left border-collapse">
            <thead className="bg-[#151c24] text-slate-400 text-xs uppercase sticky top-0 z-10">
                <tr>
                <th className="px-4 py-3 font-medium">시간 (Time)</th>
                <th className="px-4 py-3 font-medium">종목 (Symbol)</th>
                <th className="px-4 py-3 font-medium">포지션 (Side)</th>
                <th className="px-4 py-3 font-medium">가격 (Price)</th>
                <th className="px-4 py-3 font-medium">수량 (Qty)</th>
                <th className="px-4 py-3 font-medium">수수료 (Fee)</th>
                <th className="px-4 py-3 font-medium text-right">실현 손익 (Net P&L)</th>
                </tr>
            </thead>
            <tbody className="text-sm text-slate-300 divide-y divide-[#283039]">
                {tradeLogs.map((log) => (
                <Fragment key={log.id}>
                    <tr 
                        className="hover:bg-[#283039]/50 cursor-pointer group"
                        onClick={() => {
                            const el = document.getElementById(`details-${log.id}`);
                            if (el) {
                                el.classList.toggle('hidden');
                            }
                        }}
                    >
                        <td className="px-4 py-2 font-mono text-slate-500">{log.time}</td>
                        <td className="px-4 py-2 font-bold text-white">{log.symbol}</td>
                        <td className={`px-4 py-2 ${log.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                        {log.side}
                        </td>
                        <td className="px-4 py-2 font-mono">{log.price.toLocaleString('ko-KR')}</td>
                        <td className="px-4 py-2 font-mono">{log.qty}</td>
                        <td className="px-4 py-2 text-slate-500 text-xs">₩{log.fee.toLocaleString('ko-KR')}</td>
                        <td className={`px-4 py-2 text-right font-mono font-bold ${log.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {log.pnl !== 0 ? `${log.pnl > 0 ? '+' : ''}₩${Math.round(log.pnl).toLocaleString('ko-KR')}` : '-'}
                        </td>
                    </tr>
                    {/* 상세 정보 (진입 근거 등) - 기본적으로 숨김 */}
                    <tr id={`details-${log.id}`} className="hidden bg-[#151c24]/50 border-b border-[#283039]">
                        <td colSpan={8} className="px-4 py-3">
                            <div className="flex gap-4 text-xs">
                                <span className="text-slate-500 font-bold whitespace-nowrap pt-1">진입 근거:</span>
                                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {log.entryReason || "기록된 진입 근거가 없습니다."}
                                </p>
                            </div>
                        </td>
                    </tr>
                </Fragment>
                ))}
                {tradeLogs.length === 0 && (
                <tr className="h-full">
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    거래 내역이 없습니다.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        ) : (
            /* Open Positions Table */
            <OpenPositionsTable />
        )}
      </div>
    </div>
  );
}

function OpenPositionsTable() {
    const { positions, currentPrice, closePosition } = useSimulationStore();

    if (positions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2 py-8">
                <span>보유 중인 포지션이 없습니다.</span>
            </div>
        );
    }

    return (
        <table className="w-full text-left border-collapse">
            <thead className="bg-[#151c24] text-slate-400 text-xs uppercase sticky top-0 z-10">
                <tr>
                    <th className="px-4 py-3 font-medium">종목 (Symbol)</th>
                    <th className="px-4 py-3 font-medium">포지션 (Side)</th>
                    <th className="px-4 py-3 font-medium">진입가 (Entry)</th>
                    <th className="px-4 py-3 font-medium">현재가 (Mark)</th>
                    <th className="px-4 py-3 font-medium">수량 (Qty)</th>
                    <th className="px-4 py-3 font-medium">미실현 손익 (Unrealized P&L)</th>
                    <th className="px-4 py-3 font-medium text-right">관리 (Action)</th>
                </tr>
            </thead>
            <tbody className="text-sm text-slate-300 divide-y divide-[#283039]">
                {positions.map((pos, idx) => {
                    const pnl = pos.side === 'BUY' 
                        ? (currentPrice - pos.entryPrice) * pos.qty
                        : (pos.entryPrice - currentPrice) * pos.qty;
                    const pnlPercent = (pnl / (pos.entryPrice * pos.qty)) * 100;

                    return (
                        <tr key={idx} className="hover:bg-[#283039]/50">
                            <td className="px-4 py-2 font-bold text-white">{pos.symbol}</td>
                            <td className={`px-4 py-2 ${pos.side === 'BUY' ? 'text-green-500' : 'text-red-500'}`}>
                                {pos.side}
                                <span className="text-[10px] text-slate-500 ml-1 font-mono">
                                    {pos.side === 'BUY' ? 'LONG' : 'SHORT'}
                                </span>
                            </td>
                            <td className="px-4 py-2 font-mono">₩{pos.entryPrice.toLocaleString('ko-KR')}</td>
                            <td className="px-4 py-2 font-mono text-slate-400">₩{currentPrice.toLocaleString('ko-KR')}</td>
                            <td className="px-4 py-2 font-mono">{pos.qty}</td>
                            <td className={`px-4 py-2 font-mono font-bold ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {pnl > 0 ? '+' : ''}₩{Math.round(pnl).toLocaleString('ko-KR')}
                                <span className="text-xs opacity-70 ml-1">({pnlPercent.toFixed(2)}%)</span>
                            </td>
                            <td className="px-4 py-2 text-right">
                                <button 
                                    onClick={() => closePosition([idx])}
                                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded transition-colors border border-slate-600"
                                >
                                    청산 (Close)
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
