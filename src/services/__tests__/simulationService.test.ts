import axios from "@/lib/axios";
import { simulationService } from "../simulationService";

// Mock axios
jest.mock("@/lib/axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("simulationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("시뮬레이션 생성 요청을 올바르게 보내야 한다", async () => {
      const mockResponse = { data: { id: 1, message: "Created successfully" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await simulationService.create("005930", "2024-01-01");

      expect(mockedAxios.post).toHaveBeenCalledWith("/api/simulation?code=005930&start=2024-01-01");
      expect(result).toEqual({ id: 1, message: "Created successfully" });
    });
  });

  describe("getList", () => {
    it("시뮬레이션 목록을 조회해야 한다", async () => {
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

      const result = await simulationService.getList();

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/simulation");
      expect(result.simulations).toHaveLength(1);
      expect(result.totalElements).toBe(1);
    });
  });

  describe("terminate", () => {
    it("시뮬레이션 종료 요청을 올바르게 보내야 한다", async () => {
      const mockResponse = { data: { message: "Terminated successfully" } };
      mockedAxios.patch.mockResolvedValueOnce(mockResponse);

      const result = await simulationService.terminate(1, "2024-12-31");

      expect(mockedAxios.patch).toHaveBeenCalledWith("/api/simulation/1?end=2024-12-31");
      expect(result).toEqual({ message: "Terminated successfully" });
    });
  });

  describe("delete", () => {
    it("시뮬레이션 삭제 요청을 올바르게 보내야 한다", async () => {
      mockedAxios.delete.mockResolvedValueOnce({});

      await simulationService.delete(1);

      expect(mockedAxios.delete).toHaveBeenCalledWith("/api/simulation/1");
    });
  });

  describe("addTrade", () => {
    it("거래 데이터 추가 요청을 올바르게 보내야 한다", async () => {
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

      const result = await simulationService.addTrade(1, tradeData);

      expect(mockedAxios.post).toHaveBeenCalledWith("/api/simulation/1/data", tradeData);
      expect(result).toEqual({ message: "Trade added successfully" });
    });
  });

  describe("getTrades", () => {
    it("거래 내역을 조회해야 한다", async () => {
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

      const result = await simulationService.getTrades(1);

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/simulation/1/data");
      expect(result.trades).toHaveLength(1);
      expect(result.totalElements).toBe(1);
    });
  });

  describe("getReport", () => {
    it("시뮬레이션 리포트를 조회해야 한다", async () => {
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

      const result = await simulationService.getReport(1);

      expect(mockedAxios.get).toHaveBeenCalledWith("/api/simulation/1/report");
      expect(result.summary.simulationId).toBe(1);
      expect(result.summary.totalRoi).toBe(7.14);
    });
  });
});
