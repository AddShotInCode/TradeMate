"use client";

import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { TARGET_STOCKS } from "@/constants/targetStocks";

interface WatchlistSidebarProps {
  selectedStockCode: string;
  onSelectStock: (code: string) => void;
}

export default function WatchlistSidebar({
  selectedStockCode,
  onSelectStock,
}: WatchlistSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStocks = TARGET_STOCKS.filter((stock) => {
    const q = searchQuery.trim();
    if (!q) return true;
    return stock.name.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <aside className="w-full h-full lg:w-[360px] flex flex-col min-h-0 border-r border-[#283039] bg-[#111418] lg:max-w-[360px]">
      {/* Search Bar Area */}
      <div className="p-4 pb-0">
        <label className="flex flex-col h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full group focus-within:ring-2 focus-within:ring-[#137fec]/50 transition-all">
            <div className="text-[#9dabb9] flex border-none bg-[#283039] items-center justify-center pl-4 rounded-l-lg border-r-0">
              <Search className="size-5" />
            </div>
            <input
              className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-none focus:ring-0 border-none bg-[#283039] h-full placeholder:text-[#9dabb9] px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
              placeholder="종목 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </label>
      </div>

      {/* Section Title */}
      <div className="px-4 pt-4 pb-2">
        <p className="text-sm font-bold leading-normal tracking-[0.015em] text-white">목록</p>
      </div>

      {/* List Items */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {filteredStocks.map((stock) => (
          <div
            key={stock.code}
            onClick={() => onSelectStock(stock.code)}
            className={`flex items-center gap-4 rounded-lg px-4 py-3 justify-between cursor-pointer transition-colors border-l-4 ${
              selectedStockCode === stock.code
                ? "bg-[#137fec]/10 border-[#137fec]"
                : "hover:bg-[#1e252b] border-transparent"
            }`}
          >
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-2">
                <p
                  className={`text-white text-base leading-normal line-clamp-1 ${
                    selectedStockCode === stock.code ? "font-bold" : "font-medium"
                  }`}
                >
                  {stock.name}
                </p>
                {stock.market && (
                  <span className="text-xs text-[#137fec] font-medium bg-[#137fec]/20 px-1.5 rounded">
                    {stock.market}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end" />
          </div>
        ))}
      </div>
    </aside>
  );
}
