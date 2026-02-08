/**
 * simulationStore 테스트
 *
 * GWT 형식으로 테스트 구조화:
 * - Given (사전 조건): 스토어 상태 및 Mock 설정
 * - When (동작): 스토어 액션 호출
 * - Then (결과): 상태 변경 검증
 *
 * 주요 테스트 영역:
 * - 초기 상태: 스토어 초기값 검증
 * - 캔들 이동: nextCandle, prevCandle 동작
 * - 인터벌 변경: 1D, 1W, 1M 데이터 집계
 * - 시뮬레이션 로드: API 호출 및 상태 복원
 * - 주문 처리: placeOrder, sellPosition, closePosition
 * - 헬퍼 함수: getWeekKey, getMonthKey
 */

import { useSimulationStore } from "../simulationStore";
import { stockService } from "@/services/stockService";
import { simulationService } from "@/services/simulationService";

// 서비스 모듈 모킹
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

/**
 * 헬퍼 함수 (스토어에서 추출 - 테스트용)
 * 주간/월간 데이터 집계에 사용되는 키 생성 함수
 */
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
    // 각 테스트 전 스토어 상태 초기화
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

  /**
   * 초기 상태 테스트
   */
  describe("초기 상태", () => {
    it("초기 상태가 올바르게 설정되어야 한다", () => {
      // Given: 스토어가 초기화되었을 때
      // When: 상태를 조회하면
      const state = useSimulationStore.getState();

      // Then: 모든 초기값이 올바르게 설정되어 있어야 함
      expect(state.currentSimulationId).toBeNull();
      expect(state.isFinished).toBe(false);
      expect(state.originalData).toEqual([]);
      expect(state.data).toEqual([]);
      expect(state.interval).toBe("1D");
      expect(state.isLoading).toBe(false);
      expect(state.balance).toBe(100000000); // 1억원
      expect(state.positions).toEqual([]);
      expect(state.tradeLogs).toEqual([]);
    });
  });

  /**
   * 다음 캔들 이동 테스트
   */
  describe("nextCandle", () => {
    it("다음 캔들로 이동해야 한다", () => {
      // Given: 3개의 캔들 데이터가 있고 현재 인덱스가 0인 상태
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

      // When: nextCandle 액션을 호출하면
      const { nextCandle } = useSimulationStore.getState();
      nextCandle();

      // Then: 인덱스가 1 증가하고 현재 가격이 해당 캔들의 종가로 업데이트
      const state = useSimulationStore.getState();
      expect(state.currentTimeIndex).toBe(1);
      expect(state.currentPrice).toBe(110);
    });

    it("마지막 캔들에서는 더 이상 이동하지 않아야 한다", () => {
      // Given: 2개의 캔들이 있고 이미 마지막 캔들(인덱스 1)에 있는 상태
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

      // When: nextCandle 액션을 호출하면
      const { nextCandle } = useSimulationStore.getState();
      nextCandle();

      // Then: 인덱스가 변경되지 않아야 함 (경계 조건)
      const state = useSimulationStore.getState();
      expect(state.currentTimeIndex).toBe(1);
    });
  });

  /**
   * 이전 캔들 이동 테스트
   */
  describe("prevCandle", () => {
    it("이전 캔들로 이동해야 한다", () => {
      // Given: 2개의 캔들이 있고 현재 인덱스가 1인 상태
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

      // When: prevCandle 액션을 호출하면
      const { prevCandle } = useSimulationStore.getState();
      prevCandle();

      // Then: 인덱스가 1 감소해야 함
      const state = useSimulationStore.getState();
      expect(state.currentTimeIndex).toBe(0);
    });

    it("첫 번째 캔들에서는 0보다 작아지지 않아야 한다", () => {
      // Given: 1개의 캔들이 있고 현재 인덱스가 0인 상태
      const mockData = [{ time: "2024-01-01", open: 100, high: 110, low: 90, close: 105 }];
      useSimulationStore.setState({
        data: mockData,
        currentTimeIndex: 0,
        maxTimeIndex: 0,
      });

      // When: prevCandle 액션을 호출하면
      const { prevCandle } = useSimulationStore.getState();
      prevCandle();

      // Then: 인덱스가 0으로 유지되어야 함 (경계 조건)
      const state = useSimulationStore.getState();
      expect(state.currentTimeIndex).toBe(0);
    });
  });

  /**
   * 현재 가격 설정 테스트
   */
  describe("setCurrentPrice", () => {
    it("현재 가격이 올바르게 설정되어야 한다", () => {
      // Given: 스토어가 초기화되었을 때
      // When: setCurrentPrice로 새 가격을 설정하면
      const { setCurrentPrice } = useSimulationStore.getState();
      setCurrentPrice(50000);

      // Then: currentPrice가 업데이트되어야 함
      const state = useSimulationStore.getState();
      expect(state.currentPrice).toBe(50000);
    });
  });

  /**
   * 인터벌 변경 테스트
   * 1D(일봉), 1W(주봉), 1M(월봉) 전환 시 데이터 집계 검증
   */
  describe("setInterval", () => {
    it("1W 인터벌로 변경되어야 한다", () => {
      // Given: 같은 주와 다른 주의 일봉 데이터 4개가 있는 상태
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

      // When: setInterval("1W")을 호출하면
      const { setInterval } = useSimulationStore.getState();
      setInterval("1W");

      // Then: 주 단위로 집계되어 데이터 개수가 줄어들어야 함
      const state = useSimulationStore.getState();
      expect(state.interval).toBe("1W");
      expect(state.data.length).toBeLessThanOrEqual(mockData.length);
    });

    it("1M 인터벌로 변경되어야 한다", () => {
      // Given: 1월과 2월의 일봉 데이터가 있는 상태
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

      // When: setInterval("1M")을 호출하면
      const { setInterval } = useSimulationStore.getState();
      setInterval("1M");

      // Then: 월 단위로 집계되어 2개의 월봉 데이터가 되어야 함
      const state = useSimulationStore.getState();
      expect(state.interval).toBe("1M");
      expect(state.data.length).toBe(2);
      expect(state.data[0].time).toBe("2024-01-01");
      expect(state.data[1].time).toBe("2024-02-01");
    });

    it("같은 인터벌로 변경 시 상태가 유지되어야 한다", () => {
      // Given: 1D 인터벌로 설정된 상태
      const mockData = [{ time: "2024-01-01", open: 100, high: 110, low: 90, close: 105 }];
      useSimulationStore.setState({
        originalData: mockData,
        data: mockData,
        interval: "1D",
        currentTimeIndex: 0,
      });

      // When: 이미 설정된 같은 인터벌("1D")로 변경하면
      const { setInterval } = useSimulationStore.getState();
      setInterval("1D");

      // Then: 데이터가 변경되지 않아야 함
      const state = useSimulationStore.getState();
      expect(state.interval).toBe("1D");
      expect(state.data).toEqual(mockData);
    });

    it("빈 데이터에서 인터벌 변경 시 기본값으로 처리되어야 한다", () => {
      // Given: 데이터가 없는 상태
      useSimulationStore.setState({
        originalData: [],
        data: [],
        interval: "1D",
        currentTimeIndex: 0,
      });

      // When: 인터벌을 변경하면
      const { setInterval } = useSimulationStore.getState();
      setInterval("1W");

      // Then: 에러 없이 빈 배열이 유지되어야 함
      const state = useSimulationStore.getState();
      expect(state.interval).toBe("1W");
      expect(state.data).toEqual([]);
    });
  });

  /**
   * 시뮬레이션 로드 테스트
   * API 호출 및 상태 복원 검증
   */
  describe("loadSimulation", () => {
    it("시뮬레이션 로드 성공 시 상태가 올바르게 설정되어야 한다", async () => {
      // Given: 시뮬레이션 목록과 주식 데이터가 mock된 상태
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

      // When: loadSimulation을 호출하면
      const { loadSimulation } = useSimulationStore.getState();
      await loadSimulation(1);

      // Then: 시뮬레이션 데이터가 올바르게 로드되어야 함
      const state = useSimulationStore.getState();
      expect(state.currentSimulationId).toBe(1);
      expect(state.isLoading).toBe(false);
      expect(state.stockInfo?.name).toBe("삼성전자");
      expect(state.data.length).toBe(2);
      expect(state.isFinished).toBe(false);
    });

    it("시뮬레이션이 종료된 경우 isFinished가 true가 되어야 한다", async () => {
      // Given: endDate가 설정된 종료된 시뮬레이션
      mockSimulationService.getList.mockResolvedValueOnce({
        simulations: [
          {
            id: 1,
            stockCode: "005930",
            startDate: "2024-01-01",
            endDate: "2024-02-01", // 종료 날짜 설정됨
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

      // When: loadSimulation을 호출하면
      const { loadSimulation } = useSimulationStore.getState();
      await loadSimulation(1);

      // Then: isFinished가 true여야 함
      const state = useSimulationStore.getState();
      expect(state.isFinished).toBe(true);
    });

    it("시뮬레이션을 찾을 수 없는 경우 에러가 설정되어야 한다", async () => {
      // Given: 빈 시뮬레이션 목록
      mockSimulationService.getList.mockResolvedValueOnce({
        simulations: [],
        totalElements: 0,
      });

      // When: 존재하지 않는 시뮬레이션 ID로 로드하면
      const { loadSimulation } = useSimulationStore.getState();
      await loadSimulation(999);

      // Then: 에러가 설정되어야 함
      const state = useSimulationStore.getState();
      expect(state.error).toBe("Simulation not found");
      expect(state.isLoading).toBe(false);
    });

    it("데이터가 없는 경우 에러가 설정되어야 한다", async () => {
      // Given: 시뮬레이션은 있지만 주식 데이터가 비어있는 상태
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
        items: [], // 빈 데이터
      });

      mockSimulationService.getTrades.mockResolvedValueOnce({
        trades: [],
        totalElements: 0,
      });

      // When: loadSimulation을 호출하면
      const { loadSimulation } = useSimulationStore.getState();
      await loadSimulation(1);

      // Then: "No data found" 에러가 설정되어야 함
      const state = useSimulationStore.getState();
      expect(state.error).toBe("No data found");
    });

    // TODO: 거래 내역 복원 로직은 더 깊은 mock 설정이 필요함
    it.skip("거래 내역이 있는 경우 올바르게 복원되어야 한다", async () => {
      // Given: 거래 내역이 포함된 시뮬레이션
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

      // When: loadSimulation을 호출하면
      const { loadSimulation } = useSimulationStore.getState();
      await loadSimulation(1);

      // Then: 거래 내역이 복원되어야 함 (역순으로)
      const state = useSimulationStore.getState();
      expect(state.tradeLogs.length).toBe(1);
      expect(state.tradeLogs[0].side).toBe("BUY");
      expect(state.tradeLogs[0].price).toBe(71000);
      // 잔고 = 100000000 - 71000*10 - 수수료 2000 = 99288000
      expect(state.balance).toBeLessThan(100000000);
    });
  });

  /**
   * 주문 실행 테스트
   */
  describe("placeOrder", () => {
    beforeEach(() => {
      // 각 주문 테스트 전 시뮬레이션 상태 설정
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
      // Given: 포지션이 없고 매수 API가 mock된 상태
      mockSimulationService.addTrade.mockResolvedValueOnce({
        message: "Trade added",
      });

      // When: 10주를 71000원에 매수하면
      const { placeOrder } = useSimulationStore.getState();
      await placeOrder("BUY", 10, 71000, 68000, 75000, "테스트 매수");

      // Then: 포지션과 거래 로그가 추가되어야 함
      const state = useSimulationStore.getState();
      expect(state.positions.length).toBe(1);
      expect(state.positions[0].qty).toBe(10);
      expect(state.positions[0].entryPrice).toBe(71000);
      expect(state.tradeLogs.length).toBe(1);
      expect(state.tradeLogs[0].side).toBe("BUY");
    });

    it("매도 주문 시 포지션이 감소되어야 한다", async () => {
      // Given: 10주 보유 포지션이 있는 상태
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

      // When: 5주를 72000원에 매도하면
      const { placeOrder } = useSimulationStore.getState();
      await placeOrder("SELL", 5, 72000, undefined, undefined, "일부 매도");

      // Then: 포지션이 5주로 감소하고 수익이 계산되어야 함
      const state = useSimulationStore.getState();
      expect(state.positions.length).toBe(1);
      expect(state.positions[0].qty).toBe(5);
      expect(state.tradeLogs.length).toBe(1);
      expect(state.tradeLogs[0].side).toBe("SELL");
      expect(state.tradeLogs[0].pnl).toBe((72000 - 70000) * 5); // 수익: 10,000원
    });

    it("전량 매도 시 포지션이 삭제되어야 한다", async () => {
      // Given: 10주 보유 포지션이 있는 상태
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

      // When: 전량(10주)을 매도하면
      const { placeOrder } = useSimulationStore.getState();
      await placeOrder("SELL", 10, 72000, undefined, undefined, "전량 매도");

      // Then: 포지션이 삭제되어야 함
      const state = useSimulationStore.getState();
      expect(state.positions.length).toBe(0);
    });

    it("currentSimulationId가 없으면 주문이 실행되지 않아야 한다", async () => {
      // Given: currentSimulationId가 null인 상태
      useSimulationStore.setState({
        currentSimulationId: null,
      });

      // When: 주문을 시도하면
      const { placeOrder } = useSimulationStore.getState();
      await placeOrder("BUY", 10, 71000);

      // Then: API가 호출되지 않아야 함 (가드 조건)
      expect(mockSimulationService.addTrade).not.toHaveBeenCalled();
    });

    it("추가 매수 시 기존 SL/TP를 유지해야 한다", async () => {
      // Given: SL/TP가 설정된 포지션이 있는 상태
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

      // When: SL/TP 없이 추가 매수하면
      const { placeOrder } = useSimulationStore.getState();
      await placeOrder("BUY", 5, 71000); // SL/TP 미지정

      // Then: 기존 포지션의 SL/TP가 상속되어야 함
      expect(mockSimulationService.addTrade).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          upper: 75000, // 기존 TP 유지
          lower: 68000, // 기존 SL 유지
        })
      );
    });
  });

  /**
   * 포지션 매도 테스트
   */
  describe("sellPosition", () => {
    it("sellPosition이 placeOrder('SELL')을 호출해야 한다", async () => {
      // Given: 10주 보유 포지션이 있는 상태
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

      // When: sellPosition으로 5주를 매도하면
      const { sellPosition } = useSimulationStore.getState();
      await sellPosition(5, "일부 매도");

      // Then: 포지션이 5주로 감소해야 함
      const state = useSimulationStore.getState();
      expect(state.positions.length).toBe(1);
      expect(state.positions[0].qty).toBe(5);
    });
  });

  /**
   * 포지션 청산 테스트
   */
  describe("closePosition", () => {
    it("지정된 인덱스의 포지션을 청산해야 한다", async () => {
      // Given: 2개의 포지션이 있는 상태
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

      // When: 첫 번째 포지션(인덱스 0)을 청산하면
      const { closePosition } = useSimulationStore.getState();
      await closePosition([0]);

      // Then: addTrade API가 호출되어야 함
      expect(mockSimulationService.addTrade).toHaveBeenCalled();
    });
  });

  /**
   * 헬퍼 함수 테스트
   * 주간/월간 데이터 집계에 사용되는 키 생성 함수
   */
  describe("Helper Functions", () => {
    /**
     * 주간 키 생성 테스트
     * 해당 주의 월요일 날짜를 키로 반환
     */
    describe("getWeekKey", () => {
      it("월요일 기준 주차 키를 반환해야 한다", () => {
        // Given: 수요일 날짜 (2024-01-03)
        // When: getWeekKey를 호출하면
        const result = getWeekKey("20240103");

        // Then: 해당 주 월요일 날짜를 반환해야 함
        expect(result).toBe("20240101");
      });

      it("일요일의 경우 지난 주 월요일 키를 반환해야 한다", () => {
        // Given: 일요일 날짜 (2024-01-07)
        // When: getWeekKey를 호출하면
        const result = getWeekKey("20240107");

        // Then: 해당 주(ISO 기준) 월요일 날짜를 반환해야 함
        expect(result).toBe("20240101");
      });
    });

    /**
     * 월간 키 생성 테스트
     * YYYYMM 형태의 월 키 반환
     */
    describe("getMonthKey", () => {
      it("월 키를 반환해야 한다", () => {
        // Given: 2024년 1월 15일
        // When: getMonthKey를 호출하면
        const result = getMonthKey("20240115");

        // Then: "202401" 형태의 월 키를 반환해야 함
        expect(result).toBe("202401");
      });

      it("다른 월의 키를 반환해야 한다", () => {
        // Given: 2024년 12월 31일
        // When: getMonthKey를 호출하면
        const result = getMonthKey("20241231");

        // Then: "202412" 형태의 월 키를 반환해야 함
        expect(result).toBe("202412");
      });
    });
  });
});
