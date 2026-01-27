import { create } from 'zustand';
import { stockService } from '@/services/stockService';
import { CandlestickData } from 'lightweight-charts';

export interface TradeLog {
  id: string;
  time: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  price: number;
  qty: number;
  slippage: number;
  fee: number;
  pnl: number;
  entryReason?: string; // Add optional entry reason
}

export interface Position {
  symbol: string;
  side: 'BUY' | 'SELL';
  entryPrice: number;
  qty: number;
  sl?: number;
  tp?: number;
  entryReason?: string; // Add optional entry reason
}

interface StockInfo {
    code: string;
    name: string;
    market: string;
}

interface SimulationState {
  // Data State
  originalData: CandlestickData[]; // Store raw daily data
  data: CandlestickData[]; // Displayed data (Daily, Weekly, or Monthly)
  interval: '1D' | '1W' | '1M';
  isLoading: boolean;
  stockInfo: StockInfo | null;
  error: string | null;

  // Account State
  balance: number;
  positions: Position[];
  tradeLogs: TradeLog[];
  
  // Chart State
  currentTimeIndex: number;
  maxTimeIndex: number; 
  currentPrice: number;

  // Actions
  loadData: (code: string, start: string, end: string) => Promise<void>;
  setInterval: (interval: '1D' | '1W' | '1M') => void;
  placeOrder: (side: 'BUY' | 'SELL', qty: number, price: number, sl?: number, tp?: number, entryReason?: string) => void;
  closePosition: (positionIndices: number[]) => void;
  sellPosition: (qty: number) => void; 
  nextCandle: () => void;
  prevCandle: () => void;
  setCurrentPrice: (price: number) => void;
}

// Helper to convert API item to CandlestickData
const mapToCandle = (item: any): CandlestickData => ({
    time: item.date,
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close
});

// Aggregation Helpers
const getWeekKey = (dateStr: string) => {
    // Advanced: ISO Week would be better, but simple approach:
    // Create date, find Monday of that week.
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1;
    const day = parseInt(dateStr.substring(6, 8));
    const d = new Date(year, month, day);
    const dayOfWeek = d.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));
    
    // Format YYYYMMDD
    const y = monday.getFullYear();
    const m = String(monday.getMonth() + 1).padStart(2, '0');
    const dd = String(monday.getDate()).padStart(2, '0');
    return `${y}${m}${dd}`;
};

const getMonthKey = (dateStr: string) => {
    return dateStr.substring(0, 6); // YYYYMM
};

const aggregateData = (dailyData: CandlestickData[], interval: '1D' | '1W' | '1M'): CandlestickData[] => {
    if (interval === '1D') return dailyData;

    const groups: Record<string, CandlestickData[]> = {};
    
    dailyData.forEach(candle => {
        // Candle time is YYYYMMDD string from previous mapToCandle
        const dateStr = String(candle.time).replace(/-/g, "");
        let key = "";
        
        if (interval === '1W') {
            key = getWeekKey(dateStr);
        } else {
            key = getMonthKey(dateStr);
        }
        
        if (!groups[key]) groups[key] = [];
        groups[key].push(candle);
    });

    // Compute aggregated candles
    const aggregated: CandlestickData[] = Object.keys(groups).sort().map(key => {
        const candles = groups[key];
        const open = candles[0].open;
        const close = candles[candles.length - 1].close;
        const high = Math.max(...candles.map(c => c.high as number));
        const low = Math.min(...candles.map(c => c.low as number));
        // Use the date of the LAST candle in the group for display? 
        // Or the FIRST? TradingView usually uses the start of the period.
        // Let's use the START date (key for Week is Monday, Key for month is YYYYMM)
        // Actually, lightweight-charts needs YYYY-MM-DD. 
        // If key is YYYYMM, append 01.
        // If key is YYYYMMDD (Monday), use it.
        
        let time = "";
        if (interval === '1M') {
            const y = key.substring(0, 4);
            const m = key.substring(4, 6);
            time = `${y}-${m}-01`;
        } else {
            // Week key is YYYYMMDD
            const y = key.substring(0, 4);
            const m = key.substring(4, 6);
            const d = key.substring(6, 8);
            time = `${y}-${m}-${d}`;
        }

        return { time, open, high, low, close };
    });

    return aggregated;
};

// Start of Store
export const useSimulationStore = create<SimulationState>((set, get) => ({
  originalData: [], // New state to hold raw daily data
  data: [],
  interval: '1D',
  isLoading: false,
  stockInfo: null,
  error: null,

  balance: 100000000, 
  positions: [],
  tradeLogs: [],
  currentTimeIndex: 0, 
  maxTimeIndex: 0, 
  currentPrice: 0, 

  loadData: async (code, start, end) => {
    set({ isLoading: true, error: null });
    try {
        const response = await stockService.fetchStockData(code, start, end);
        let items = response.items;
        items.sort((a, b) => a.date.localeCompare(b.date));

        const candles = items.map(mapToCandle);
        
        if (candles.length === 0) {
            set({ isLoading: false, error: "No data found" });
            return;
        }

        // Determine Start Index
        const targetDate = start.replace(/-/g, "");
        let initialIndex = items.findIndex(item => item.date.replace(/-/g, "") >= targetDate);
        if (initialIndex === -1) initialIndex = 0;

        const initialPrice = candles[initialIndex].close as number;

        set({ 
            originalData: candles, // Store raw
            data: candles,         // Default 1D
            interval: '1D',        // Reset to 1D on load
            stockInfo: response.stock,
            isLoading: false,
            currentTimeIndex: initialIndex,
            maxTimeIndex: candles.length - 1,
            currentPrice: initialPrice
        });
    } catch (e: any) {
        set({ isLoading: false, error: e.message || "Failed to load" });
    }
  },

  setInterval: (interval) => set((state) => {
      if (state.interval === interval) return state;

      const aggregated = aggregateData(state.originalData, interval);
      
      // 1. Get the current simulation date from the ACTIVE data view
      const currentSimCandle = state.data[state.currentTimeIndex];
      // If no data, reset
      if (!currentSimCandle) {
          return {
              interval,
              data: aggregated,
              maxTimeIndex: aggregated.length - 1,
              currentTimeIndex: 0
          };
      }

      const currentSimDateStr = String(currentSimCandle.time);
      
      // 2. Find the corresponding index in the NEW aggregated view
      // We want the latest candle in the new view that is <= currentSimDateStr
      let newIndex = 0;
      
      // Since data is sorted, we can iterate or find
      // aggregated candles have 'time' as start-of-period usually (or customized in aggregateData)
      // Our aggregateData returns YYYY-MM-DD string.
      
      // Example: 
      // Current: 2024-01-05 (1D)
      // New: 1W (Week starts 2024-01-01)
      // We want the 2024-01-01 candle.
      
      // Example 2:
      // Current: 2024-02-01 (1M) -> Switching to 1D
      // New: 1D. We want 2024-02-01 candle.
      
      for (let i = 0; i < aggregated.length; i++) {
          if (String(aggregated[i].time) > currentSimDateStr) {
              // This candle is AFTER our current time.
              // So the previous one (i-1) was the correct one.
              // If i=0, then all candles are after? (Shouldn't happen if subset)
              newIndex = Math.max(0, i - 1);
              break; 
          }
          // If we are at the last item and it's still <= current, then it's the last item
          newIndex = i;
      }
      
      return {
          interval,
          data: aggregated,
          maxTimeIndex: aggregated.length - 1,
          currentTimeIndex: newIndex
      };
  }),

  placeOrder: (side, qty, price, sl, tp, entryReason) => set((state) => {
    // ... (Keep existing logic, just copy-paste carefully or imply no change if possible, 
    // but tool requires full block replacement for soundness usually, 
    // actually this tool allows replacing chunks.
    // I am replacing strictly the Interface and the create() body start to end to be safe?
    // StartLine 36 -> EndLine 362 covers almost everything inside 'create'.
    // Let's use the provided code for placeOrder and others as they were.
    // Wait, the previous view_file output lines 144-179 is placeOrder.
    // I will just include it.
    
    // Actually, I can allow partial replacements, but since I am introducing new state and helper functions at the top,
    // and modifying loadData and adding setInterval, it affects the struct significantly.
    // Let's proceed with replacing the Interface fully and the create block.
    
    // ... [placeOrder logic maintained]
    const fee = 2000; 
    const slippage = 0;
    const executePrice = price;
    
    const newPosition: Position = {
        symbol: state.stockInfo?.name || 'STOCK',
        side,
        entryPrice: executePrice,
        qty,
        sl: sl && sl > 0 ? sl : undefined,
        tp: tp && tp > 0 ? tp : undefined,
        entryReason
    };

    const newLog: TradeLog = {
        id: Math.random().toString(36).substr(2, 9),
        time: state.data[state.currentTimeIndex]?.time as string || new Date().toLocaleTimeString('ko-KR'),
        symbol: state.stockInfo?.name || 'STOCK',
        side,
        price: executePrice,
        qty,
        slippage,
        fee,
        pnl: 0,
        entryReason
    };

    return {
        balance: state.balance - fee,
        tradeLogs: [newLog, ...state.tradeLogs],
        positions: [...state.positions, newPosition] 
    };
  }),

  // ... [closePosition]
  closePosition: (positionIndices) => set((state) => {
    const positionsToClose = positionIndices.map(idx => state.positions[idx]).filter(Boolean);
    if (positionsToClose.length === 0) return state;

    const remainingPositions = state.positions.filter((_, idx) => !positionIndices.includes(idx));
    let newBalance = state.balance;
    const newLogs = [...state.tradeLogs];
    const currentPrice = state.currentPrice;

    positionsToClose.forEach(pos => {
        const fee = 2000;
        const slippage = 0;
        const closePrice = currentPrice;
        
        const pnl = pos.side === 'BUY' 
            ? (closePrice - pos.entryPrice) * pos.qty 
            : (pos.entryPrice - closePrice) * pos.qty;

        newBalance += pnl - fee;

        newLogs.unshift({
            id: Math.random().toString(36).substr(2, 9),
            time: state.data[state.currentTimeIndex]?.time as string || new Date().toLocaleTimeString('ko-KR'),
            symbol: pos.symbol,
            side: pos.side === 'BUY' ? 'SELL' : 'BUY',
            price: closePrice,
            qty: pos.qty,
            slippage,
            fee,
            pnl,
            entryReason: pos.entryReason
        });
    });

    return {
        balance: newBalance,
        positions: remainingPositions,
        tradeLogs: newLogs
    };
  }),

  // ... [sellPosition]
  sellPosition: (qty) => set((state) => {
    let remainingQtyToSell = qty;
    let newBalance = state.balance;
    const newLogs = [...state.tradeLogs];
    const currentPrice = state.currentPrice;
    
    const newPositions = [...state.positions];
    
    for (let i = 0; i < newPositions.length; i++) {
        if (remainingQtyToSell <= 0) break;
        
        const pos = newPositions[i];
        if (pos.side !== 'BUY') continue;
        
        const closeQty = Math.min(pos.qty, remainingQtyToSell);
        const fee = 2000;
        const slippage = 0;
        const closePrice = currentPrice;
        
        const pnl = (closePrice - pos.entryPrice) * closeQty;
        newBalance += pnl - fee; 
        
        newLogs.unshift({
            id: Math.random().toString(36).substr(2, 9),
            time: state.data[state.currentTimeIndex]?.time as string || new Date().toLocaleTimeString('ko-KR'),
            symbol: pos.symbol,
            side: 'SELL',
            price: closePrice,
            qty: closeQty,
            slippage,
            fee,
            pnl,
            entryReason: pos.entryReason
        });
        
        newPositions[i] = { ...pos, qty: pos.qty - closeQty };
        remainingQtyToSell -= closeQty;
    }

    const finalPositions = newPositions.filter(p => p.qty > 0);

    return {
        balance: newBalance,
        positions: finalPositions,
        tradeLogs: newLogs
    };
  }),

  nextCandle: () => set((state) => {
    // If not at end, proceed
    const nextIndex = state.currentTimeIndex + 1;
    if (nextIndex >= state.data.length) return state;

    // HOWEVER: In Week/Month view, what does 'next' mean?
    // It means "Show next Week/Month". 
    // This is fine. The user "sees" one more bar of the current timeframe.
    // The "Trade" happens at the CLOSE of that bar (simplified).
    // Or we keep simulationCurrentDate logic.
    // For now, simple approach: Advance index in current data array.
    
    const nextCandleData = state.data[nextIndex];
    let newBalance = state.balance;
    const newTradeLogs = [...state.tradeLogs];
    const activePositions: Position[] = [];
    const nextPrice = Number(nextCandleData.close);

    // Check SL/TP
    state.positions.forEach(pos => {
        let closePrice = 0;
        let isClosed = false;
        const low = Number(nextCandleData.low);
        const high = Number(nextCandleData.high);

        if (pos.side === 'BUY') {
            // SL/TP disabled as per user request (Manual exit only)
            /* 
            if (pos.sl && pos.sl > 0 && low <= pos.sl) {
                closePrice = pos.sl; 
                isClosed = true;
            } else if (pos.tp && pos.tp > 0 && high >= pos.tp) {
                closePrice = pos.tp;
                isClosed = true;
            } 
            */
        }
        else if (pos.side === 'SELL') {
             // SL/TP disabled as per user request (Manual exit only)
             /* 
             if (pos.sl && pos.sl > 0 && high >= pos.sl) {
                closePrice = pos.sl; 
                isClosed = true;
            } else if (pos.tp && pos.tp > 0 && low <= pos.tp) {
                closePrice = pos.tp; 
                isClosed = true;
            } 
            */
        }

        if (isClosed) {
            const fee = 2000;
            const pnl = pos.side === 'BUY' 
                ? (closePrice - pos.entryPrice) * pos.qty
                : (pos.entryPrice - closePrice) * pos.qty;

            newBalance += pnl - fee;
            
            // Append reason
            let autoCloseReason = pos.entryReason || "";
            if (pos.side === 'BUY') {
                 if (closePrice <= pos.sl!) autoCloseReason = `[Stop Loss] ${autoCloseReason}`;
                 else if (closePrice >= pos.tp!) autoCloseReason = `[Take Profit] ${autoCloseReason}`;
            } else {
                 if (closePrice >= pos.sl!) autoCloseReason = `[Stop Loss] ${autoCloseReason}`;
                 else if (closePrice <= pos.tp!) autoCloseReason = `[Take Profit] ${autoCloseReason}`;
            }

            newTradeLogs.unshift({
                id: Math.random().toString(36).substr(2, 9),
                time: String(nextCandleData.time),
                symbol: pos.symbol,
                side: pos.side === 'BUY' ? 'SELL' : 'BUY', 
                price: closePrice,
                qty: pos.qty,
                slippage: 0, 
                fee,
                pnl,
                entryReason: autoCloseReason.trim()
            });
        } else {
            activePositions.push(pos);
        }
    });

    return {
        currentTimeIndex: nextIndex,
        balance: newBalance,
        positions: activePositions,
        tradeLogs: newTradeLogs,
        currentPrice: nextPrice 
    };
  }),

  prevCandle: () => set((state) => ({
    currentTimeIndex: Math.max(0, state.currentTimeIndex - 1)
  })),

  setCurrentPrice: (price) => set({ currentPrice: price })
}));
