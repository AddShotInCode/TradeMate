import axios from "axios";

const BASE_URL = "/api";

// --- Signup Types & Interfaces ---
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  birthdate: string; // YYYY-MM-DD
  phone?: string | null;
}

export interface SignupResponse {
  message: string;
}

// --- Login/Auth Types & Interfaces ---
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  // No payload needed, uses HttpOnly cookie
}

export interface AuthResponse {
  message: string;
  expiresIn?: number;
}

// --- Error Handling ---
export interface AuthErrorResponse {
  timestamp?: string;
  status?: number;
  code?: string;
  message?: string;
  detail?: string;
}

export class AuthApiError extends Error {
  status?: number;
  code?: string;
  detail?: string;

  constructor(message: string, status?: number, code?: string, detail?: string) {
    super(message);
    this.name = "AuthApiError";
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

export const authService = {
  // Signup
  async signup(payload: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await axios.post<SignupResponse>(`${BASE_URL}/auth/signup`, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as AuthErrorResponse | undefined;

        const message =
          (data &&
          typeof data === "object" &&
          typeof data.message === "string" &&
          data.message.trim().length > 0
            ? data.message
            : undefined) ?? error.message;

        throw new AuthApiError(message, status, data?.code, data?.detail);
      }
      throw error;
    }
  },

  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/login`, data);
    return response.data;
  },

  // Refresh
  refresh: async (): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${BASE_URL}/auth/refresh`);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await axios.post(`${BASE_URL}/auth/logout`);
  },
};
