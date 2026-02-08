/**
 * authService 테스트
 *
 * GWT 형식으로 테스트 구조화:
 * - Given (사전 조건): Mock 설정 및 테스트 데이터 준비
 * - When (동작): 서비스 메서드 호출
 * - Then (결과): API 호출 검증 및 반환값 확인
 */

import axios from "axios";
import { authService, AuthApiError } from "../authService";

// axios 모듈 모킹
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("authService", () => {
  beforeEach(() => {
    // 각 테스트 전 mock 초기화
    jest.clearAllMocks();
  });

  /**
   * 회원가입 API 테스트
   */
  describe("signup", () => {
    // 테스트용 회원가입 데이터
    const signupPayload = {
      email: "test@example.com",
      password: "password123",
      name: "테스트 사용자",
      birthdate: "1990-01-01",
      phone: "010-1234-5678",
    };

    it("회원가입 성공 시 메시지를 반환해야 한다", async () => {
      // Given: 회원가입 성공 응답이 설정된 상태
      const mockResponse = { data: { message: "회원가입이 완료되었습니다." } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // When: signup 메서드를 호출하면
      const result = await authService.signup(signupPayload);

      // Then: 올바른 엔드포인트로 요청하고 성공 메시지를 반환해야 함
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/signup", signupPayload);
      expect(result).toEqual({ message: "회원가입이 완료되었습니다." });
    });

    it("회원가입 실패 시 AuthApiError를 throw해야 한다", async () => {
      // Given: 중복 이메일 에러 응답이 설정된 상태
      const errorResponse = {
        response: {
          status: 400,
          data: {
            message: "이미 존재하는 이메일입니다.",
            code: "DUPLICATE_EMAIL",
            detail: "email already exists",
          },
        },
      };
      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValueOnce(errorResponse);

      // When: signup 메서드를 호출하면
      // Then: AuthApiError가 throw되어야 함
      await expect(authService.signup(signupPayload)).rejects.toThrow(AuthApiError);
    });

    it("Axios 에러가 아닌 경우 원래 에러를 throw해야 한다", async () => {
      // Given: 네트워크 에러(Axios 에러가 아닌)가 발생한 상태
      const genericError = new Error("Network error");
      mockedAxios.isAxiosError.mockReturnValue(false);
      mockedAxios.post.mockRejectedValueOnce(genericError);

      // When: signup 메서드를 호출하면
      // Then: 원래 에러가 그대로 throw되어야 함
      await expect(authService.signup(signupPayload)).rejects.toThrow("Network error");
    });
  });

  /**
   * 로그인 API 테스트
   */
  describe("login", () => {
    // 테스트용 로그인 데이터
    const loginPayload = {
      email: "test@example.com",
      password: "password123",
    };

    it("로그인 성공 시 응답을 반환해야 한다", async () => {
      // Given: 로그인 성공 응답이 설정된 상태
      const mockResponse = {
        data: { message: "Login successful", expiresIn: 3600 },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // When: login 메서드를 호출하면
      const result = await authService.login(loginPayload);

      // Then: 올바른 엔드포인트로 요청하고 토큰 정보를 반환해야 함
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/login", loginPayload);
      expect(result).toEqual({ message: "Login successful", expiresIn: 3600 });
    });
  });

  /**
   * 토큰 갱신 API 테스트
   */
  describe("refresh", () => {
    it("토큰 갱신 성공 시 응답을 반환해야 한다", async () => {
      // Given: 토큰 갱신 성공 응답이 설정된 상태
      const mockResponse = {
        data: { message: "Token refreshed", expiresIn: 3600 },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // When: refresh 메서드를 호출하면
      const result = await authService.refresh();

      // Then: 올바른 엔드포인트로 요청하고 새 토큰 정보를 반환해야 함
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/refresh");
      expect(result).toEqual({ message: "Token refreshed", expiresIn: 3600 });
    });
  });

  /**
   * 로그아웃 API 테스트
   */
  describe("logout", () => {
    it("로그아웃 요청을 올바르게 보내야 한다", async () => {
      // Given: 로그아웃 성공 응답이 설정된 상태
      mockedAxios.post.mockResolvedValueOnce({});

      // When: logout 메서드를 호출하면
      await authService.logout();

      // Then: 올바른 엔드포인트로 요청해야 함
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/logout");
    });
  });

  /**
   * AuthApiError 클래스 테스트
   */
  describe("AuthApiError", () => {
    it("AuthApiError가 올바르게 생성되어야 한다", () => {
      // Given: 에러 정보가 주어졌을 때
      // When: AuthApiError를 생성하면
      const error = new AuthApiError("Test error", 400, "TEST_CODE", "detail");

      // Then: 모든 속성이 올바르게 설정되어야 함
      expect(error.message).toBe("Test error");
      expect(error.status).toBe(400);
      expect(error.code).toBe("TEST_CODE");
      expect(error.detail).toBe("detail");
      expect(error.name).toBe("AuthApiError");
    });
  });
});
