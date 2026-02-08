package aib.trademate.domain.auth.controller;

import aib.trademate.domain.auth.dto.LoginRequest;
import aib.trademate.domain.auth.dto.SignUpRequest;
import aib.trademate.domain.auth.dto.TokenResponse;
import aib.trademate.domain.auth.service.AuthService;
import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
import aib.trademate.global.exception.ErrorResponse;
import aib.trademate.global.security.jwt.JwtCookieProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "인증", description = "회원가입, 로그인, 토큰 갱신, 로그아웃 API")
public class AuthController {

    private final AuthService authService;
    private final JwtCookieProvider jwtCookieProvider;

    /**
     * 회원가입
     * POST /api/auth/signup
     */
    @Operation(summary = "회원가입", description = "새로운 회원을 등록합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "회원가입 성공"),
            @ApiResponse(responseCode = "400", description = "입력값 유효성 검증 실패",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "이미 존재하는 이메일",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
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
    @Operation(summary = "로그인", description = "이메일/비밀번호로 로그인합니다. 성공 시 JWT 토큰이 HttpOnly 쿠키로 설정됩니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그인 성공"),
            @ApiResponse(responseCode = "401", description = "이메일 또는 비밀번호 불일치",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
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
    @Operation(summary = "토큰 갱신", description = "쿠키의 Refresh Token으로 새로운 Access/Refresh Token을 발급합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "토큰 갱신 성공"),
            @ApiResponse(responseCode = "401", description = "유효하지 않거나 만료된 토큰",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
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
    @Operation(summary = "로그아웃", description = "로그아웃하고 인증 쿠키를 삭제합니다. 인증이 필요합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "로그아웃 성공"),
            @ApiResponse(responseCode = "401", description = "인증 필요",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
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
