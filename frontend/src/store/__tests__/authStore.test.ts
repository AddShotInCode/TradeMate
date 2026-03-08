/**
 * authStore 테스트
 *
 * GWT 형식으로 테스트 구조화:
 * - Given (사전 조건): 스토어 상태 및 Mock 설정
 * - When (동작): 스토어 액션 호출
 * - Then (결과): 상태 변경 검증
 */

import { useAuthStore } from "../authStore";
import { authService } from "@/services/authService";

// authService 모듈 모킹
jest.mock("@/services/authService", () => ({
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    // 각 테스트 전 스토어 상태 초기화
    useAuthStore.setState({
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    // mock 함수 초기화
    jest.clearAllMocks();
  });

  /**
   * 초기 상태 테스트
   */
  describe("초기 상태", () => {
    it("초기 상태가 올바르게 설정되어야 한다", () => {
      // Given: 스토어가 생성되었을 때
      // When: 상태를 조회하면
      const state = useAuthStore.getState();

      // Then: 모든 초기값이 올바르게 설정되어 있어야 함
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  /**
   * 로그인 액션 테스트
   */
  describe("login", () => {
    it("로그인 성공 시 isAuthenticated가 true가 되어야 한다", async () => {
      // Given: 로그인 성공 응답이 설정된 상태
      (authService.login as jest.Mock).mockResolvedValueOnce({
        message: "Login successful",
      });

      // When: login 액션을 호출하면
      const { login } = useAuthStore.getState();
      await login({ email: "test@example.com", password: "password123" });

      // Then: 인증 상태가 true로 변경되고 로딩/에러가 초기화되어야 함
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("로그인 중 isLoading이 true가 되어야 한다", async () => {
      // Given: 로그인이 지연되는 상태
      let resolveLogin: (value: unknown) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      (authService.login as jest.Mock).mockReturnValueOnce(loginPromise);

      // When: login 액션을 호출하면 (완료 전)
      const { login } = useAuthStore.getState();
      const loginCall = login({
        email: "test@example.com",
        password: "password123",
      });

      // Then: 로딩 상태가 true여야 함
      expect(useAuthStore.getState().isLoading).toBe(true);

      // 로그인 완료 후 로딩 상태가 false로 변경됨
      resolveLogin!({ message: "Success" });
      await loginCall;
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it("로그인 실패 시 error가 설정되어야 한다", async () => {
      // Given: 인증 실패 응답이 설정된 상태 (401 에러)
      const errorResponse = {
        response: {
          status: 401,
          data: { message: "Invalid credentials" },
        },
      };
      (authService.login as jest.Mock).mockRejectedValueOnce(errorResponse);

      // When: login 액션을 호출하면
      const { login } = useAuthStore.getState();
      await expect(login({ email: "test@example.com", password: "wrongpassword" })).rejects.toEqual(
        errorResponse
      );

      // Then: 인증 상태가 false이고 에러 메시지가 설정되어야 함
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("이메일 또는 비밀번호가 올바르지 않습니다.");
    });

    it("401이 아닌 에러 시 서버 메시지가 표시되어야 한다", async () => {
      // Given: 서버 에러 응답이 설정된 상태 (500 에러)
      const errorResponse = {
        response: {
          status: 500,
          data: { message: "서버 오류가 발생했습니다." },
        },
      };
      (authService.login as jest.Mock).mockRejectedValueOnce(errorResponse);

      // When: login 액션을 호출하면
      const { login } = useAuthStore.getState();
      await expect(login({ email: "test@example.com", password: "password" })).rejects.toEqual(
        errorResponse
      );

      // Then: 서버에서 반환한 에러 메시지가 설정되어야 함
      const state = useAuthStore.getState();
      expect(state.error).toBe("서버 오류가 발생했습니다.");
    });
  });

  /**
   * 로그아웃 액션 테스트
   */
  describe("logout", () => {
    it("로그아웃 시 isAuthenticated가 false가 되어야 한다", async () => {
      // Given: 로그인된 상태에서 로그아웃 성공 응답이 설정된 상태
      useAuthStore.setState({ isAuthenticated: true });
      (authService.logout as jest.Mock).mockResolvedValueOnce(undefined);

      // When: logout 액션을 호출하면
      const { logout } = useAuthStore.getState();
      // Note: JSDOM에서는 navigation이 지원되지 않아 에러가 발생할 수 있음
      try {
        await logout();
      } catch {
        // JSDOM navigation 제한으로 인한 예상된 에러
      }

      // Then: 인증 상태가 false로 변경되어야 함
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });

    it("로그아웃 API 실패해도 상태는 변경되어야 한다", async () => {
      // Given: 로그인된 상태에서 로그아웃 API가 실패하는 상태
      useAuthStore.setState({ isAuthenticated: true });
      (authService.logout as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

      // When: logout 액션을 호출하면
      const { logout } = useAuthStore.getState();
      try {
        await logout();
      } catch {
        // JSDOM navigation 제한으로 인한 예상된 에러
      }

      // Then: API 실패와 관계없이 인증 상태가 false로 변경되어야 함
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  /**
   * 초기화 액션 테스트
   * 페이지 로드 시 토큰 유효성 검사
   */
  describe("initialize", () => {
    it("초기화 성공 시 isAuthenticated가 true가 되어야 한다", async () => {
      // Given: 토큰 갱신 성공 응답이 설정된 상태
      (authService.refresh as jest.Mock).mockResolvedValueOnce({
        message: "Token refreshed",
      });

      // When: initialize 액션을 호출하면
      const { initialize } = useAuthStore.getState();
      await initialize();

      // Then: 유효한 토큰이 있으므로 인증 상태가 true여야 함
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it("초기화 실패 시 isAuthenticated가 false가 되어야 한다", async () => {
      // Given: 토큰 갱신 실패 응답이 설정된 상태 (만료된 토큰)
      (authService.refresh as jest.Mock).mockRejectedValueOnce(new Error("Token expired"));

      // When: initialize 액션을 호출하면
      const { initialize } = useAuthStore.getState();
      await initialize();

      // Then: 유효한 토큰이 없으므로 인증 상태가 false여야 함
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it("초기화 중 isLoading이 true가 되어야 한다", async () => {
      // Given: 토큰 갱신이 지연되는 상태
      let resolveRefresh: (value: unknown) => void;
      const refreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve;
      });
      (authService.refresh as jest.Mock).mockReturnValueOnce(refreshPromise);

      // When: initialize 액션을 호출하면 (완료 전)
      const { initialize } = useAuthStore.getState();
      const initCall = initialize();

      // Then: 로딩 상태가 true여야 함
      expect(useAuthStore.getState().isLoading).toBe(true);

      // 초기화 완료 후 로딩 상태가 false로 변경됨
      resolveRefresh!({ message: "Success" });
      await initCall;
      expect(useAuthStore.getState().isLoading).toBe(false);
    });
  });
});
