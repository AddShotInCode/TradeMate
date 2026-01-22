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
  placeOrder: (side: 'BUY' | 'SELL', qty: number, price: number, sl?: number, tp?: number, entryReason?: string) => void;
  closePosition: (positionIndices: number[]) => void;
  sellPosition: (qty: number) => void; // Partial close for long positions
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

  placeOrder: (side, qty, price, sl, tp, entryReason) => set((state) => {
    const fee = 2000; 
    const slippage = 0; // Removed slippage as per user request
    const executePrice = price;
    
    // Create new position logic
    const newPosition: Position = {
        symbol: 'AAPL',
        side,
        entryPrice: executePrice,
        qty,
        sl: sl && sl > 0 ? sl : undefined,
        tp: tp && tp > 0 ? tp : undefined,
        entryReason // Store entry reason
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
        pnl: 0, // No realized PnL on open,
        entryReason // Store entry reason
    };

    return {
        balance: state.balance - fee, // Deduct fee on open
        tradeLogs: [newLog, ...state.tradeLogs],
        positions: [...state.positions, newPosition] 
    };
  }),

  closePosition: (positionIndices) => set((state) => {
    const positionsToClose = positionIndices.map(idx => state.positions[idx]).filter(Boolean);
    if (positionsToClose.length === 0) return state;

    const remainingPositions = state.positions.filter((_, idx) => !positionIndices.includes(idx));
    let newBalance = state.balance;
    const newLogs = [...state.tradeLogs];
    const currentPrice = state.currentPrice;

    positionsToClose.forEach(pos => {
        const fee = 2000;
        const slippage = 0; // Removed slippage as per user request
        const closePrice = currentPrice;
        
        // Calculate PnL
        // Long: (Close - Entry) * Qty
        // Short: (Entry - Close) * Qty
        const pnl = pos.side === 'BUY' 
            ? (closePrice - pos.entryPrice) * pos.qty 
            : (pos.entryPrice - closePrice) * pos.qty;

        newBalance += pnl - fee;

        newLogs.unshift({
            id: Math.random().toString(36).substr(2, 9),
            time: new Date().toLocaleTimeString('ko-KR', { hour12: false }), // Or simulation time
            symbol: pos.symbol,
            side: pos.side === 'BUY' ? 'SELL' : 'BUY',
            price: closePrice,
            qty: pos.qty,
            slippage,
            fee,
            pnl,
            entryReason: pos.entryReason // Pass entry reason to close log
        });
    });

    return {
        balance: newBalance,
        positions: remainingPositions,
        tradeLogs: newLogs
    };
  }),

  // Partial Close for Long Positions (FIFO)
  sellPosition: (qty) => set((state) => {
    let remainingQtyToSell = qty;
    let newBalance = state.balance;
    const newLogs = [...state.tradeLogs];
    const currentPrice = state.currentPrice;
    
    // Process positions - Creates a new array to avoid mutating state directly in loop
    const newPositions = [...state.positions];
    // Filter for LONG positions to sell
    const longIndices = newPositions
        .map((p, i) => ({ ...p, originalIndex: i }))
        .filter(p => p.side === 'BUY');
        
    // FIFO: We iterate through existing Long positions
    // Note: In a real FIFO, we should sort by timestamp. Assuming array order is insertion order.
    
    for (let i = 0; i < newPositions.length; i++) {
        if (remainingQtyToSell <= 0) break;
        
        const pos = newPositions[i];
        if (pos.side !== 'BUY') continue; // Only close Longs for 'Sell' action
        
        const closeQty = Math.min(pos.qty, remainingQtyToSell);
        const fee = 2000; // Flat fee per trade chunk? simulating simplified fee
        const slippage = 0;
        const closePrice = currentPrice;
        
        const pnl = (closePrice - pos.entryPrice) * closeQty;
        newBalance += pnl; // Add PnL to balance? 
        // Wait, balance update logic in closePosition was: newBalance += pnl - fee
        // Usually, Balance = Initial + Realized PnL - Fees.
        // Original close logic: newBalance += pnl - fee. (This assumes entry cost was NOT deducted from balance?
        // Let's check placeOrder: balance: state.balance - fee.
        // It seems 'balance' is "Cash".
        // When buying, we usually deduct (Price * Qty) + Fee?
        // The current store implementation is simplified:
        // placeOrder -> Deduct Fee ONLY.
        // This implies Margin Trading where Margin is locked but not deducted?
        // Or specific logic.
        // closePosition -> Add (PnL - Fee).
        // If I buy 1 BTC at 1000, Fee 10. Balance - 10.
        // Price goes to 1100. PnL = 100.
        // Close -> Balance + 100 - 10 = Balance + 90.
        // Net = -10 + 90 = +80. Correct.
        // So here:
        newBalance += pnl - fee;

        // Log
        newLogs.unshift({
            id: Math.random().toString(36).substr(2, 9),
            time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
            symbol: pos.symbol,
            side: 'SELL',
            price: closePrice,
            qty: closeQty,
            slippage,
            fee,
            pnl,
            entryReason: pos.entryReason
        });
        
        // Update Position
        newPositions[i] = { ...pos, qty: pos.qty - closeQty };
        remainingQtyToSell -= closeQty;
    }

    // Filter out fully closed positions (qty <= 0)
    const finalPositions = newPositions.filter(p => p.qty > 0);

    return {
        balance: newBalance,
        positions: finalPositions,
        tradeLogs: newLogs
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

        // Check SL/TP for Long
        if (pos.side === 'BUY') {
            if (pos.sl && pos.sl > 0 && nextCandleData.low <= pos.sl) {
                closePrice = pos.sl; 
                isClosed = true;
                closeReason = 'SL';
            } else if (pos.tp && pos.tp > 0 && nextCandleData.high >= pos.tp) {
                closePrice = pos.tp;
                isClosed = true;
                closeReason = 'TP';
            }
        }
        // Check SL/TP for Short
        else if (pos.side === 'SELL') {
             if (pos.sl && pos.sl > 0 && nextCandleData.high >= pos.sl) {
                closePrice = pos.sl; // Hit upper SL
                isClosed = true;
                closeReason = 'SL';
            } else if (pos.tp && pos.tp > 0 && nextCandleData.low <= pos.tp) {
                closePrice = pos.tp; // Hit lower TP
                isClosed = true;
                closeReason = 'TP';
            }
        }

        if (isClosed) {
            const fee = 2000;
            const pnl = pos.side === 'BUY' 
                ? (closePrice - pos.entryPrice) * pos.qty
                : (pos.entryPrice - closePrice) * pos.qty;

            newBalance += pnl - fee;

            newTradeLogs.unshift({
                id: Math.random().toString(36).substr(2, 9),
                time: nextCandleData.time,
                symbol: pos.symbol,
                side: pos.side === 'BUY' ? 'SELL' : 'BUY', // Closing side
                price: closePrice,
                qty: pos.qty,
                slippage: 0, // Simplified for SL/TP
                fee,
                pnl,
                entryReason: pos.entryReason // Pass entry reason to close log
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
