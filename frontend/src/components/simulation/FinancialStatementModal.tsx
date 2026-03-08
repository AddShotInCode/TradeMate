"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSimulationStore } from "@/store/simulationStore";
import { statementService, StatementItem } from "@/services/statementService";
import { ExternalLink, Loader2, AlertCircle } from "lucide-react";

// Parse simulation date - kept for future use
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const parseSimDate = (dateStr: string) => {
  return dateStr;
};

export default function FinancialStatementModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { stockInfo, data, currentTimeIndex } = useSimulationStore();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [quarter, setQuarter] = useState<number>(1);
  const [items, setItems] = useState<StatementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current simulation date
  const currentSimDateStr = data[currentTimeIndex]?.time ? String(data[currentTimeIndex].time) : "";

  // Set default Year/Quarter based on Sim Date when opening
  useEffect(() => {
    if (isOpen && currentSimDateStr) {
      const simDate = new Date(currentSimDateStr);
      // Default to previous quarter of simulation date
      // Logic: if Sim is 2024-05 (Q2), 1Q 2024 report is likely out.
      // If Sim is 2024-02 (Q1), 4Q 2023 report is likely out.

      let targetYear = simDate.getFullYear();
      let targetQuarter = Math.ceil((simDate.getMonth() + 1) / 3) - 1;

      if (targetQuarter === 0) {
        targetYear -= 1;
        targetQuarter = 4;
      }

      setYear(targetYear);
      setQuarter(targetQuarter);
    }
  }, [isOpen, currentSimDateStr]);

  const handleSearch = async () => {
    if (!stockInfo) return;

    setLoading(true);
    setError(null);
    setItems([]);

    try {
      const response = await statementService.getStatements(stockInfo.code, year, quarter);

      console.log("Sim Date Str:", currentSimDateStr);
      console.log("API Response Items:", response.items);

      // Filter logic: Only show reports released BEFORE or ON the simulation date
      const validItems = response.items.filter((item) => {
        // item.rcept_dt is YYYYMMDD
        // currentSimDateStr is YYYY-MM-DD
        const rceptDateNum = parseInt(item.rcept_dt);
        const simDateNum = parseInt(currentSimDateStr.replace(/-/g, ""));

        return rceptDateNum <= simDateNum;
      });

      if (response.items.length > 0 && validItems.length === 0) {
        setError(
          `해당 분기 보고서는 존재하지만,\n시뮬레이션 시점(${currentSimDateStr}) 이후에 공시되어 볼 수 없습니다.`
        );
      } else if (response.items.length === 0) {
        setError("해당 분기의 공시 데이터가 존재하지 않습니다.");
      } else {
        setItems(validItems);
      }
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status === 404) {
        setError("데이터가 존재하지 않습니다.");
      } else {
        setError("보고서를 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate Year Options (up to Sim Year, down to 2021)
  const renderYearOptions = () => {
    if (!currentSimDateStr) return null;
    const simYear = new Date(currentSimDateStr).getFullYear();

    const years = [];
    for (let y = simYear; y >= 2021; y--) {
      years.push(y);
    }
    return years.map((y) => (
      <SelectItem key={y} value={String(y)}>
        {y}년
      </SelectItem>
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#1c252e] border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            재무제표 조회
            <span className="text-sm font-normal text-slate-400">({stockInfo?.name})</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex gap-2">
            <Select value={String(year)} onValueChange={(v: string) => setYear(parseInt(v))}>
              <SelectTrigger className="bg-[#283039] border-slate-600">
                <SelectValue placeholder="연도" />
              </SelectTrigger>
              <SelectContent className="bg-[#283039] border-slate-600 text-white">
                {renderYearOptions()}
              </SelectContent>
            </Select>

            <Select value={String(quarter)} onValueChange={(v: string) => setQuarter(parseInt(v))}>
              <SelectTrigger className="bg-[#283039] border-slate-600">
                <SelectValue placeholder="분기" />
              </SelectTrigger>
              <SelectContent className="bg-[#283039] border-slate-600 text-white">
                <SelectItem value="1">1분기 (1~3월)</SelectItem>
                <SelectItem value="2">2분기 (4~6월)</SelectItem>
                <SelectItem value="3">3분기 (7~9월)</SelectItem>
                <SelectItem value="4">4분기 (10~12월)</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "조회"}
            </Button>
          </div>

          <div className="min-h-[200px] border border-slate-700 rounded-lg p-4 bg-[#101922]">
            {items.length > 0 ? (
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-[#283039] rounded hover:bg-[#3b4754] transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-blue-400">
                        {year}년 {quarter}분기 보고서 ({item.rcept_dt.substring(0, 4)}.
                        {item.rcept_dt.substring(4, 6)}.{item.rcept_dt.substring(6, 8)})
                      </span>
                      <span className="text-xs text-slate-400">DART 공시</span>
                    </div>
                    <a
                      href={item.rcept_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-300 hover:text-white"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                {error ? (
                  <>
                    <AlertCircle className="w-8 h-8 text-red-400" />
                    <span className="text-sm text-center px-4">{error}</span>
                  </>
                ) : (
                  <span>연도와 분기를 선택하여 조회하세요.</span>
                )}
                <div className="text-xs text-slate-600 mt-4 text-center space-y-1">
                  <p>
                    * 시뮬레이션 시점({currentSimDateStr}) 이전에 공시된 리포트만 조회 가능합니다.
                  </p>
                  <p className="font-bold pt-2">[각 분기별 보고서 업로드 시점]</p>
                  <p>1분기: 당해 5월 / 2분기: 당해 8월</p>
                  <p>3분기: 당해 11월 / 4분기: 다음해 3월</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
