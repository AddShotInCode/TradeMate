"use client";

import StockHeader from "./StockHeader";
import StockChart from "./StockChart";
import KeyStats from "./KeyStats";
import FundamentalData from "./FundamentalData";
import PrincipleCheck from "./PrincipleCheck";

interface StockDetailViewProps {
  symbol: string;
}

// Mock data - 실제로는 API에서 가져올 데이터
const stockData: Record<string, {
  name: string;
  exchange: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
}> = {
  AAPL: {
    name: "Apple Inc.",
    exchange: "NASDAQ",
    price: "$189.45",
    change: "+2.25",
    changePercent: "1.2%",
    isPositive: true,
  },
  TSLA: {
    name: "Tesla, Inc.",
    exchange: "NASDAQ",
    price: "$173.80",
    change: "-0.87",
    changePercent: "0.5%",
    isPositive: false,
  },
  NVDA: {
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    price: "$890.22",
    change: "+21.37",
    changePercent: "2.4%",
    isPositive: true,
  },
  MSFT: {
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    price: "$420.55",
    change: "+3.36",
    changePercent: "0.8%",
    isPositive: true,
  },
  AMZN: {
    name: "Amazon.com, Inc.",
    exchange: "NASDAQ",
    price: "$180.11",
    change: "+0.00",
    changePercent: "0.0%",
    isPositive: true,
  },
};

const keyStats = [
  { label: "시가총액", value: "2.95T" },
  { label: "평균 거래량", value: "54.2M" },
  { label: "P/E 비율", value: "28.4" },
  { label: "배당 수익률", value: "0.52%" },
];

const fundamentalData = [
  { label: "전일 종가", value: "$187.20" },
  { label: "시가", value: "$188.00" },
  { label: "52주 최고가", value: "$199.62" },
  { label: "52주 최저가", value: "$164.08" },
  { label: "베타 (5년 월간)", value: "1.28" },
  { label: "EPS (TTM)", value: "6.43" },
];

const principles = [
  { label: "추세 정렬 (일간)", passed: true },
  { label: "거래량 > 20일 평균", passed: true },
  { label: "RSI 다이버전스", passed: false },
];

export default function StockDetailView({ symbol }: StockDetailViewProps) {
  const data = stockData[symbol] || stockData.AAPL;

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {/* Stock Header */}
          <StockHeader
            symbol={symbol}
            name={data.name}
            exchange={data.exchange}
            price={data.price}
            change={data.change}
            changePercent={data.changePercent}
            isPositive={data.isPositive}
          />

          {/* Chart Section */}
          <StockChart />

          {/* Split Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fundamentals Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Stats Grid */}
              <KeyStats stats={keyStats} />

              {/* Extended Info Table */}
              <FundamentalData data={fundamentalData} />
            </div>

            {/* 분석 컬럼 */}
            <div className="space-y-6">
              {/* 원칙 체크 (TradeMate 고유 기능) */}
              <PrincipleCheck principles={principles} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
