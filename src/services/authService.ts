import axios from "axios";

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

const BASE_URL = "/api";

export const authService = {
  async signup(payload: SignupRequest): Promise<SignupResponse> {
    try {
      const response = await axios.post<SignupResponse>(`${BASE_URL}/auth/signup`, payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data as AuthErrorResponse | undefined;

        const message =
          (data && typeof data === "object" && typeof data.message === "string" && data.message.trim().length > 0
            ? data.message
            : undefined) ?? error.message;

        throw new AuthApiError(message, status, data?.code, data?.detail);
      }

      throw error;
    }
  },
};
