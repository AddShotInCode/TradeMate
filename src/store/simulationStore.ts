import { create } from "zustand";
import { stockService } from "@/services/stockService";
import { simulationService, TradeData } from "@/services/simulationService";
import { CandlestickData } from "lightweight-charts";

export interface TradeLog {
  id: string;
  time: string;
  symbol: string;
  side: "BUY" | "SELL";
  price: number;
  qty: number;
  slippage: number;
  fee: number;
  pnl: number;
  entryReason?: string;
}

export interface Position {
  symbol: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  qty: number;
  sl?: number;
  tp?: number;
  entryReason?: string;
}

interface StockInfo {
  code: string;
  name: string;
  market: string;
}

interface SimulationState {
  // Identity
  currentSimulationId: number | null;
  isFinished: boolean; // New State

  // Data State
  originalData: CandlestickData[];
  data: CandlestickData[];
  interval: "1D" | "1W" | "1M";
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
  loadSimulation: (id: number) => Promise<void>;

  loadData: (code: string, start: string, end: string) => Promise<void>; // Keep for compatibility if needed, or purely internal
  setInterval: (interval: "1D" | "1W" | "1M") => void;
  placeOrder: (
    side: "BUY" | "SELL",
    qty: number,
    price: number,
    sl?: number,
    tp?: number,
    entryReason?: string,
  ) => Promise<void>;
  closePosition: (positionIndices: number[]) => Promise<void>;
  sellPosition: (qty: number, comment?: string) => Promise<void>;
  nextCandle: () => void;
  prevCandle: () => void;
  setCurrentPrice: (price: number) => void;
}

const mapToCandle = (item: any): CandlestickData => ({
  time: item.date,
  open: item.open,
  high: item.high,
  low: item.low,
  close: item.close,
});

const getWeekKey = (dateStr: string) => {
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  const d = new Date(year, month, day);
  const dayOfWeek = d.getDay();
  const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));

  const y = monday.getFullYear();
  const m = String(monday.getMonth() + 1).padStart(2, "0");
  const dd = String(monday.getDate()).padStart(2, "0");
  return `${y}${m}${dd}`;
};

const getMonthKey = (dateStr: string) => {
  return dateStr.substring(0, 6);
};

const aggregateData = (
  dailyData: CandlestickData[],
  interval: "1D" | "1W" | "1M",
): CandlestickData[] => {
  if (interval === "1D") return dailyData;

  const groups: Record<string, CandlestickData[]> = {};

  dailyData.forEach((candle) => {
    const dateStr = String(candle.time).replace(/-/g, "");
    let key = "";

    if (interval === "1W") {
      key = getWeekKey(dateStr);
    } else {
      key = getMonthKey(dateStr);
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(candle);
  });

  const aggregated: CandlestickData[] = Object.keys(groups)
    .sort()
    .map((key) => {
      const candles = groups[key];
      const open = candles[0].open;
      const close = candles[candles.length - 1].close;
      const high = Math.max(...candles.map((c) => c.high as number));
      const low = Math.min(...candles.map((c) => c.low as number));

      let time = "";
      if (interval === "1M") {
        const y = key.substring(0, 4);
        const m = key.substring(4, 6);
        time = `${y}-${m}-01`;
      } else {
        const y = key.substring(0, 4);
        const m = key.substring(4, 6);
        const d = key.substring(6, 8);
        time = `${y}-${m}-${d}`;
      }

      return { time, open, high, low, close };
    });

  return aggregated;
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  currentSimulationId: null,
  isFinished: false,
  originalData: [],
  data: [],
  interval: "1D",
  isLoading: false,
  stockInfo: null,
  error: null,

  balance: 100000000,
  positions: [],
  tradeLogs: [],
  currentTimeIndex: 0,
  maxTimeIndex: 0,
  currentPrice: 0,

  loadSimulation: async (id: number) => {
    set({ isLoading: true, error: null, currentSimulationId: id });
    try {
      const listRes = await simulationService.getList();
      const sim = listRes.simulations.find((s) => s.id === Number(id));

      if (!sim) throw new Error("Simulation not found");

      const isFinished = !!sim.endDate;

      // Load Chart
      // Fix: Ensure dates are in YYYYMMDD format for the stock service
      const formatToYYYYMMDD = (date: string) => date.replaceAll("-", "");

      const todayStr = new Date().toISOString().split("T")[0].replaceAll("-", "");

      const stockRes = await stockService.fetchStockData(
        sim.stockCode,
        formatToYYYYMMDD(sim.startDate),
        sim.endDate ? formatToYYYYMMDD(sim.endDate) : todayStr,
      );
      let items = stockRes.items;
      items.sort((a, b) => a.date.localeCompare(b.date));
      const candles = items.map(mapToCandle);

      if (candles.length === 0) throw new Error("No data found");

      // Load History
      const historyRes = await simulationService.getTrades(id);
      const trades = historyRes.trades;
      trades.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Reconstruct
      let currentBalance = 100000000;
      let positions: Position[] = [];
      const tradeLogs: TradeLog[] = [];
      const stockName = stockRes.stock?.name || sim.stockCode;

      trades.forEach((t) => {
        const fee = 2000;
        const tradeAmount = t.price * t.volume;

        if (t.type === "B") {
          currentBalance -= tradeAmount + fee;
          positions.push({
            symbol: stockName,
            side: "BUY",
            entryPrice: t.price,
            qty: t.volume,
            sl: t.lower,
            tp: t.upper,
            entryReason: t.comment,
          });
          tradeLogs.push({
            id: Math.random().toString(36),
            time: t.timestamp,
            symbol: stockName,
            side: "BUY",
            price: t.price,
            qty: t.volume,
            slippage: 0,
            fee,
            pnl: 0,
            entryReason: t.comment,
          });
        } else {
          // SELL
          currentBalance += tradeAmount - fee;
          // Reduce positions
          let remaining = t.volume;
          let realizedPnl = 0;
          const nextPositions: Position[] = [];

          for (const pos of positions) {
            if (remaining <= 0) {
              nextPositions.push(pos);
              continue;
            }
            if (pos.side === "BUY") {
              const closeQty = Math.min(pos.qty, remaining);
              realizedPnl += (t.price - pos.entryPrice) * closeQty;
              remaining -= closeQty;
              if (pos.qty > closeQty) {
                nextPositions.push({ ...pos, qty: pos.qty - closeQty });
              }
            } else {
              nextPositions.push(pos);
            }
          }
          positions = nextPositions;

          tradeLogs.push({
            id: Math.random().toString(36),
            time: t.timestamp,
            symbol: stockName,
            side: "SELL",
            price: t.price,
            qty: t.volume,
            slippage: 0,
            fee,
            pnl: realizedPnl,
            entryReason: t.comment,
          });
        }
      });

      // Determine Initial Time Index
      // If ongoing (not finished), we want to start AFTER the last trade,
      // i.e., at the candle corresponding to the last trade's date or the last available candle if no trades.
      // However, the user wants to "continue".
      // Let's find the index corresponding to the last trade's timestamp.

      let initialIndex = 0;

      if (isFinished) {
        // If finished, maybe show the end? or start? let's stick to end for now or standard logic
        initialIndex = candles.length - 1;
      } else {
        // If active, try to find the last trade date
        if (trades.length > 0) {
          const lastTradeDate = trades[trades.length - 1].timestamp; // YYYY-MM-DD
          // Find candle index matching this date
          // The candles are sorted by date ascending.
          // We want to be AT that candle (so we see the state at that time).
          const foundIndex = candles.findIndex((c) => String(c.time) === lastTradeDate);

          if (foundIndex !== -1) {
            initialIndex = foundIndex;
          } else {
            // Fallback: Use the closest index less than or equal to trade date, or 0
            // Since candles are sorted:
            const lastTradeTime = new Date(lastTradeDate).getTime();
            let closest = 0;
            for (let i = 0; i < candles.length; i++) {
              const cTime = new Date(String(candles[i].time)).getTime();
              if (cTime <= lastTradeTime) {
                closest = i;
              } else {
                break;
              }
            }
            initialIndex = closest;
          }
        } else {
          // No trades => Start at beginning (sim.startDate)
          initialIndex = 0;
        }
      }

      set({
        originalData: candles,
        data: candles,
        interval: "1D",
        stockInfo: stockRes.stock,
        isLoading: false,
        isFinished,
        currentTimeIndex: initialIndex,
        maxTimeIndex: candles.length - 1,
        currentPrice: candles[initialIndex].close as number,
        balance: currentBalance,
        positions: positions,
        tradeLogs: tradeLogs.reverse(),
      });
    } catch (e: any) {
      set({ isLoading: false, error: e.message || "Error loading simulation" });
    }
  },

  loadData: async (code, start, end) => {
    // Legacy or manual load without ID
    // ... (simplified or keep minimal logic if needed by other components?)
    // Current simulation/page.tsx logic flow is changing to use loadSimulation.
    // So this might be unused.
  },

  setInterval: (interval) =>
    set((state) => {
      if (state.interval === interval) return state;
      const aggregated = aggregateData(state.originalData, interval);
      const currentSimCandle = state.data[state.currentTimeIndex];
      if (!currentSimCandle)
        return {
          interval,
          data: aggregated,
          maxTimeIndex: aggregated.length - 1,
          currentTimeIndex: 0,
        };

      const currentSimDateStr = String(currentSimCandle.time);
      let newIndex = 0;
      for (let i = 0; i < aggregated.length; i++) {
        if (String(aggregated[i].time) > currentSimDateStr) {
          newIndex = Math.max(0, i - 1);
          break;
        }
        newIndex = i;
      }
      return {
        interval,
        data: aggregated,
        maxTimeIndex: aggregated.length - 1,
        currentTimeIndex: newIndex,
      };
    }),

  // ASYNC Actions
  placeOrder: async (side, qty, price, sl, tp, entryReason) => {
    const state = get();
    if (!state.currentSimulationId) return;

    // Calculate current holdings (quantity of stocks) BEFORE the trade
    const currentHoldings = state.positions.reduce((acc, pos) => acc + pos.qty, 0);

    // If holding stock (currentHoldings > 0), inherit existing TP/SL if not provided
    // This fixes the issue where adding to a position or selling saves 0/0 for TP/SL
    let finalTp = tp;
    let finalSl = sl;

    if (currentHoldings > 0 && (!finalTp || !finalSl)) {
      const existingPos = state.positions.find((p) => p.qty > 0);
      if (existingPos) {
        if (!finalTp) finalTp = existingPos.tp;
        if (!finalSl) finalSl = existingPos.sl;
      }
    }

    const tradeData: TradeData = {
      timestamp: String(state.data[state.currentTimeIndex].time),
      balance: currentHoldings,
      price: price,
      upper: finalTp || 0,
      lower: finalSl || 0,
      type: side === "BUY" ? "B" : "S",
      volume: qty,
      comment: entryReason,
    };

    try {
      await simulationService.addTrade(state.currentSimulationId, tradeData);

      // Helper to execute locally
      const fee = 2000;
      let newBalance = state.balance - fee;
      if (side === "BUY") newBalance -= price * qty;
      else newBalance += price * qty;

      const newLog: TradeLog = {
        id: Math.random().toString(36),
        time: tradeData.timestamp,
        symbol: state.stockInfo?.name || "STOCK",
        side,
        price,
        qty,
        slippage: 0,
        fee,
        pnl: 0,
        entryReason,
      };

      let newPositions = [...state.positions];
      if (side === "BUY") {
        newPositions.push({
          symbol: state.stockInfo?.name || "STOCK",
          side: "BUY",
          entryPrice: price,
          qty,
          sl,
          tp,
          entryReason,
        });
      } else {
        // Sell logic (assumes Selling Long for simplicity, not Shorting)
        // If side is SELL, logic similar to loadSimulation reconstruct
        let rem = qty;
        const nextPos: Position[] = [];
        let pnl = 0;
        for (const pos of newPositions) {
          if (rem <= 0 || pos.side !== "BUY") {
            nextPos.push(pos);
            continue;
          }
          const closeQty = Math.min(pos.qty, rem);
          pnl += (price - pos.entryPrice) * closeQty;
          rem -= closeQty;
          if (pos.qty > closeQty) {
            nextPos.push({ ...pos, qty: pos.qty - closeQty });
          }
        }
        newPositions = nextPos;
        newLog.pnl = pnl;
      }

      set({
        balance: newBalance,
        positions: newPositions,
        tradeLogs: [newLog, ...state.tradeLogs],
      });
    } catch (e) {
      console.error(e);
    }
  },

  sellPosition: async (qty, comment) => {
    // Wrapper for placeOrder('SELL')
    const state = get();
    await state.placeOrder("SELL", qty, state.currentPrice, undefined, undefined, comment);
  },

  closePosition: async (indices) => {
    const state = get();
    const positionsToClose = indices.map((i) => state.positions[i]);
    // Close each one
    for (const pos of positionsToClose) {
      // If BUY, we SELL.
      const side = pos.side === "BUY" ? "SELL" : "BUY";
      await state.placeOrder(side, pos.qty, state.currentPrice, 0, 0, "Close Position");
    }
  },

  nextCandle: () =>
    set((state) => {
      const nextIndex = state.currentTimeIndex + 1;
      if (nextIndex >= state.data.length) return state;
      return {
        currentTimeIndex: nextIndex,
        currentPrice: Number(state.data[nextIndex].close),
      };
    }),

  prevCandle: () =>
    set((state) => ({
      currentTimeIndex: Math.max(0, state.currentTimeIndex - 1),
    })),

  setCurrentPrice: (price) => set({ currentPrice: price }),
}));
