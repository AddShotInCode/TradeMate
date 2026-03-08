"use client";

import { Timer, LogOut } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSimulationStore } from "@/store/simulationStore";
import { simulationService } from "@/services/simulationService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SimulationHeader() {
  const router = useRouter();
  const {
    currentSimulationId,
    positions,
    currentPrice,
    placeOrder,
    data,
    currentTimeIndex,
    stockInfo,
    isFinished,
  } = useSimulationStore();

  const [seconds, setSeconds] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const timeString = formatTime(seconds);

  const handleTerminateClick = () => {
    setIsDialogOpen(true);
  };

  const confirmTerminate = async () => {
    if (!currentSimulationId) return;
    setIsLoading(true);
    try {
      // 1. Sell All Positions if any
      const totalQty = positions.reduce((sum, p) => sum + p.qty, 0);
      if (totalQty > 0) {
        // Assuming 'SELL' side sells the quantity specified
        await placeOrder(
          "SELL",
          totalQty,
          currentPrice,
          undefined,
          undefined,
          "Simulation End - Auto Liquidate"
        );
      }

      // 2. Terminate Simulation
      const currentCandle = data[currentTimeIndex];
      // Format: YYYY-MM-DD
      const dateStr = currentCandle
        ? String(currentCandle.time)
        : new Date().toISOString().split("T")[0];

      await simulationService.terminate(currentSimulationId, dateStr);

      // 3. Request Report Generation
      await simulationService.generateReport(currentSimulationId);

      // 4. Redirect
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to terminate simulation:", error);
      toast.error("시뮬레이션 종료 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };

  const hasPositions = positions.reduce((sum, p) => sum + p.qty, 0) > 0;

  const stockStats = useMemo(() => {
    if (!data || data.length === 0 || currentTimeIndex < 0) return null;

    // For simulation, we compare current candle Close vs Prev Candle Close
    // or Current Price vs Prev Candle Close if we want real-time feel during the day?
    // Since it's candle-based stepping, let's use:
    // Current Price (which is data[index].close) vs data[index-1].close

    // If index is 0, no prev data, standard default
    const prevClose =
      currentTimeIndex > 0 ? Number(data[currentTimeIndex - 1].close) : (data[0].open as number); // Use open as fallback

    const change = currentPrice - prevClose;
    const changeRate = prevClose !== 0 ? (change / prevClose) * 100 : 0;

    return {
      price: currentPrice,
      change,
      changeRate,
      isPositive: change >= 0,
    };
  }, [data, currentTimeIndex, currentPrice]);

  return (
    <>
      <header className="h-16 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#283039] bg-white dark:bg-[#101922] px-6 shrink-0 z-30">
        <div className="flex items-center gap-6">
          {stockInfo ? (
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <h2 className="text-slate-900 dark:text-white text-lg font-bold">
                  {stockInfo.name}
                </h2>
                <span className="text-slate-500 text-sm font-medium">{stockInfo.code}</span>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded text-xs font-semibold ml-1">
                  {stockInfo.market}
                </span>
              </div>

              {stockStats && (
                <div className="flex items-baseline gap-3 border-l border-slate-200 dark:border-[#3b4754] pl-4">
                  <span
                    className={`text-lg font-bold font-mono ${stockStats.isPositive ? "text-red-500" : "text-blue-500"}`}
                  >
                    {stockStats.price.toLocaleString()}
                  </span>
                  <div
                    className={`flex items-center text-sm font-medium ${stockStats.isPositive ? "text-red-500" : "text-blue-500"}`}
                  >
                    <span>{stockStats.change > 0 ? "▲" : stockStats.change < 0 ? "▼" : "-"}</span>
                    <span className="ml-1">{Math.abs(stockStats.change).toLocaleString()}</span>
                    <span className="ml-1">({stockStats.changeRate.toFixed(2)}%)</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <h2 className="text-slate-600 dark:text-slate-300 text-sm font-medium">
                세션 #{currentSimulationId || "..."}
              </h2>
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1c252e] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#3b4754]">
            <Timer className="w-5 h-5 text-slate-500" />
            <div className="flex items-center gap-1 font-mono text-sm font-bold text-slate-700 dark:text-white">
              <span>{timeString.split(":")[0]}</span>:<span>{timeString.split(":")[1]}</span>:
              <span>{timeString.split(":")[2]}</span>
            </div>
          </div>
          {!isFinished && (
            <button
              onClick={handleTerminateClick}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-bold rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              시뮬레이션 종료
            </button>
          )}
          {isFinished && (
            <div className="px-4 py-2 bg-gray-500/10 text-gray-500 text-sm font-bold rounded-lg border border-gray-200">
              종료된 세션
            </div>
          )}
        </div>
      </header>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>시뮬레이션 종료</DialogTitle>
            <DialogDescription>
              {hasPositions
                ? "현재 보유 중인 모든 주식이 현재가로 즉시 매도됩니다. 시뮬레이션을 종료하시겠습니까?"
                : "시뮬레이션을 종료하시겠습니까?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              onClick={confirmTerminate}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md disabled:opacity-50"
            >
              {isLoading ? "처리중..." : "종료하기"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
