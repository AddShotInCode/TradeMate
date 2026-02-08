import axios from "axios";
import { authService, AuthApiError } from "../authService";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    const signupPayload = {
      email: "test@example.com",
      password: "password123",
      name: "테스트 사용자",
      birthdate: "1990-01-01",
      phone: "010-1234-5678",
    };

    it("회원가입 성공 시 메시지를 반환해야 한다", async () => {
      const mockResponse = { data: { message: "회원가입이 완료되었습니다." } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.signup(signupPayload);

      expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/signup", signupPayload);
      expect(result).toEqual({ message: "회원가입이 완료되었습니다." });
    });

    it("회원가입 실패 시 AuthApiError를 throw해야 한다", async () => {
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

      await expect(authService.signup(signupPayload)).rejects.toThrow(AuthApiError);
    });

    it("Axios 에러가 아닌 경우 원래 에러를 throw해야 한다", async () => {
      const genericError = new Error("Network error");
      mockedAxios.isAxiosError.mockReturnValue(false);
      mockedAxios.post.mockRejectedValueOnce(genericError);

      await expect(authService.signup(signupPayload)).rejects.toThrow("Network error");
    });
  });

  describe("login", () => {
    const loginPayload = {
      email: "test@example.com",
      password: "password123",
    };

    it("로그인 성공 시 응답을 반환해야 한다", async () => {
      const mockResponse = {
        data: { message: "Login successful", expiresIn: 3600 },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.login(loginPayload);

      expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/login", loginPayload);
      expect(result).toEqual({ message: "Login successful", expiresIn: 3600 });
    });
  });

  describe("refresh", () => {
    it("토큰 갱신 성공 시 응답을 반환해야 한다", async () => {
      const mockResponse = {
        data: { message: "Token refreshed", expiresIn: 3600 },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await authService.refresh();

      expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/refresh");
      expect(result).toEqual({ message: "Token refreshed", expiresIn: 3600 });
    });
  });

  describe("logout", () => {
    it("로그아웃 요청을 올바르게 보내야 한다", async () => {
      mockedAxios.post.mockResolvedValueOnce({});

      await authService.logout();

      expect(mockedAxios.post).toHaveBeenCalledWith("/api/auth/logout");
    });
  });

  describe("AuthApiError", () => {
    it("AuthApiError가 올바르게 생성되어야 한다", () => {
      const error = new AuthApiError("Test error", 400, "TEST_CODE", "detail");

      expect(error.message).toBe("Test error");
      expect(error.status).toBe(400);
      expect(error.code).toBe("TEST_CODE");
      expect(error.detail).toBe("detail");
      expect(error.name).toBe("AuthApiError");
    });
  });
});
