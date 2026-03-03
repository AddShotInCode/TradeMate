/**
 * simulationService 테스트
 *
 * GWT 형식으로 테스트 구조화:
 * - Given (사전 조건): Mock 설정 및 테스트 데이터 준비
 * - When (동작): 서비스 메서드 호출
 * - Then (결과): API 호출 검증 및 반환값 확인
 */

import axios from "@/lib/axios";
import { simulationService } from "../simulationService";

// axios 모듈 모킹
jest.mock("@/lib/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("simulationService", () => {
  beforeEach(() => {
    // 각 테스트 전 mock 초기화
    jest.clearAllMocks();
  });

  /**
   * 시뮬레이션 생성 API 테스트
   */
  describe("create", () => {
    it("시뮬레이션 생성 요청을 올바르게 보내야 한다", async () => {
      // Given: 시뮬레이션 생성 성공 응답이 설정된 상태
      const mockResponse = { data: { id: 1, message: "Created successfully" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // When: create 메서드를 호출하면
      const result = await simulationService.create("005930", "2024-01-01");

      // Then: 쿼리 파라미터가 포함된 엔드포인트로 요청하고 결과를 반환해야 함
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/simulation?code=005930&start=2024-01-01");
      expect(result).toEqual({ id: 1, message: "Created successfully" });
    });
  });

  /**
   * 시뮬레이션 목록 조회 API 테스트
   */
  describe("getList", () => {
    it("시뮬레이션 목록을 조회해야 한다", async () => {
      // Given: 시뮬레이션 목록 응답이 설정된 상태
      const mockSimulations = {
        data: {
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
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockSimulations);

      // When: getList 메서드를 호출하면
      const result = await simulationService.getList();

      // Then: 시뮬레이션 목록과 총 개수를 반환해야 함
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/simulation");
      expect(result.simulations).toHaveLength(1);
      expect(result.totalElements).toBe(1);
    });
  });

  /**
   * 시뮬레이션 종료 API 테스트
   */
  describe("terminate", () => {
    it("시뮬레이션 종료 요청을 올바르게 보내야 한다", async () => {
      // Given: 시뮬레이션 종료 성공 응답이 설정된 상태
      const mockResponse = { data: { message: "Terminated successfully" } };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      // When: terminate 메서드를 호출하면
      const result = await simulationService.terminate(1, "2024-12-31");

      // Then: 종료 날짜가 포함된 엔드포인트로 PATCH 요청해야 함
      expect(mockedAxios.patch).toHaveBeenCalledWith("/api/simulation/1?end=2024-12-31");
      expect(result).toEqual({ message: "Terminated successfully" });
    });
  });

  /**
   * 시뮬레이션 삭제 API 테스트
   */
  describe("delete", () => {
    it("시뮬레이션 삭제 요청을 올바르게 보내야 한다", async () => {
      // Given: 시뮬레이션 삭제 성공 응답이 설정된 상태
      mockedAxios.delete.mockResolvedValueOnce({});

      // When: delete 메서드를 호출하면
      await simulationService.delete(1);

      // Then: 시뮬레이션 ID로 DELETE 요청해야 함
      expect(mockedAxios.delete).toHaveBeenCalledWith("/api/simulation/1");
    });
  });

  /**
   * 거래 데이터 추가 API 테스트
   */
  describe("addTrade", () => {
    it("거래 데이터 추가 요청을 올바르게 보내야 한다", async () => {
      // Given: 거래 데이터와 성공 응답이 설정된 상태
      const tradeData = {
        timestamp: "2024-01-15",
        balance: 0,
        price: 70000,
        upper: 80000,
        lower: 60000,
        type: "B" as const,
        volume: 10,
        comment: "Test buy",
      };
      const mockResponse = { data: { message: "Trade added successfully" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // When: addTrade 메서드를 호출하면
      const result = await simulationService.addTrade(1, tradeData);

      // Then: 시뮬레이션 ID의 data 엔드포인트로 거래 데이터를 POST해야 함
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/simulation/1/data", tradeData);
      expect(result).toEqual({ message: "Trade added successfully" });
    });
  });

  /**
   * 거래 내역 조회 API 테스트
   */
  describe("getTrades", () => {
    it("거래 내역을 조회해야 한다", async () => {
      // Given: 거래 내역 응답이 설정된 상태
      const mockTrades = {
        data: {
          trades: [
            {
              timestamp: "2024-01-15",
              balance: 0,
              price: 70000,
              upper: 80000,
              lower: 60000,
              type: "B" as const,
              volume: 10,
            },
          ],
          totalElements: 1,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockTrades);

      // When: getTrades 메서드를 호출하면
      const result = await simulationService.getTrades(1);

      // Then: 시뮬레이션 ID의 data 엔드포인트에서 거래 내역을 반환해야 함
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/simulation/1/data");
      expect(result.trades).toHaveLength(1);
      expect(result.totalElements).toBe(1);
    });
  });

  /**
   * 시뮬레이션 리포트 생성 API 테스트
   */
  describe("generateReport", () => {
    it("시뮬레이션 리포트 생성을 요청해야 한다", async () => {
      // Given: 시뮬레이션 리포트 생성 성공 응답이 설정된 상태
      const mockResponse = { data: { message: "Report generated successfully" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // When: generateReport 메서드를 호출하면
      const result = await simulationService.generateReport(1);

      // Then: 시뮬레이션 리포트 생성 요청을 보내고 메시지를 반환해야 함
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/simulation/1/report");
      expect(result).toEqual({ message: "Report generated successfully" });
    });
  });

  /**
   * 시뮬레이션 리포트 조회 API 테스트
   */
  describe("getReport", () => {
    it("시뮬레이션 리포트를 조회해야 한다", async () => {
      // Given: 시뮬레이션 리포트 응답이 설정된 상태
      const mockReport = {
        data: {
          summary: {
            simulationId: 1,
            stockCode: "005930",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            finalAvgPrice: 75000,
            totalInvestment: 7000000,
            totalRealizedProfit: 500000,
            totalRoi: 7.14,
            totalScore: 85,
          },
          trades: [],
          totalSellVolume: 100,
          totalTradeCount: 10,
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockReport);

      // When: getReport 메서드를 호출하면
      const result = await simulationService.getReport(1);

      // Then: 시뮬레이션 리포트 데이터를 반환해야 함
      expect(mockedAxios.get).toHaveBeenCalledWith("/api/simulation/1/report");
      expect(result.summary.simulationId).toBe(1);
      expect(result.summary.totalRoi).toBe(7.14);
    });
  });
});
