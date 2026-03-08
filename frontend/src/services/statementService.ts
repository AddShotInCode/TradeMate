import axios from "axios";

// Use relative path to leverage Next.js rewrites (see next.config.ts)
const BASE_URL = "/api";

export interface StatementItem {
  rcept_link: string;
  rcept_dt: string; // YYYYMMDD
}

export interface StatementResponse {
  totalElements: number;
  items: StatementItem[];
}

export const statementService = {
  /**
   * Fetch statement viewer links
   * @param stockCode Stock code
   * @param year Business Year
   * @param quarter Quarter (1, 2, 3, 4)
   * @returns List of viewer links
   */
  getStatements: async (
    stockCode: string,
    year: number,
    quarter: number
  ): Promise<StatementResponse> => {
    try {
      const response = await axios.get(`${BASE_URL}/statement/${stockCode}`, {
        params: { year, quarter },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error("Backend Error Data:", error.response.data);
        console.error("Backend Error Status:", error.response.status);
      }
      console.error("Failed to fetch statements:", error);
      throw error;
    }
  },

  /**
   * Initialize statements (Manager only, but keeping here for reference)
   */
  initStatements: async () => {
    return axios.post(`${BASE_URL}/statement/init`);
  },
};
