"use client";

import { useState } from "react";
import LandingNavigation from "@/components/landing/LandingNavigation";
import LandingFooter from "@/components/landing/LandingFooter";
import WatchlistSidebar from "@/components/inquiry/WatchlistSidebar";
import StockDetailView from "@/components/inquiry/StockDetailView";

export default function InquiryPage() {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#101922] text-white font-sans flex flex-col">
      {/* Navigation */}
      <LandingNavigation />
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#137fec] text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
        <div className={`
          fixed lg:relative inset-y-0 left-0 z-40
          transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          transition-transform duration-300 ease-in-out
          w-[320px] lg:w-[360px]
        `}>
          <WatchlistSidebar 
            selectedStock={selectedStock} 
            onSelectStock={(symbol) => {
              setSelectedStock(symbol);
              setIsSidebarOpen(false);
            }}
          />
        </div>

        {/* Main Detail View */}
        <StockDetailView symbol={selectedStock} />
      </div>
      
      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
