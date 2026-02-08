import { useAuthStore } from "../authStore";
import { authService } from "@/services/authService";

// Mock authService
jest.mock("@/services/authService", () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("초기 상태", () => {
    it("초기 상태가 올바르게 설정되어야 한다", () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe("login", () => {
    it("로그인 성공 시 isAuthenticated가 true가 되어야 한다", async () => {
      (authService.login as jest.Mock).mockResolvedValueOnce({
        message: "Login successful",
      });

      const { login } = useAuthStore.getState();
      await login({ email: "test@example.com", password: "password123" });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("로그인 중 isLoading이 true가 되어야 한다", async () => {
      let resolveLogin: (value: unknown) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      (authService.login as jest.Mock).mockReturnValueOnce(loginPromise);

      const { login } = useAuthStore.getState();
      const loginCall = login({
        email: "test@example.com",
        password: "password123",
      });

      // Check loading state immediately after calling login
      expect(useAuthStore.getState().isLoading).toBe(true);

      // Resolve and wait for completion
      resolveLogin!({ message: "Success" });
      await loginCall;

      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it("로그인 실패 시 error가 설정되어야 한다", async () => {
      const errorResponse = {
        response: {
          status: 401,
          data: { message: "Invalid credentials" },
        },
      };
      (authService.login as jest.Mock).mockRejectedValueOnce(errorResponse);

      const { login } = useAuthStore.getState();

      await expect(
        login({ email: "test@example.com", password: "wrongpassword" })
      ).rejects.toEqual(errorResponse);

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("이메일 또는 비밀번호가 올바르지 않습니다.");
    });

    it("401이 아닌 에러 시 서버 메시지가 표시되어야 한다", async () => {
      const errorResponse = {
        response: {
          status: 500,
          data: { message: "서버 오류가 발생했습니다." },
        },
      };
      (authService.login as jest.Mock).mockRejectedValueOnce(errorResponse);

      const { login } = useAuthStore.getState();

      await expect(
        login({ email: "test@example.com", password: "password" })
      ).rejects.toEqual(errorResponse);

      const state = useAuthStore.getState();
      expect(state.error).toBe("서버 오류가 발생했습니다.");
    });
  });

  describe("logout", () => {
    it("로그아웃 시 isAuthenticated가 false가 되어야 한다", async () => {
      // Set authenticated state first
      useAuthStore.setState({ isAuthenticated: true });
      (authService.logout as jest.Mock).mockResolvedValueOnce(undefined);

      const { logout } = useAuthStore.getState();
      // Note: This will throw in JSDOM due to navigation not being implemented
      // but the state should still be updated in the finally block
      try {
        await logout();
      } catch {
        // Expected to throw due to JSDOM navigation limitation
      }

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });

    it("로그아웃 API 실패해도 상태는 변경되어야 한다", async () => {
      useAuthStore.setState({ isAuthenticated: true });
      (authService.logout as jest.Mock).mockRejectedValueOnce(
        new Error("Network error")
      );

      const { logout } = useAuthStore.getState();
      try {
        await logout();
      } catch {
        // Expected to throw due to JSDOM navigation limitation
      }

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe("initialize", () => {
    it("초기화 성공 시 isAuthenticated가 true가 되어야 한다", async () => {
      (authService.refresh as jest.Mock).mockResolvedValueOnce({
        message: "Token refreshed",
      });

      const { initialize } = useAuthStore.getState();
      await initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it("초기화 실패 시 isAuthenticated가 false가 되어야 한다", async () => {
      (authService.refresh as jest.Mock).mockRejectedValueOnce(
        new Error("Token expired")
      );

      const { initialize } = useAuthStore.getState();
      await initialize();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("초기화 중 isLoading이 true가 되어야 한다", async () => {
      let resolveRefresh: (value: unknown) => void;
      const refreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve;
      });
      (authService.refresh as jest.Mock).mockReturnValueOnce(refreshPromise);

      const { initialize } = useAuthStore.getState();
      const initCall = initialize();

      expect(useAuthStore.getState().isLoading).toBe(true);

      resolveRefresh!({ message: "Success" });
      await initCall;

      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });
});
