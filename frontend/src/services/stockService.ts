import axios from "axios";

export interface Stock {
  code: string;
  name: string;
  market: string;
}

export interface StockItem {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  changeAmount: number;
  changeRate: number;
}

export interface StockResponse {
  stock: Stock;
  pagination: {
    page: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
  };
  items: StockItem[];
}

const BASE_URL = "/api";

export const stockService = {
  async fetchStockData(
    stockCode: string,
    start: string,
    end: string,
    page: number = 1,
    pageSize: number = 1000
  ): Promise<StockResponse> {
    try {
      const response = await axios.get<StockResponse>(`${BASE_URL}/stock/${stockCode}`, {
        params: {
          start,
          end,
          page,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        throw new Error(error.response?.data?.message || error.message);
      }
      console.error("Failed to fetch stock data:", error);
      throw error;
    }
  },
};
