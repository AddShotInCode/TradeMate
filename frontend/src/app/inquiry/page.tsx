"use client";

import Sidebar from "@/components/layout/Sidebar";
import WatchlistSidebar from "@/components/inquiry/WatchlistSidebar";
import StockDetailView from "@/components/inquiry/StockDetailView";
import { useInquiryStore } from "@/store/inquiryStore";
import { useEffect, useState } from "react";

export default function InquiryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { selectedStockCode, setSelectedStock, loadData } = useInquiryStore();

  useEffect(() => {
    // Initial load
    loadData(selectedStockCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex h-screen w-full bg-[#f6f7f8] dark:bg-[#101922] overflow-hidden">
      <Sidebar />

      <main className="flex-1 h-full overflow-hidden w-full">
        <div className="flex h-full overflow-hidden relative">
          {/* Mobile Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#137fec] text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Sidebar Overlay for Mobile */}
          {isSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`
          fixed lg:relative inset-y-0 left-0 z-40
          transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          transition-transform duration-300 ease-in-out
          w-[320px] lg:w-[360px]
        `}
          >
            <WatchlistSidebar
              selectedStockCode={selectedStockCode}
              onSelectStock={(code) => {
                setSelectedStock(code);
                setIsSidebarOpen(false);
              }}
            />
          </div>

          {/* Main Detail View */}
          <StockDetailView />
        </div>
      </main>
    </div>
  );
}
