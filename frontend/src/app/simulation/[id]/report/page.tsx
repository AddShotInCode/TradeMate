"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import {
  AlertTriangle,
  ArrowLeft,
  Brain,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Gauge,
  Lock,
  Scale,
  Target,
  TrendingUp,
  Wallet,
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

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const res = await simulationService.getReport(id);
        setData(res);
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

  const formatNumber = (value: number) => value.toLocaleString("ko-KR");
  const formatDate = (value: string) => value.replaceAll("-", ".");
  const clamp = (value: number) => Math.max(0, Math.min(100, value));

  const metrics = useMemo(() => {
    if (!data) {
      return {
        avgResultScore: 0,
        avgComplianceScore: 0,
        aiScore: 0,
        concentrationRatio: 0,
      };
    }

    if (data.trades.length === 0 || data.totalSellVolume === 0) {
      return {
        avgResultScore: 0,
        avgComplianceScore: 0,
        aiScore: data.summary.aiScore ?? data.summary.totalScore,
        concentrationRatio: 0,
      };
    }

    const weightedResult = data.trades.reduce((acc, t) => acc + t.resultScore * t.volume, 0);
    const weightedCompliance = data.trades.reduce((acc, t) => acc + t.complianceScore * t.volume, 0);
    const maxVolume = Math.max(...data.trades.map((t) => t.volume));

    return {
      avgResultScore: weightedResult / data.totalSellVolume,
      avgComplianceScore: weightedCompliance / data.totalSellVolume,
      aiScore: data.summary.aiScore ?? data.summary.totalScore,
      concentrationRatio: (maxVolume / data.totalSellVolume) * 100,
    };
  }, [data]);

  const overallScore = useMemo(() => {
    if (!data) return 0;
    return (metrics.avgComplianceScore + metrics.avgResultScore + metrics.aiScore) / 3;
  }, [data, metrics]);

  const grade = useMemo(() => {
    if (!data) return "-";
    if (overallScore >= 90) return "A+";
    if (overallScore >= 80) return "A";
    if (overallScore >= 70) return "B";
    if (overallScore >= 60) return "C";
    return "D";
  }, [data, overallScore]);

  const isPaidMember = false;

  const geminiSummary = useMemo(() => {
    if (!data?.summary.aiComment || data.summary.aiComment.trim().length === 0) {
      return "Gemini 분석 요약이 아직 생성되지 않았습니다. 시뮬레이션 종료 후 잠시 뒤 다시 확인해 주세요.";
    }

    const normalized = data.summary.aiComment.replaceAll("\n", " ").replace(/\s+/g, " ").trim();
    const sentences = normalized
      .split(/(?<=[.!?。！？])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);

    if (sentences.length <= 2) {
      return normalized;
    }

    const selected: string[] = [];
    let totalLength = 0;

    for (const sentence of sentences) {
      const nextLength = totalLength + sentence.length + (selected.length > 0 ? 1 : 0);
      if (selected.length < 3 && nextLength <= 420) {
        selected.push(sentence);
        totalLength = nextLength;
      } else {
        break;
      }
    }

    return selected.length > 0 ? selected.join(" ") : normalized;
  }, [data]);

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
        <header className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-[#283039] bg-[#f6f7f8] dark:bg-[#101922] sticky top-0 z-20">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              시뮬레이션 결과 보고서
            </h1>
            <p className="text-slate-500 dark:text-[#b99db9] text-sm">
              훈련 종료 후 성과 및 원칙 준수 여부 종합 분석 리포트
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#d411d4]/10 text-[#d411d4] font-semibold border border-[#d411d4]/30">
              {getStockName(data.summary.stockCode)} ({data.summary.stockCode})
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#392839] text-slate-600 dark:text-[#d7bdd7] font-medium flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {formatDate(data.summary.startDate)} ~ {formatDate(data.summary.endDate)}
            </span>
          </div>
        </header>

        <main className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col gap-8 w-full">
          <section className="flex flex-col items-center text-center gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                종합 성과
              </h2>
              <p className="text-slate-500 dark:text-[#b99db9] text-sm">
                총 {data.totalTradeCount}회 청산 기준으로 집계된 결과입니다.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-[92px] font-black leading-none text-[#d411d4] drop-shadow-sm mb-2">
                {grade}
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-slate-500 dark:text-[#b99db9] text-xs font-bold uppercase tracking-widest">
                  종합 점수
                </span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {overallScore.toFixed(1)}
                  <span className="text-lg font-medium text-slate-400"> / 100</span>
                </span>
              </div>
            </div>

            <div className="w-full max-w-md space-y-4 mt-1">
              <div className="space-y-2 text-left">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#b99db9]">
                  <span>원칙 준수 점수</span>
                  <span className="text-[#d411d4]">{metrics.avgComplianceScore.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-[#392839] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d411d4] rounded-full"
                    style={{ width: `${clamp(metrics.avgComplianceScore)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#b99db9]">
                  <span>수익 실현 점수</span>
                  <span className="text-blue-500">{metrics.avgResultScore.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-[#392839] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${clamp(metrics.avgResultScore)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#b99db9]">
                  <span>에이전트 평가 점수</span>
                  <span className="text-emerald-500">{metrics.aiScore.toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-[#392839] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${clamp(metrics.aiScore)}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Brain className="w-5 h-5 text-[#d411d4]" />
              에이전트 의견
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-6 p-5 rounded-xl bg-[#f6f7f8] dark:bg-[#101922] border border-slate-200 dark:border-[#283039] shadow-sm hover:border-[#d411d4]/50 transition-all">
                <div className="p-3 bg-[#d411d4]/20 rounded-lg text-[#d411d4]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">Gemini 의견 요약</h4>
                  <p className="text-slate-500 dark:text-[#b99db9] text-sm leading-relaxed mt-1 whitespace-pre-wrap break-words">
                    {geminiSummary}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-[#d411d4] bg-[#d411d4]/10 px-2 py-1 rounded">
                    Gemini
                  </span>
                  <span className="text-2xl font-black dark:text-white">
                    {(data.summary.aiScore ?? metrics.aiScore).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 p-5 rounded-xl bg-[#f6f7f8] dark:bg-[#101922] border border-slate-200 dark:border-[#283039] shadow-sm hover:border-[#d411d4]/50 transition-all">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-500">
                  <Target className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">GPT 의견</h4>
                  <p className="text-slate-500 dark:text-[#b99db9] text-sm leading-relaxed mt-1">
                    {isPaidMember
                      ? "GPT 분석 결과가 여기에 표시됩니다."
                      : "유료 회원 전용 기능입니다. 결제 후 GPT 에이전트 의견을 확인할 수 있습니다."}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded flex items-center gap-1">
                    {!isPaidMember && <Lock className="w-3 h-3" />}
                    GPT
                  </span>
                  <span className="text-2xl font-black dark:text-white">
                    {isPaidMember ? "OPEN" : "LOCK"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 p-5 rounded-xl bg-[#f6f7f8] dark:bg-[#101922] border border-slate-200 dark:border-[#283039] shadow-sm hover:border-[#d411d4]/50 transition-all">
                <div className="p-3 bg-amber-500/20 rounded-lg text-amber-500">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg">Claude 의견</h4>
                  <p className="text-slate-500 dark:text-[#b99db9] text-sm leading-relaxed mt-1">
                    {isPaidMember
                      ? "Claude 분석 결과가 여기에 표시됩니다."
                      : "유료 회원 전용 기능입니다. 결제 후 Claude 에이전트 의견을 확인할 수 있습니다."}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded flex items-center gap-1">
                    {!isPaidMember && <Lock className="w-3 h-3" />}
                    Claude
                  </span>
                  <span className="text-2xl font-black dark:text-white">
                    {isPaidMember ? "OPEN" : "LOCK"}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Scale className="w-5 h-5 text-[#d411d4]" />
              상세 거래 내역
            </h3>

            <div className="rounded-xl border border-slate-200 dark:border-[#283039] overflow-hidden bg-[#f6f7f8] dark:bg-[#101922]">
              <div className="grid grid-cols-4 p-4 border-b border-slate-200 dark:border-[#4a344a] bg-slate-50 dark:bg-[#392839]/30 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#b99db9]">
                <div>체결 일자</div>
                <div className="text-right">체결가</div>
                <div className="text-right">수익률</div>
                <div className="text-right">점수</div>
              </div>

              <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
                {data.trades.map((trade) => (
                  <div
                    key={trade.sequence}
                    className="grid grid-cols-4 p-4 items-center border-b border-slate-100 dark:border-[#392839]/50 hover:bg-slate-50 dark:hover:bg-[#392839]/20 transition-colors"
                  >
                    <div className="text-xs text-slate-500 dark:text-[#c6aac6]">
                      #{trade.sequence} {formatDate(trade.tradeDate)}
                    </div>
                    <div className="text-right font-mono text-sm text-slate-800 dark:text-slate-100">
                      ₩{formatNumber(trade.sellPrice)}
                    </div>
                    <div
                      className={`text-right font-bold ${trade.roi >= 0 ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {trade.roi > 0 ? "+" : ""}
                      {trade.roi.toFixed(2)}%
                    </div>
                    <div className="text-right text-[#d411d4] font-bold">{trade.tradeScore.toFixed(1)}</div>
                  </div>
                ))}

                {data.trades.length === 0 && (
                  <div className="p-10 text-center text-slate-500 dark:text-[#b99db9] text-sm">
                    거래 내역이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-[#f6f7f8] dark:bg-[#101922] border border-slate-200 dark:border-[#283039] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-500 dark:text-[#b99db9]">총 투자금</p>
                <Wallet className="w-5 h-5 text-[#d411d4]" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                ₩{formatNumber(data.summary.totalInvestment)}
              </h4>
              <div className="mt-3 flex items-center text-xs font-bold text-slate-400 dark:text-[#9c859c]">
                <Gauge className="w-3 h-3 mr-1" />
                시뮬레이션 기준 투자금
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#f6f7f8] dark:bg-[#101922] border border-slate-200 dark:border-[#283039] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-500 dark:text-[#b99db9]">누적 수익률</p>
                <TrendingUp className="w-5 h-5 text-[#d411d4]" />
              </div>
              <h4
                className={`text-2xl font-black ${data.summary.totalRoi >= 0 ? "text-emerald-500" : "text-red-500"}`}
              >
                {data.summary.totalRoi > 0 ? "+" : ""}
                {data.summary.totalRoi.toFixed(2)}%
              </h4>
              <div className="mt-3 flex items-center text-xs font-bold text-slate-400 dark:text-[#9c859c]">
                <Target className="w-3 h-3 mr-1" />
                세션 전체 수익률
              </div>
            </div>

            <div className="p-6 rounded-xl bg-[#f6f7f8] dark:bg-[#101922] border border-slate-200 dark:border-[#283039] shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-500 dark:text-[#b99db9]">실현 손익</p>
                <CircleDollarSign className="w-5 h-5 text-[#d411d4]" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                {data.summary.totalRealizedProfit > 0 ? "+" : ""}₩
                {formatNumber(data.summary.totalRealizedProfit)}
              </h4>
              <div className="mt-3 flex items-center text-xs font-bold text-slate-400 dark:text-[#9c859c]">
                <Brain className="w-3 h-3 mr-1" />
                거래 결과 누적 합산
              </div>
            </div>
          </section>

          <section className="flex justify-center pb-8">
            <Button
              className="flex items-center gap-2 px-10 h-11 rounded-lg bg-[#392839] text-white font-bold hover:bg-[#4a344a] transition-all border border-[#4a344a]"
              onClick={() => router.push("/simulation")}
            >
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </Button>
          </section>
        </main>
      </div>
    </div>
  );
}
