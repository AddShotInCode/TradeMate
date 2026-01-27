"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import {
  TrendingUp,
  ShieldCheck,
  Wallet,
  Tag,
  DollarSign,
  Play,
  BarChart2,
  Gavel,
  Brain,
  ArrowUp,
  ArrowDown,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { simulationService, SimulationReportResponse } from "@/services/simulationService";
import { toast } from "sonner";
import { TARGET_STOCKS } from "@/constants/targetStocks";

export default function SimulationReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [data, setData] = useState<SimulationReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed Scores
  const [avgResultScore, setAvgResultScore] = useState(0);
  const [avgComplianceScore, setAvgComplianceScore] = useState(0);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const res = await simulationService.getReport(id);
        setData(res);

        // Calculate weighted averages
        if (res.trades.length > 0 && res.totalSellVolume > 0) {
          const totalR = res.trades.reduce((acc, t) => acc + t.resultScore * t.volume, 0);
          const totalC = res.trades.reduce((acc, t) => acc + t.complianceScore * t.volume, 0);
          setAvgResultScore(totalR / res.totalSellVolume);
          setAvgComplianceScore(totalC / res.totalSellVolume);
        }
      } catch (error) {
        console.error("Failed to fetch report", error);
        toast.error("보고서를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  const getStockName = (code: string) => {
    return TARGET_STOCKS.find((s) => s.code === code)?.name || code;
  };

  if (isLoading) {
    return (
      <div className="flex bg-[#f6f7f8] dark:bg-[#101922] h-screen w-full items-center justify-center text-slate-500">
        Loading Report...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex bg-[#f6f7f8] dark:bg-[#101922] h-screen w-full items-center justify-center text-slate-500">
        리포트를 찾을 수 없습니다.
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        <header className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-[#3b4754]/50 bg-white dark:bg-[#101922]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                시뮬레이션 결과 분석
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#137fec]/20 text-[#137fec] border border-[#137fec]/20">
                {getStockName(data.summary.stockCode)} ({data.summary.stockCode})
              </span>
            </div>
            <p className="text-slate-500 dark:text-[#9dabb9] text-sm">
              {data.summary.startDate} ~ {data.summary.endDate}
            </p>
          </div>
        </header>

        <main className="flex-1 p-8">
          <div className="mx-auto max-w-[1400px] flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Score Card */}
              <div className="lg:col-span-4 bg-white dark:bg-[#1e293b] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#3b4754] flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                  <ShieldCheck className="w-32 h-32 text-[#137fec]" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 w-full text-center z-10">
                  TradeMate 평가 시스템
                </h3>

                {/* Radial Progress Logic - Simplified CSS conic-gradient */}
                <div
                  className="relative w-40 h-40 rounded-full flex items-center justify-center mb-6 z-10"
                  style={{
                    background: `conic-gradient(#137fec ${data.summary.totalScore}%, #3b4754 0)`,
                  }}
                >
                  <div className="bg-white dark:bg-[#1e293b] rounded-full w-[85%] h-[85%] flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                      {data.summary.totalScore.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-[#9dabb9] font-medium uppercase tracking-wide mt-1">
                      종합 점수
                    </span>
                  </div>
                </div>

                <div className="w-full space-y-3 z-10 px-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500 dark:text-[#9dabb9]">수익 점수 (R)</span>
                      <span className="text-[#0bda5b]">{avgResultScore.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#0bda5b] h-full rounded-full"
                        style={{ width: `${avgResultScore}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500 dark:text-[#9dabb9]">준수 점수 (C)</span>
                      <span className="text-[#eab308]">{avgComplianceScore.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700/50 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#eab308] h-full rounded-full"
                        style={{ width: `${avgComplianceScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#3b4754] flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between">
                    <p className="text-slate-500 dark:text-[#9dabb9] text-base font-medium">
                      총 투자금
                    </p>
                    <Wallet className="w-10 h-10 text-[#137fec] bg-[#137fec]/10 p-2 rounded" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-center">
                    <p className="text-4xl font-bold text-slate-900 dark:text-white mt-4">
                      {data.summary.totalInvestment.toLocaleString()}
                    </p>
                    <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium mt-1">
                      Total Allocated
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#3b4754] flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between">
                    <p className="text-slate-500 dark:text-[#9dabb9] text-base font-medium">
                      누적 수익률
                    </p>
                    <TrendingUp
                      className={`w-10 h-10 p-2 rounded ${
                        data.summary.totalRoi >= 0
                          ? "text-[#0bda5b] bg-[#0bda5b]/10"
                          : "text-[#fa6238] bg-[#fa6238]/10"
                      }`}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-center">
                    <p
                      className={`text-4xl font-bold mt-4 ${
                        data.summary.totalRoi >= 0 ? "text-[#0bda5b]" : "text-[#fa6238]"
                      }`}
                    >
                      {data.summary.totalRoi > 0 ? "+" : ""}
                      {data.summary.totalRoi.toFixed(2)}%
                    </p>
                    <p className="text-slate-500 dark:text-[#9dabb9] text-sm font-medium mt-1">
                      Session Return
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-[#3b4754] flex flex-col justify-between h-full">
                  <div className="flex items-start justify-between">
                    <p className="text-slate-500 dark:text-[#9dabb9] text-base font-medium">
                      실현 손익
                    </p>
                    <DollarSign
                      className={`w-10 h-10 p-2 rounded ${
                        data.summary.totalRealizedProfit >= 0
                          ? "text-[#0bda5b] bg-[#0bda5b]/10"
                          : "text-[#fa6238] bg-[#fa6238]/10"
                      }`}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center text-center">
                    <p className={`text-4xl font-bold text-slate-900 dark:text-white mt-4`}>
                      {data.summary.totalRealizedProfit > 0 ? "+" : ""}
                      {data.summary.totalRealizedProfit.toLocaleString()}
                    </p>
                    <p
                      className={`text-sm font-medium mt-1 ${
                        data.summary.totalRealizedProfit >= 0 ? "text-[#0bda5b]" : "text-[#fa6238]"
                      }`}
                    >
                      Realized P&L
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trade Breakdown List */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    거래 내역 (매도)
                  </h3>
                </div>
                <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#3b4754] rounded-xl overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
                  {data.trades.map((trade, idx) => (
                    <div
                      key={idx}
                      className="p-4 border-b border-slate-200 dark:border-[#3b4754]/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Gavel
                            className={`w-5 h-5 ${trade.profit >= 0 ? "text-[#0bda5b]" : "text-[#fa6238]"}`}
                          />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            #{trade.sequence}차 매도 ({trade.tradeDate})
                          </span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            trade.profit >= 0
                              ? "bg-[#0bda5b]/10 text-[#0bda5b]"
                              : "bg-[#fa6238]/10 text-[#fa6238]"
                          }`}
                        >
                          {trade.profit >= 0 ? "익절" : "손절"} ({trade.roi > 0 ? "+" : ""}
                          {trade.roi.toFixed(2)}%)
                        </span>
                      </div>
                      {/* Details Grid */}
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-y-3 gap-x-2 pl-7 text-xs text-slate-500 dark:text-[#9dabb9]">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-slate-400">매도가</span>
                          <span className="font-mono text-slate-700 dark:text-white font-medium">
                            {trade.sellPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-slate-400">평단가</span>
                          <span className="font-mono text-slate-700 dark:text-white font-medium">
                            {trade.avgPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-slate-400">수량</span>
                          <span className="font-mono text-slate-700 dark:text-white font-medium">
                            {trade.volume.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col col-span-2 sm:col-span-1">
                          <span className="text-[10px] uppercase text-slate-400">실현손익</span>
                          <span
                            className={`font-mono font-medium ${trade.profit >= 0 ? "text-[#0bda5b]" : "text-[#fa6238]"}`}
                          >
                            {trade.profit > 0 ? "+" : ""}
                            {trade.profit.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col hidden sm:flex">
                          <span className="text-[10px] uppercase text-slate-400">종합 점수</span>
                          <span className="font-mono text-[#137fec] font-bold">
                            {trade.tradeScore}점
                          </span>
                        </div>

                        {/* Row 2 */}
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-slate-400">목표가</span>
                          <span className="font-mono text-[#0bda5b] flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />
                            {trade.targetPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-slate-400">손절가</span>
                          <span className="font-mono text-[#fa6238] flex items-center gap-1">
                            <ArrowDown className="w-3 h-3" />
                            {trade.stopLoss.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-slate-400">R점수</span>
                          <span className="font-mono">{trade.resultScore}점</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-slate-400">C점수</span>
                          <span className="font-mono">{trade.complianceScore}점</span>
                        </div>
                        <div className="flex flex-col sm:hidden">
                          <span className="text-[10px] uppercase text-slate-400">종합 점수</span>
                          <span className="font-mono text-[#137fec] font-bold">
                            {trade.tradeScore}점
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.trades.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-sm">
                      이 세션에 기록된 매도 내역이 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-gradient-to-r from-[#1e293b] to-[#16202c] rounded-xl p-1 border border-[#3b4754] mt-2">
              <div className="bg-[#101922]/50 rounded-lg p-6 flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#137fec]/20 flex items-center justify-center flex-shrink-0 text-[#137fec]">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">
                      원칙 분석 (Principle Analysis)
                    </h4>
                    <p className="text-[#9dabb9] text-sm leading-relaxed">
                      현재 과정 점수는{" "}
                      <span className="text-slate-200 font-medium">
                        {avgComplianceScore.toFixed(1)}점
                      </span>
                      으로,
                      {avgComplianceScore >= 80 ? (
                        <span className="text-emerald-400 font-medium">
                          {" "}
                          매우 훌륭함(Excellent)
                        </span>
                      ) : avgComplianceScore >= 50 ? (
                        <span className="text-yellow-400 font-medium"> 보통(Moderate)</span>
                      ) : (
                        <span className="text-red-400 font-medium"> 개선 필요(Poor)</span>
                      )}
                      수준입니다. <br className="hidden md:block" />
                      {avgComplianceScore >= 80
                        ? "흔들림 없이 원칙을 지키며 매매를 수행했습니다. 이러한 규율은 장기적인 트레이딩 성공의 핵심입니다. 앞으로도 이 기준을 유지하세요."
                        : avgComplianceScore >= 50
                          ? "대체로 원칙을 따랐으나, 상황에 따라 일부 흔들린 모습이 보입니다. 감정에 휘둘린 순간이 있었는지 점검하고, 더 일관된 매매를 목표로 하세요."
                          : "잦은 뇌동매매나 원칙 이탈이 관찰됩니다. 매매 횟수를 줄이더라도 확실한 근거가 있는 자리에서만 진입하는 인내심을 훈련해야 합니다."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="border-[#3b4754] bg-[#1e293b] text-white hover:bg-slate-700"
                    onClick={() => router.push("/simulation")}
                  >
                    <List className="w-4 h-4 mr-2" />
                    목록보기
                  </Button>
                  <Button
                    className="bg-[#137fec] text-white hover:bg-blue-600"
                    onClick={() => router.push("/dashboard")}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    대시보드로 이동
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
