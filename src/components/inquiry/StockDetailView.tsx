"use client";

import StockHeader from "./StockHeader";
import KeyStats from "./KeyStats";
import FundamentalData from "./FundamentalData";
import InquiryChart from "./InquiryChart";
import { useInquiryStore } from "@/store/inquiryStore";
import { useMemo } from "react";

const formatKRW = (value: number) => `₩${new Intl.NumberFormat('ko-KR').format(Math.round(value))}`;

const formatAsOfDate = (dateStr: string) => {
  const normalized = dateStr.replace(/[^0-9]/g, "");
  if (normalized.length === 8) {
    const y = normalized.slice(0, 4);
    const m = normalized.slice(4, 6);
    const d = normalized.slice(6, 8);
    return `${y}-${m}-${d}`;
  }
  return dateStr;
};

export default function StockDetailView() {
  const { stockInfo, rawItems, isLoading, error, selectedStockCode } = useInquiryStore();

  const derived = useMemo(() => {
    if (!rawItems || rawItems.length === 0) {
      return null;
    }

    const last = rawItems[rawItems.length - 1];
    const prev = rawItems.length >= 2 ? rawItems[rawItems.length - 2] : null;

    const lastClose = last.close;
    const prevClose = prev?.close ?? last.close;
    const change = lastClose - prevClose;
    const changePercent = prevClose === 0 ? 0 : (change / prevClose) * 100;

    const high52w = Math.max(...rawItems.map((i) => i.high));
    const low52w = Math.min(...rawItems.map((i) => i.low));
    const avgVolume = rawItems.reduce((sum, i) => sum + (i.volume ?? 0), 0) / rawItems.length;

    return {
      last,
      prev,
      lastClose,
      prevClose,
      change,
      changePercent,
      high52w,
      low52w,
      avgVolume,
    };
  }, [rawItems]);

  const header = {
    code: stockInfo?.code ?? selectedStockCode,
    name: stockInfo?.name ?? "",
    market: stockInfo?.market ?? "",
    price: derived ? formatKRW(derived.lastClose) : "-",
    change: derived ? `${derived.change >= 0 ? "+" : ""}${formatKRW(derived.change).replace("₩-", "-")}` : "-",
    changePercent: derived ? `${derived.changePercent >= 0 ? "+" : ""}${derived.changePercent.toFixed(2)}%` : "-",
    isPositive: derived ? derived.change >= 0 : true,
  };

  const keyStats = [
    { label: "52주 최고", value: derived ? formatKRW(derived.high52w) : "-" },
    { label: "52주 최저", value: derived ? formatKRW(derived.low52w) : "-" },
    { label: "평균 거래량", value: derived ? new Intl.NumberFormat('ko-KR').format(Math.round(derived.avgVolume)) : "-" },
    { label: "등락률(일)", value: derived ? `${derived.changePercent >= 0 ? "+" : ""}${derived.changePercent.toFixed(2)}%` : "-" },
  ];

  const fundamentalData = derived
    ? [
        { label: "전일 종가", value: formatKRW(derived.prevClose) },
        { label: "시가", value: formatKRW(derived.last.open) },
        { label: "고가", value: formatKRW(derived.last.high) },
        { label: "저가", value: formatKRW(derived.last.low) },
        { label: "종가", value: formatKRW(derived.last.close) },
        { label: "거래량", value: new Intl.NumberFormat('ko-KR').format(derived.last.volume ?? 0) },
      ]
    : [
        { label: "전일 종가", value: "-" },
        { label: "시가", value: "-" },
        { label: "고가", value: "-" },
        { label: "저가", value: "-" },
        { label: "종가", value: "-" },
        { label: "거래량", value: "-" },
      ];

  const asOfDate = derived?.last?.date ? formatAsOfDate(derived.last.date) : undefined;

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Stock Header */}
          <StockHeader
            symbol={header.code}
            name={header.name}
            exchange={header.market || "KR"}
            price={isLoading ? "Loading..." : header.price}
            change={isLoading ? "" : header.change}
            changePercent={isLoading ? "" : header.changePercent}
            isPositive={header.isPositive}
          />

          {/* Chart Section */}
          <InquiryChart />

          <div className="space-y-6">
            <KeyStats stats={keyStats} />
            <FundamentalData data={fundamentalData} asOfDate={asOfDate} />
          </div>
        </div>
      </div>
    </main>
  );
}
