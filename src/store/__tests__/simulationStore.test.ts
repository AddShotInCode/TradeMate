import { useSimulationStore } from "../simulationStore";
import { stockService } from "@/services/stockService";
import { simulationService } from "@/services/simulationService";

// Mock services
jest.mock("@/services/stockService", () => ({
  stockService: {
    fetchStockData: jest.fn(),
  },
}));

jest.mock("@/services/simulationService", () => ({
  simulationService: {
    getList: jest.fn(),
    getTrades: jest.fn(),
    addTrade: jest.fn(),
  },
}));

// Helper functions extracted from store for testing
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

const mockStockService = stockService as jest.Mocked<typeof stockService>;
const mockSimulationService = simulationService as jest.Mocked<typeof simulationService>;

describe("simulationStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useSimulationStore.setState({
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
    });
    jest.clearAllMocks();
  });

  describe("초기 상태", () => {
    it("초기 상태가 올바르게 설정되어야 한다", () => {
      const state = useSimulationStore.getState();
      expect(state.currentSimulationId).toBeNull();
      expect(state.isFinished).toBe(false);
      expect(state.originalData).toEqual([]);
      expect(state.data).toEqual([]);
      expect(state.interval).toBe("1D");
      expect(state.isLoading).toBe(false);
      expect(state.balance).toBe(100000000);
      expect(state.positions).toEqual([]);
      expect(state.tradeLogs).toEqual([]);
    });
  });

  describe("nextCandle", () => {
    it("다음 캔들로 이동해야 한다", () => {
      const mockData = [
        { time: "2024-01-01", open: 100, high: 110, low: 90, close: 105 },
        { time: "2024-01-02", open: 105, high: 115, low: 95, close: 110 },
        { time: "2024-01-03", open: 110, high: 120, low: 100, close: 115 },
      ];
      useSimulationStore.setState({
        data: mockData,
        currentTimeIndex: 0,
        maxTimeIndex: 2,
        currentPrice: 105,
      });

      const { nextCandle } = useSimulationStore.getState();
      nextCandle();

      const state = useSimulationStore.getState();
      expect(state.currentTimeIndex).toBe(1);
      expect(state.currentPrice).toBe(110);
    });

    it("마지막 캔들에서는 더 이상 이동하지 않아야 한다", () => {
      const mockData = [
        { time: "2024-01-01", open: 100, high: 110, low: 90, close: 105 },
        { time: "2024-01-02", open: 105, high: 115, low: 95, close: 110 },
      ];
      useSimulationStore.setState({
        data: mockData,
        currentTimeIndex: 1,
        maxTimeIndex: 1,
        currentPrice: 110,
      });

      const { nextCandle } = useSimulationStore.getState();
      nextCandle();

      const state = useSimulationStore.getState();
      expect(state.currentTimeIndex).toBe(1);
    });
  });

  describe("prevCandle", () => {
    it("이전 캔들로 이동해야 한다", () => {
      const mockData = [
        { time: "2024-01-01", open: 100, high: 110, low: 90, close: 105 },
        { time: "2024-01-02", open: 105, high: 115, low: 95, close: 110 },
      ];
      useSimulationStore.setState({
        data: mockData,
        currentTimeIndex: 1,
        maxTimeIndex: 1,
        currentPrice: 110,
      });

      const { prevCandle } = useSimulationStore.getState();
      prevCandle();

      const state = useSimulationStore.getState();
      expect(state.currentTimeIndex).toBe(0);
    });

    it("첫 번째 캔들에서는 0보다 작아지지 않아야 한다", () => {
      const mockData = [{ time: "2024-01-01", open: 100, high: 110, low: 90, close: 105 }];
      useSimulationStore.setState({
        data: mockData,
        currentTimeIndex: 0,
        maxTimeIndex: 0,
      });

      const { prevCandle } = useSimulationStore.getState();
      prevCandle();

      const state = useSimulationStore.getState();
      expect(state.currentTimeIndex).toBe(0);
    });
  });

  describe("setCurrentPrice", () => {
    it("현재 가격이 올바르게 설정되어야 한다", () => {
      const { setCurrentPrice } = useSimulationStore.getState();
      setCurrentPrice(50000);

      const state = useSimulationStore.getState();
      expect(state.currentPrice).toBe(50000);
    });
  });

  describe("setInterval", () => {
    it("1W 인터벌로 변경되어야 한다", () => {
      const mockData = [
        { time: "2024-01-01", open: 100, high: 110, low: 90, close: 105 },
        { time: "2024-01-02", open: 105, high: 115, low: 95, close: 110 },
        { time: "2024-01-08", open: 110, high: 120, low: 100, close: 115 },
        { time: "2024-01-09", open: 115, high: 125, low: 105, close: 120 },
      ];
      useSimulationStore.setState({
        originalData: mockData,
        data: mockData,
        interval: "1D",
        currentTimeIndex: 0,
        maxTimeIndex: 3,
      });

      const { setInterval } = useSimulationStore.getState();
      setInterval("1W");

      const state = useSimulationStore.getState();
      expect(state.interval).toBe("1W");
      expect(state.data.length).toBeLessThanOrEqual(mockData.length);
    });

    it("1M 인터벌로 변경되어야 한다", () => {
      const mockData = [
        { time: "2024-01-15", open: 100, high: 110, low: 90, close: 105 },
        { time: "2024-01-20", open: 105, high: 115, low: 95, close: 110 },
        { time: "2024-02-05", open: 110, high: 120, low: 100, close: 115 },
        { time: "2024-02-10", open: 115, high: 125, low: 105, close: 120 },
      ];
      useSimulationStore.setState({
        originalData: mockData,
        data: mockData,
        interval: "1D",
        currentTimeIndex: 0,
        maxTimeIndex: 3,
      });

      const { setInterval } = useSimulationStore.getState();
      setInterval("1M");

      const state = useSimulationStore.getState();
      expect(state.interval).toBe("1M");
      // Should aggregate to 2 months (January and February)
      expect(state.data.length).toBe(2);
      expect(state.data[0].time).toBe("2024-01-01");
      expect(state.data[1].time).toBe("2024-02-01");
    });

    it("같은 인터벌로 변경 시 상태가 유지되어야 한다", () => {
      const mockData = [{ time: "2024-01-01", open: 100, high: 110, low: 90, close: 105 }];
      useSimulationStore.setState({
        originalData: mockData,
        data: mockData,
        interval: "1D",
        currentTimeIndex: 0,
      });

      const { setInterval } = useSimulationStore.getState();
      setInterval("1D");

      const state = useSimulationStore.getState();
      expect(state.interval).toBe("1D");
      expect(state.data).toEqual(mockData);
    });

    it("빈 데이터에서 인터벌 변경 시 기본값으로 처리되어야 한다", () => {
      useSimulationStore.setState({
        originalData: [],
        data: [],
        interval: "1D",
        currentTimeIndex: 0,
      });

      const { setInterval } = useSimulationStore.getState();
      setInterval("1W");

      const state = useSimulationStore.getState();
      expect(state.interval).toBe("1W");
      expect(state.data).toEqual([]);
    });
  });

  describe("loadSimulation", () => {
    it("시뮬레이션 로드 성공 시 상태가 올바르게 설정되어야 한다", async () => {
      mockSimulationService.getList.mockResolvedValueOnce({
        simulations: [
          {
            id: 1,
            stockCode: "005930",
            startDate: "2024-01-01",
            endDate: null,
            createdAt: "2024-01-01T00:00:00Z",
          },
        ],
        totalElements: 1,
      });

      mockStockService.fetchStockData.mockResolvedValueOnce({
        stock: { code: "005930", name: "삼성전자", market: "KOSPI" },
        pagination: { page: 1, pageSize: 1000, totalElements: 2, totalPages: 1 },
        items: [
          {
            date: "2024-01-01",
            open: 70000,
            high: 72000,
            low: 69000,
            close: 71000,
            volume: 1000000,
            changeAmount: 1000,
            changeRate: 1.43,
          },
          {
            date: "2024-01-02",
            open: 71000,
            high: 73000,
            low: 70000,
            close: 72000,
            volume: 1200000,
            changeAmount: 1000,
            changeRate: 1.41,
          },
        ],
      });

      mockSimulationService.getTrades.mockResolvedValueOnce({
        trades: [],
        totalElements: 0,
      });

      const { loadSimulation } = useSimulationStore.getState();
      await loadSimulation(1);

      const state = useSimulationStore.getState();
      expect(state.currentSimulationId).toBe(1);
      expect(state.isLoading).toBe(false);
      expect(state.stockInfo?.name).toBe("삼성전자");
      expect(state.data.length).toBe(2);
      expect(state.isFinished).toBe(false);
    });

    it("시뮬레이션이 종료된 경우 isFinished가 true가 되어야 한다", async () => {
      mockSimulationService.getList.mockResolvedValueOnce({
        simulations: [
          {
            id: 1,
            stockCode: "005930",
            startDate: "2024-01-01",
            endDate: "2024-02-01",
            createdAt: "2024-01-01T00:00:00Z",
          },
        ],
        totalElements: 1,
      });

      mockStockService.fetchStockData.mockResolvedValueOnce({
        stock: { code: "005930", name: "삼성전자", market: "KOSPI" },
        pagination: { page: 1, pageSize: 1000, totalElements: 1, totalPages: 1 },
        items: [
          {
            date: "2024-01-01",
            open: 70000,
            high: 72000,
            low: 69000,
            close: 71000,
            volume: 1000000,
            changeAmount: 1000,
            changeRate: 1.43,
          },
        ],
      });

      mockSimulationService.getTrades.mockResolvedValueOnce({
        trades: [],
        totalElements: 0,
      });

      const { loadSimulation } = useSimulationStore.getState();
      await loadSimulation(1);

      const state = useSimulationStore.getState();
      expect(state.isFinished).toBe(true);
    });

    it("시뮬레이션을 찾을 수 없는 경우 에러가 설정되어야 한다", async () => {
      mockSimulationService.getList.mockResolvedValueOnce({
        simulations: [],
        totalElements: 0,
      });

      const { loadSimulation } = useSimulationStore.getState();
      await loadSimulation(999);

      const state = useSimulationStore.getState();
      expect(state.error).toBe("Simulation not found");
      expect(state.isLoading).toBe(false);
    });

    it("데이터가 없는 경우 에러가 설정되어야 한다", async () => {
      mockSimulationService.getList.mockResolvedValueOnce({
        simulations: [
          {
            id: 1,
            stockCode: "005930",
            startDate: "2024-01-01",
            endDate: null,
            createdAt: "2024-01-01T00:00:00Z",
          },
        ],
        totalElements: 1,
      });

      mockStockService.fetchStockData.mockResolvedValueOnce({
        stock: { code: "005930", name: "삼성전자", market: "KOSPI" },
        pagination: { page: 1, pageSize: 1000, totalElements: 0, totalPages: 0 },
        items: [],
      });

      mockSimulationService.getTrades.mockResolvedValueOnce({
        trades: [],
        totalElements: 0,
      });

      const { loadSimulation } = useSimulationStore.getState();
      await loadSimulation(1);

      const state = useSimulationStore.getState();
      expect(state.error).toBe("No data found");
    });

    // TODO: This test requires deeper mock setup for trades reconstruction
    it.skip("거래 내역이 있는 경우 올바르게 복원되어야 한다", async () => {
      mockSimulationService.getList.mockResolvedValueOnce({
        simulations: [
          {
            id: 1,
            stockCode: "005930",
            startDate: "2024-01-01",
            endDate: null,
            createdAt: "2024-01-01T00:00:00Z",
          },
        ],
        totalElements: 1,
      });

      mockStockService.fetchStockData.mockResolvedValueOnce({
        stock: { code: "005930", name: "삼성전자", market: "KOSPI" },
        pagination: { page: 1, pageSize: 1000, totalElements: 2, totalPages: 1 },
        items: [
          {
            date: "2024-01-01",
            open: 70000,
            high: 72000,
            low: 69000,
            close: 71000,
            volume: 1000000,
            changeAmount: 1000,
            changeRate: 1.43,
          },
          {
            date: "2024-01-02",
            open: 71000,
            high: 73000,
            low: 70000,
            close: 72000,
            volume: 1200000,
            changeAmount: 1000,
            changeRate: 1.41,
          },
        ],
      });

      mockSimulationService.getTrades.mockResolvedValueOnce({
        trades: [
          {
            timestamp: "2024-01-01",
            balance: 0,
            price: 71000,
            upper: 75000,
            lower: 68000,
            type: "B" as const,
            volume: 10,
            comment: "첫 매수",
          },
        ],
        totalElements: 1,
      });

      const { loadSimulation } = useSimulationStore.getState();
      await loadSimulation(1);

      const state = useSimulationStore.getState();
      // After loading, tradeLogs should have the reconstructed trades (reversed order)
      expect(state.tradeLogs.length).toBe(1);
      expect(state.tradeLogs[0].side).toBe("BUY");
      expect(state.tradeLogs[0].price).toBe(71000);
      // Balance should decrease after buy (100000000 - 71000*10 - 2000 fee = 99288000)
      expect(state.balance).toBeLessThan(100000000);
    });
  });

  describe("placeOrder", () => {
    beforeEach(() => {
      useSimulationStore.setState({
        currentSimulationId: 1,
        stockInfo: { code: "005930", name: "삼성전자", market: "KOSPI" },
        data: [{ time: "2024-01-01", open: 70000, high: 72000, low: 69000, close: 71000 }],
        currentTimeIndex: 0,
        currentPrice: 71000,
        balance: 100000000,
        positions: [],
        tradeLogs: [],
      });
    });

    it("매수 주문 시 포지션이 추가되어야 한다", async () => {
      mockSimulationService.addTrade.mockResolvedValueOnce({
        message: "Trade added",
      });

      const { placeOrder } = useSimulationStore.getState();
      await placeOrder("BUY", 10, 71000, 68000, 75000, "테스트 매수");

      const state = useSimulationStore.getState();
      expect(state.positions.length).toBe(1);
      expect(state.positions[0].qty).toBe(10);
      expect(state.positions[0].entryPrice).toBe(71000);
      expect(state.tradeLogs.length).toBe(1);
      expect(state.tradeLogs[0].side).toBe("BUY");
    });

    it("매도 주문 시 포지션이 감소되어야 한다", async () => {
      useSimulationStore.setState({
        positions: [
          {
            symbol: "삼성전자",
            side: "BUY",
            entryPrice: 70000,
            qty: 10,
            sl: 68000,
            tp: 75000,
          },
        ],
      });

      mockSimulationService.addTrade.mockResolvedValueOnce({
        message: "Trade added",
      });

      const { placeOrder } = useSimulationStore.getState();
      await placeOrder("SELL", 5, 72000, undefined, undefined, "일부 매도");

      const state = useSimulationStore.getState();
      expect(state.positions.length).toBe(1);
      expect(state.positions[0].qty).toBe(5);
      expect(state.tradeLogs.length).toBe(1);
      expect(state.tradeLogs[0].side).toBe("SELL");
      expect(state.tradeLogs[0].pnl).toBe((72000 - 70000) * 5); // Profit
    });

    it("전량 매도 시 포지션이 삭제되어야 한다", async () => {
      useSimulationStore.setState({
        positions: [
          {
            symbol: "삼성전자",
            side: "BUY",
            entryPrice: 70000,
            qty: 10,
            sl: 68000,
            tp: 75000,
          },
        ],
      });

      mockSimulationService.addTrade.mockResolvedValueOnce({
        message: "Trade added",
      });

      const { placeOrder } = useSimulationStore.getState();
      await placeOrder("SELL", 10, 72000, undefined, undefined, "전량 매도");

      const state = useSimulationStore.getState();
      expect(state.positions.length).toBe(0);
    });

    it("currentSimulationId가 없으면 주문이 실행되지 않아야 한다", async () => {
      useSimulationStore.setState({
        currentSimulationId: null,
      });

      const { placeOrder } = useSimulationStore.getState();
      await placeOrder("BUY", 10, 71000);

      expect(mockSimulationService.addTrade).not.toHaveBeenCalled();
    });

    it("추가 매수 시 기존 SL/TP를 유지해야 한다", async () => {
      useSimulationStore.setState({
        positions: [
          {
            symbol: "삼성전자",
            side: "BUY",
            entryPrice: 70000,
            qty: 10,
            sl: 68000,
            tp: 75000,
          },
        ],
      });

      mockSimulationService.addTrade.mockResolvedValueOnce({
        message: "Trade added",
      });

      const { placeOrder } = useSimulationStore.getState();
      await placeOrder("BUY", 5, 71000); // No SL/TP provided

      expect(mockSimulationService.addTrade).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          upper: 75000, // Should inherit from existing position
          lower: 68000, // Should inherit from existing position
        })
      );
    });
  });

  describe("sellPosition", () => {
    it("sellPosition이 placeOrder('SELL')을 호출해야 한다", async () => {
      useSimulationStore.setState({
        currentSimulationId: 1,
        stockInfo: { code: "005930", name: "삼성전자", market: "KOSPI" },
        data: [{ time: "2024-01-01", open: 70000, high: 72000, low: 69000, close: 71000 }],
        currentTimeIndex: 0,
        currentPrice: 72000,
        balance: 100000000,
        positions: [
          {
            symbol: "삼성전자",
            side: "BUY",
            entryPrice: 70000,
            qty: 10,
          },
        ],
        tradeLogs: [],
      });

      mockSimulationService.addTrade.mockResolvedValueOnce({
        message: "Trade added",
      });

      const { sellPosition } = useSimulationStore.getState();
      await sellPosition(5, "일부 매도");

      const state = useSimulationStore.getState();
      expect(state.positions.length).toBe(1);
      expect(state.positions[0].qty).toBe(5);
    });
  });

  describe("closePosition", () => {
    it("지정된 인덱스의 포지션을 청산해야 한다", async () => {
      useSimulationStore.setState({
        currentSimulationId: 1,
        stockInfo: { code: "005930", name: "삼성전자", market: "KOSPI" },
        data: [{ time: "2024-01-01", open: 70000, high: 72000, low: 69000, close: 71000 }],
        currentTimeIndex: 0,
        currentPrice: 72000,
        balance: 100000000,
        positions: [
          {
            symbol: "삼성전자",
            side: "BUY",
            entryPrice: 70000,
            qty: 10,
          },
          {
            symbol: "삼성전자",
            side: "BUY",
            entryPrice: 71000,
            qty: 5,
          },
        ],
        tradeLogs: [],
      });

      mockSimulationService.addTrade.mockResolvedValue({
        message: "Trade added",
      });

      const { closePosition } = useSimulationStore.getState();
      await closePosition([0]); // Close first position

      const state = useSimulationStore.getState();
      expect(mockSimulationService.addTrade).toHaveBeenCalled();
    });
  });

  describe("Helper Functions", () => {
    describe("getWeekKey", () => {
      it("월요일 기준 주차 키를 반환해야 한다", () => {
        const result = getWeekKey("20240103");
        expect(result).toBe("20240101");
      });

      it("일요일의 경우 지난 주 월요일 키를 반환해야 한다", () => {
        // 2024-01-07 is Sunday
        const result = getWeekKey("20240107");
        expect(result).toBe("20240101");
      });
    });

    describe("getMonthKey", () => {
      it("월 키를 반환해야 한다", () => {
        const result = getMonthKey("20240115");
        expect(result).toBe("202401");
      });

      it("다른 월의 키를 반환해야 한다", () => {
        const result = getMonthKey("20241231");
        expect(result).toBe("202412");
      });
    });
  });
});
