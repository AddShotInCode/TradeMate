import { create } from "zustand";
import { stockService } from "@/services/stockService";
import { CandlestickData } from "lightweight-charts";
import type { StockItem } from "@/services/stockService";
import type { BusinessDay } from "lightweight-charts";

interface StockInfo {
  code: string;
  name: string;
  market: string;
}

interface InquiryState {
  // Data State
  data: CandlestickData[]; // Displayed data
  rawItems: StockItem[]; // Raw OHLCV items for derived stats
  interval: "1D"; // Currently only support 1D for inquiry
  isLoading: boolean;
  stockInfo: StockInfo | null;
  error: string | null;

  // Selected Stock State
  selectedStockCode: string;

  // Actions
  loadData: (code: string) => Promise<void>;
  setSelectedStock: (code: string) => void;
}

// Helper to convert API item to CandlestickData
const toBusinessDay = (dateStr: string): BusinessDay => {
  const normalized = dateStr.replace(/[^0-9]/g, ""); // supports YYYY-MM-DD and YYYYMMDD
  if (normalized.length !== 8) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  const year = Number(normalized.slice(0, 4));
  const month = Number(normalized.slice(4, 6));
  const day = Number(normalized.slice(6, 8));
  return { year, month, day };
};

const mapToCandle = (item: StockItem): CandlestickData => ({
  time: toBusinessDay(item.date),
  open: item.open,
  high: item.high,
  low: item.low,
  close: item.close,
});

export const useInquiryStore = create<InquiryState>((set, get) => ({
  data: [],
  rawItems: [],
  interval: "1D",
  isLoading: false,
  stockInfo: null,
  error: null,
  selectedStockCode: "005930", // Default to Samsung Electronics

  loadData: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      // Fetch last 1 year of data for inquiry view
      const endDate = new Date().toISOString().split("T")[0].replace(/-/g, "");
      const startDateObj = new Date();
      startDateObj.setFullYear(startDateObj.getFullYear() - 1);
      const startDate = startDateObj.toISOString().split("T")[0].replace(/-/g, "");

      const response = await stockService.fetchStockData(code, startDate, endDate);

      const sortedItems = [...response.items].sort((a, b) => a.date.localeCompare(b.date));
      const candleData = sortedItems.map(mapToCandle);

      set({
        data: candleData,
        rawItems: sortedItems,
        stockInfo: {
          code: response.stock.code,
          name: response.stock.name,
          market: response.stock.market,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load inquiry data:", error);
      set({ error: "Failed to load stock data", isLoading: false, data: [], rawItems: [] });
    }
  },

  setSelectedStock: (code: string) => {
    set({ selectedStockCode: code });
    get().loadData(code);
  },
}));
