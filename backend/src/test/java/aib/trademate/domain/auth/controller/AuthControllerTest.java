package aib.trademate.domain.auth.controller;

import aib.trademate.domain.auth.dto.LoginRequest;
import aib.trademate.domain.auth.dto.SignUpRequest;
import aib.trademate.domain.auth.dto.TokenResponse;
import aib.trademate.domain.auth.service.AuthService;
import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
import aib.trademate.global.exception.GlobalExceptionHandler;
import aib.trademate.global.security.jwt.JwtCookieProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * AuthController 단위 테스트
 * 
 * MockMvc를 사용하여 컨트롤러 로직만 테스트합니다.
 * Spring Context를 로드하지 않는 빠른 테스트입니다.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthController 테스트")
@SuppressWarnings("null")
class AuthControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @Mock
    private AuthService authService;

    @Mock
    private JwtCookieProvider jwtCookieProvider;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Nested
    @DisplayName("회원가입 API 테스트")
    class SignUpTest {

        @Test
        @DisplayName("정상적인 회원가입 요청이 성공한다")
        void signUpSuccess() throws Exception {
            // given
            SignUpRequest request = new SignUpRequest(
                    "test@test.com",
                    "password123",
                    "홍길동",
                    LocalDate.of(1990, 1, 1),
                    "010-1234-5678"
            );

            doNothing().when(authService).signUp(any(SignUpRequest.class));

            // when & then
            mockMvc.perform(post("/api/auth/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated())
                    .andExpect(jsonPath("$.message").value("User registered successfully"));

            verify(authService).signUp(any(SignUpRequest.class));
        }

        @Test
        @DisplayName("이메일 형식이 잘못된 경우 400 에러가 발생한다")
        void signUpFailsWithInvalidEmail() throws Exception {
            // given
            SignUpRequest request = new SignUpRequest(
                    "invalid-email",  // 잘못된 이메일 형식
                    "password123",
                    "홍길동",
                    LocalDate.of(1990, 1, 1),
                    "010-1234-5678"
            );

            // when & then
            mockMvc.perform(post("/api/auth/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest());

            verify(authService, never()).signUp(any(SignUpRequest.class));
        }

        @Test
        @DisplayName("이미 존재하는 이메일로 가입 시 409 에러가 발생한다")
        void signUpFailsWithDuplicateEmail() throws Exception {
            // given
            SignUpRequest request = new SignUpRequest(
                    "existing@test.com",
                    "password123",
                    "홍길동",
                    LocalDate.of(1990, 1, 1),
                    "010-1234-5678"
            );

            doThrow(new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS))
                    .when(authService).signUp(any(SignUpRequest.class));

            // when & then
            mockMvc.perform(post("/api/auth/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isConflict())
                    .andExpect(jsonPath("$.code").value("AUTH-010"));
        }

        @Test
        @DisplayName("필수 필드가 누락된 경우 400 에러가 발생한다")
        void signUpFailsWithMissingFields() throws Exception {
            // given - 이메일 누락
            String requestBody = """
                    {
                        "password": "password123",
                        "name": "홍길동"
                    }
                    """;

            // when & then
            mockMvc.perform(post("/api/auth/signup")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(requestBody))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("로그인 API 테스트")
    class LoginTest {

        @Test
        @DisplayName("정상적인 로그인 요청이 성공한다")
        void loginSuccess() throws Exception {
            // given
            LoginRequest request = new LoginRequest("test@test.com", "password123");
            TokenResponse tokenResponse = new TokenResponse("accessToken", "refreshToken", 1800L);

            given(authService.login(any(LoginRequest.class))).willReturn(tokenResponse);

            // when & then
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Login successful"))
                    .andExpect(jsonPath("$.expiresIn").value(1800));

            verify(jwtCookieProvider).addAccessTokenCookie(any(), eq("accessToken"));
            verify(jwtCookieProvider).addRefreshTokenCookie(any(), eq("refreshToken"));
        }

        @Test
        @DisplayName("잘못된 인증 정보로 로그인 시 401 에러가 발생한다")
        void loginFailsWithInvalidCredentials() throws Exception {
            // given
            LoginRequest request = new LoginRequest("test@test.com", "wrongpassword");

            given(authService.login(any(LoginRequest.class)))
                    .willThrow(new BusinessException(ErrorCode.INVALID_CREDENTIALS));

            // when & then
            mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.code").value("AUTH-001"));
        }
    }

    @Nested
    @DisplayName("토큰 갱신 API 테스트")
    class RefreshTest {

        @Test
        @DisplayName("유효한 refresh token으로 토큰 갱신이 성공한다")
        void refreshSuccess() throws Exception {
            // given
            TokenResponse tokenResponse = new TokenResponse("newAccessToken", "newRefreshToken", 1800L);
            given(authService.refreshWithToken("validRefreshToken")).willReturn(tokenResponse);

            // when & then
            mockMvc.perform(post("/api/auth/refresh")
                            .cookie(new Cookie("refreshToken", "validRefreshToken")))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("Token refreshed successfully"))
                    .andExpect(jsonPath("$.expiresIn").value(1800));

            verify(jwtCookieProvider).addAccessTokenCookie(any(), eq("newAccessToken"));
            verify(jwtCookieProvider).addRefreshTokenCookie(any(), eq("newRefreshToken"));
        }

        @Test
        @DisplayName("refresh token 쿠키가 없으면 401 에러가 발생한다")
        void refreshFailsWithoutCookie() throws Exception {
            // when & then
            mockMvc.perform(post("/api/auth/refresh"))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.code").value("AUTH-002"));
        }

        @Test
        @DisplayName("만료된 refresh token으로 갱신 시 401 에러가 발생한다")
        void refreshFailsWithExpiredToken() throws Exception {
            // given
            given(authService.refreshWithToken("expiredToken"))
                    .willThrow(new BusinessException(ErrorCode.TOKEN_EXPIRED));

            // when & then
            mockMvc.perform(post("/api/auth/refresh")
                            .cookie(new Cookie("refreshToken", "expiredToken")))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.code").value("AUTH-003"));
        }
    }

    // Note: 로그아웃 API는 @AuthenticationPrincipal을 사용하므로
    // Spring Security 컨텍스트가 필요합니다.
    // 통합 테스트에서 검증합니다.
}
