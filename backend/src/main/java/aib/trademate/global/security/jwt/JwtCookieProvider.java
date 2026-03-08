package aib.trademate.global.security.jwt;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * JWT 토큰을 HttpOnly 쿠키로 관리하는 유틸리티 클래스
 */
@Component
public class JwtCookieProvider {

    public static final String ACCESS_TOKEN_COOKIE = "accessToken";
    public static final String REFRESH_TOKEN_COOKIE = "refreshToken";

    @Value("${jwt.access-token-validity}")
    private long accessTokenValidity;

    @Value("${jwt.refresh-token-validity}")
    private long refreshTokenValidity;

    @Value("${jwt.cookie.secure:false}")
    private boolean secureCookie;

    /**
     * Access Token 쿠키 생성 및 응답에 추가
     */
    public void addAccessTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = createCookie(ACCESS_TOKEN_COOKIE, token, (int) (accessTokenValidity / 1000));
        response.addCookie(cookie);
    }

    /**
     * Refresh Token 쿠키 생성 및 응답에 추가
     */
    public void addRefreshTokenCookie(HttpServletResponse response, String token) {
        Cookie cookie = createCookie(REFRESH_TOKEN_COOKIE, token, (int) (refreshTokenValidity / 1000));
        response.addCookie(cookie);
    }

    /**
     * Access Token 쿠키 삭제
     */
    public void deleteAccessTokenCookie(HttpServletResponse response) {
        Cookie cookie = createCookie(ACCESS_TOKEN_COOKIE, "", 0);
        response.addCookie(cookie);
    }

    /**
     * Refresh Token 쿠키 삭제
     */
    public void deleteRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = createCookie(REFRESH_TOKEN_COOKIE, "", 0);
        response.addCookie(cookie);
    }

    /**
     * 모든 인증 쿠키 삭제
     */
    public void deleteAllAuthCookies(HttpServletResponse response) {
        deleteAccessTokenCookie(response);
        deleteRefreshTokenCookie(response);
    }

    /**
     * HttpOnly 쿠키 생성
     */
    private Cookie createCookie(String name, String value, int maxAge) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);           // JavaScript 접근 불가
        cookie.setSecure(secureCookie);     // HTTPS에서만 전송 (운영 환경)
        cookie.setPath("/");                // 모든 경로에서 쿠키 전송
        cookie.setMaxAge(maxAge);           // 쿠키 만료 시간 (초)
        // SameSite 설정은 Cookie 객체에서 직접 지원하지 않으므로 헤더로 추가
        return cookie;
    }
}
