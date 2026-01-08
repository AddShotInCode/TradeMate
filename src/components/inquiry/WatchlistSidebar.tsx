"use client";

import { Search, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: number;
  tag?: string;
}

const mockWatchlist: Stock[] = [
  { symbol: "AAPL", name: "Apple Inc.", price: "$189.45", change: 1.2, tag: "Tech" },
  { symbol: "TSLA", name: "Tesla, Inc.", price: "$173.80", change: -0.5 },
  { symbol: "NVDA", name: "NVIDIA Corp", price: "$890.22", change: 2.4 },
  { symbol: "MSFT", name: "Microsoft", price: "$420.55", change: 0.8 },
  { symbol: "AMZN", name: "Amazon.com", price: "$180.11", change: 0 },
];

interface WatchlistSidebarProps {
  selectedStock: string;
  onSelectStock: (symbol: string) => void;
}

export default function WatchlistSidebar({ selectedStock, onSelectStock }: WatchlistSidebarProps) {
  const [activeTab, setActiveTab] = useState<"watchlist" | "recents">("watchlist");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStocks = mockWatchlist.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="w-full lg:w-[360px] flex flex-col border-r border-[#283039] bg-[#111418] lg:max-w-[360px]">
      {/* Search Bar Area */}
      <div className="p-4 pb-0">
        <label className="flex flex-col h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full group focus-within:ring-2 focus-within:ring-[#137fec]/50 transition-all">
            <div className="text-[#9dabb9] flex border-none bg-[#283039] items-center justify-center pl-4 rounded-l-lg border-r-0">
              <Search className="size-5" />
            </div>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-0 border-none bg-[#283039] h-full placeholder:text-[#9dabb9] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
              placeholder="종목 검색 (예: AAPL)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-2">
        <div className="flex border-b border-[#3b4754] gap-6">
          <button
            onClick={() => setActiveTab("watchlist")}
            className={`flex flex-col items-center justify-center border-b-[2px] pb-3 pt-4 px-2 ${
              activeTab === "watchlist"
                ? "border-b-[#137fec] text-white"
                : "border-b-transparent text-[#9dabb9] hover:text-white"
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">관심종목</p>
          </button>
          <button
            onClick={() => setActiveTab("recents")}
            className={`flex flex-col items-center justify-center border-b-[2px] pb-3 pt-4 px-2 transition-colors ${
              activeTab === "recents"
                ? "border-b-[#137fec] text-white"
                : "border-b-transparent text-[#9dabb9] hover:text-white"
            }`}
          >
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">최근 조회</p>
          </button>
        </div>
      </div>

      {/* List Items */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {filteredStocks.map((stock) => (
          <div
            key={stock.symbol}
            onClick={() => onSelectStock(stock.symbol)}
            className={`flex items-center gap-4 rounded-lg px-4 py-3 justify-between cursor-pointer transition-colors border-l-4 ${
              selectedStock === stock.symbol
                ? "bg-[#137fec]/10 border-[#137fec]"
                : "hover:bg-[#1e252b] border-transparent"
            }`}
          >
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-2">
                <p className={`text-white text-base leading-normal line-clamp-1 ${
                  selectedStock === stock.symbol ? "font-bold" : "font-medium"
                }`}>
                  {stock.symbol}
                </p>
                {stock.tag && (
                  <span className="text-xs text-[#137fec] font-medium bg-[#137fec]/20 px-1.5 rounded">
                    {stock.tag}
                  </span>
                )}
              </div>
              <p className="text-[#9dabb9] text-sm font-normal leading-normal line-clamp-1">
                {stock.name}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-white text-base font-medium leading-normal">{stock.price}</p>
              <p
                className={`text-sm font-medium leading-normal flex items-center ${
                  stock.change > 0
                    ? "text-green-500"
                    : stock.change < 0
                    ? "text-red-500"
                    : "text-slate-400"
                }`}
              >
                {stock.change > 0 ? (
                  <>
                    <TrendingUp className="size-4 mr-0.5" />+{stock.change}%
                  </>
                ) : stock.change < 0 ? (
                  <>
                    <TrendingDown className="size-4 mr-0.5" />
                    {stock.change}%
                  </>
                ) : (
                  "0.0%"
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#283039]">
        <button className="flex items-center justify-center w-full gap-2 rounded-lg bg-[#283039] text-white py-2 hover:bg-[#3b4754] transition-colors">
          <Plus className="size-5" />
          <span className="text-sm font-medium">관심종목 추가</span>
        </button>
      </div>
    </aside>
  );
}
