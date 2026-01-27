import axios from "@/lib/axios";

// Types
export interface Simulation {
  id: number;
  stockCode: string;
  startDate: string;
  endDate: string | null;
  createdAt: string;
}

export interface SimulationListResponse {
  simulations: Simulation[];
  totalElements: number;
}

export interface CreateSimulationResponse {
  id: number;
  message: string;
}

export interface TradeData {
  timestamp: string;
  balance: number;
  price: number;
  upper: number;
  lower: number;
  type: "B" | "S";
  volume: number;
  comment?: string;
}

export interface TradeListResponse {
  trades: TradeData[];
  totalElements: number;
}

const BASE_URL = "/api/simulation";

export const simulationService = {
  // 1. Create Simulation
  create: async (code: string, start: string): Promise<CreateSimulationResponse> => {
    const response = await axios.post<CreateSimulationResponse>(
      `${BASE_URL}?code=${code}&start=${start}`,
    );
    return response.data;
  },

  // 2. Get Simulation List
  getList: async (): Promise<SimulationListResponse> => {
    const response = await axios.get<SimulationListResponse>(BASE_URL);
    return response.data;
  },

  // 3. Update End Date (Terminate)
  terminate: async (id: number, end: string): Promise<{ message: string }> => {
    const response = await axios.patch<{ message: string }>(`${BASE_URL}/${id}?end=${end}`);
    return response.data;
  },

  // 4. Delete Simulation
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
  },

  // 5. Add Trade Data
  addTrade: async (id: number, data: TradeData): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`${BASE_URL}/${id}/data`, data);
    return response.data;
  },

  // 6. Get Trade List
  getTrades: async (id: number): Promise<TradeListResponse> => {
    const response = await axios.get<TradeListResponse>(`${BASE_URL}/${id}/data`);
    return response.data;
  },
};
