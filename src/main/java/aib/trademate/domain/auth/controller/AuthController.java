package aib.trademate.domain.auth.controller;

import aib.trademate.domain.auth.dto.LoginRequest;
import aib.trademate.domain.auth.dto.SignUpRequest;
import aib.trademate.domain.auth.dto.TokenResponse;
import aib.trademate.domain.auth.service.AuthService;
import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
import aib.trademate.global.security.jwt.JwtCookieProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 인증 관련 API 컨트롤러
 * 토큰은 HttpOnly 쿠키로 전송됩니다.
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtCookieProvider jwtCookieProvider;

    /**
     * 회원가입
     * POST /api/auth/signup
     */
    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUp(@Valid @RequestBody SignUpRequest request) {
        log.debug("Sign up request for email: {}", request.email());
        authService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "User registered successfully"));
    }

    /**
     * 로그인
     * POST /api/auth/login
     * 토큰은 HttpOnly 쿠키로 전송됩니다.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {
        log.debug("Login request for email: {}", request.email());
        TokenResponse tokenResponse = authService.login(request);

        // HttpOnly 쿠키로 토큰 설정
        jwtCookieProvider.addAccessTokenCookie(response, tokenResponse.accessToken());
        jwtCookieProvider.addRefreshTokenCookie(response, tokenResponse.refreshToken());

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "expiresIn", tokenResponse.expiresIn()
        ));
    }

    /**
     * 토큰 갱신
     * POST /api/auth/refresh
     * Refresh Token은 쿠키에서 읽어옵니다.
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh(
            HttpServletRequest request,
            HttpServletResponse response) {
        log.debug("Token refresh request");
        
        // 쿠키에서 refresh token 추출
        String refreshToken = extractTokenFromCookie(request, JwtCookieProvider.REFRESH_TOKEN_COOKIE);
        if (refreshToken == null) {
            throw new BusinessException(ErrorCode.INVALID_TOKEN, "Refresh token not found in cookie");
        }

        TokenResponse tokenResponse = authService.refreshWithToken(refreshToken);

        // 새로운 토큰으로 쿠키 갱신
        jwtCookieProvider.addAccessTokenCookie(response, tokenResponse.accessToken());
        jwtCookieProvider.addRefreshTokenCookie(response, tokenResponse.refreshToken());

        return ResponseEntity.ok(Map.of(
                "message", "Token refreshed successfully",
                "expiresIn", tokenResponse.expiresIn()
        ));
    }

    /**
     * 로그아웃
     * POST /api/auth/logout
     * 쿠키를 삭제합니다.
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            @AuthenticationPrincipal UserDetails userDetails,
            HttpServletResponse response) {
        if (userDetails == null) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Authentication required for logout");
        }
        log.debug("Logout request for: {}", userDetails.getUsername());
        authService.logout(userDetails.getUsername());

        // 모든 인증 쿠키 삭제
        jwtCookieProvider.deleteAllAuthCookies(response);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    /**
     * 쿠키에서 토큰 추출
     */
    private String extractTokenFromCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
