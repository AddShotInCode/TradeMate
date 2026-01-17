import { create } from 'zustand';

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
}

export interface Position {
  symbol: string;
  side: 'BUY' | 'SELL';
  entryPrice: number;
  qty: number;
  sl?: number;
  tp?: number;
}

interface SimulationState {
  // Account State
  balance: number;
  positions: Position[];
  tradeLogs: TradeLog[];
  
  // Chart State
  currentTimeIndex: number;
  maxTimeIndex: number; // For demo data limit
  currentPrice: number;

  // Actions
  placeOrder: (side: 'BUY' | 'SELL', qty: number, price: number, sl?: number, tp?: number) => void;
  nextCandle: () => void;
  prevCandle: () => void;
  setCurrentPrice: (price: number) => void;
}

// Move dummy data here for shared access
export const DUMMY_DATA = [
    { time: '2023-01-01', open: 151500, high: 153000, low: 150000, close: 151200 },
    { time: '2023-01-02', open: 151200, high: 153500, low: 150500, close: 152400 },
    { time: '2023-01-03', open: 152400, high: 154000, low: 151800, close: 153000 },
    { time: '2023-01-04', open: 153000, high: 153800, low: 151500, close: 152100 },
    { time: '2023-01-05', open: 152100, high: 154500, low: 152000, close: 154000 },
    { time: '2023-01-06', open: 154000, high: 156000, low: 153500, close: 155200 },
    { time: '2023-01-07', open: 155200, high: 155800, low: 154000, close: 154500 },
    { time: '2023-01-08', open: 154500, high: 157000, low: 154200, close: 156000 },
    { time: '2023-01-09', open: 156000, high: 158000, low: 155500, close: 157200 },
    { time: '2023-01-10', open: 157200, high: 157800, low: 156000, close: 156500 },
    { time: '2023-01-11', open: 156500, high: 158500, low: 156000, close: 158000 },
    { time: '2023-01-12', open: 158000, high: 159200, low: 157500, close: 158800 },
    { time: '2023-01-13', open: 158800, high: 160000, low: 158200, close: 159500 },
    { time: '2023-01-14', open: 159500, high: 159800, low: 158000, close: 158500 },
    { time: '2023-01-15', open: 158500, high: 160500, low: 158200, close: 160000 },
];

export const useSimulationStore = create<SimulationState>((set, get) => ({
  balance: 100000000, // 100 million KRW
  positions: [],
  tradeLogs: [],
  currentTimeIndex: 9, 
  maxTimeIndex: 100, 
  currentPrice: 152400, 

  placeOrder: (side, qty, price, sl, tp) => set((state) => {
    const fee = 2000; 
    const slippage = side === 'BUY' ? 50 : -50; 
    const executePrice = price + slippage;
    
    // Create new position logic
    // For simplicity, we just add it. In real app, might average down if same symbol.
    const newPosition: Position = {
        symbol: 'AAPL',
        side,
        entryPrice: executePrice,
        qty,
        sl,
        tp
    };

    // Log the OPEN trade
    const newLog: TradeLog = {
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
        symbol: 'AAPL',
        side,
        price: executePrice,
        qty,
        slippage,
        fee,
        pnl: 0 // No realized PnL on open
    };

    return {
        balance: state.balance - fee, // Deduct fee on open
        tradeLogs: [newLog, ...state.tradeLogs],
        positions: [...state.positions, newPosition] 
    };
  }),

  nextCandle: () => set((state) => {
    const nextIndex = state.currentTimeIndex + 1;
    if (nextIndex >= DUMMY_DATA.length) return state; // End of data

    const nextCandleData = DUMMY_DATA[nextIndex];
    let newBalance = state.balance;
    const newTradeLogs = [...state.tradeLogs];
    const activePositions: Position[] = [];

    // Check existing positions for SL/TP
    state.positions.forEach(pos => {
        let closePrice = 0;
        let isClosed = false;
        let closeReason = '';

        // Check SL (Long)
        if (pos.side === 'BUY' && pos.sl && nextCandleData.low <= pos.sl) {
            closePrice = pos.sl; // Slippage could apply here too
            isClosed = true;
            closeReason = 'SL';
        }
        // Check TP (Long)
        else if (pos.side === 'BUY' && pos.tp && nextCandleData.high >= pos.tp) {
            closePrice = pos.tp;
            isClosed = true;
            closeReason = 'TP';
        }

        if (isClosed) {
            const fee = 2000;
            const pnl = (closePrice - pos.entryPrice) * pos.qty;
            newBalance += pnl - fee;

            newTradeLogs.unshift({
                id: Math.random().toString(36).substr(2, 9),
                time: nextCandleData.time, // Use candle time or sim time
                symbol: pos.symbol,
                side: pos.side === 'BUY' ? 'SELL' : 'BUY', // Closing side
                price: closePrice,
                qty: pos.qty,
                slippage: 0, // Simplified
                fee,
                pnl
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
        currentPrice: nextCandleData.close 
    };
  }),

  prevCandle: () => set((state) => ({
    currentTimeIndex: Math.max(0, state.currentTimeIndex - 1)
  })),

  setCurrentPrice: (price) => set({ currentPrice: price })
}));
