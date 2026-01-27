import { create } from "zustand";
import { authService, LoginRequest } from "@/services/authService";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      await authService.login(data);
      // Cookies are set by the server

      set({
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      if (error.response?.status !== 401) {
        console.error("Login Failed:", error);
      }
      let errorMessage = error.response?.data?.message || "로그인에 실패했습니다.";

      if (error.response?.status === 401) {
        errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      // Cookies are cleared by the server
      set({ isAuthenticated: false });
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      // Try to refresh token to verify session
      await authService.refresh();
      set({
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      // If refresh fails, we are not authenticated
      set({
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
