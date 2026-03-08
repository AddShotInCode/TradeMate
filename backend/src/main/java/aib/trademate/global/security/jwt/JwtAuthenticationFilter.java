package aib.trademate.global.security.jwt;

import aib.trademate.global.exception.ErrorCode;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.SecurityException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT 인증 필터
 * 쿠키 또는 Authorization 헤더에서 JWT 토큰을 검증하고, 유효한 경우 SecurityContext에 인증 정보를 저장
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, 
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = resolveToken(request);

            if (StringUtils.hasText(token)) {
                if (jwtTokenProvider.validateToken(token)) {
                    Authentication authentication = jwtTokenProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    log.debug("Set Authentication to security context for '{}', uri: {}",
                            authentication.getName(), request.getRequestURI());
                }
            }
        } catch (SecurityException | MalformedJwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            setErrorAttributes(request, ErrorCode.MALFORMED_TOKEN, "Invalid JWT token format");
        } catch (ExpiredJwtException e) {
            log.warn("Expired JWT token: {}", e.getMessage());
            setErrorAttributes(request, ErrorCode.TOKEN_EXPIRED, "JWT token has expired");
        } catch (UnsupportedJwtException e) {
            log.warn("Unsupported JWT token: {}", e.getMessage());
            setErrorAttributes(request, ErrorCode.INVALID_TOKEN, "Unsupported JWT token");
        } catch (IllegalArgumentException e) {
            log.warn("JWT claims string is empty: {}", e.getMessage());
            setErrorAttributes(request, ErrorCode.INVALID_TOKEN, "JWT token is empty or invalid");
        } catch (Exception e) {
            log.error("JWT authentication failed: {}", e.getMessage());
            setErrorAttributes(request, ErrorCode.UNAUTHORIZED, "Authentication failed");
        }

        filterChain.doFilter(request, response);
    }

    /**
     * 요청에서 토큰 추출 (쿠키 우선, 그 다음 헤더)
     */
    private String resolveToken(HttpServletRequest request) {
        // 1. 쿠키에서 Access Token 확인
        String tokenFromCookie = extractTokenFromCookie(request);
        if (StringUtils.hasText(tokenFromCookie)) {
            log.debug("Token extracted from cookie");
            return tokenFromCookie;
        }

        // 2. Authorization 헤더에서 토큰 확인 (하위 호환성 유지)
        String bearerToken = request.getHeader(AUTHORIZATION_HEADER);
        if (StringUtils.hasText(bearerToken)) {
            if (bearerToken.startsWith(BEARER_PREFIX)) {
                log.debug("Token extracted from Authorization header");
                return bearerToken.substring(BEARER_PREFIX.length());
            } else {
                log.warn("Authorization header does not start with 'Bearer '");
            }
        }
        return null;
    }

    /**
     * 쿠키에서 Access Token 추출
     */
    private String extractTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (JwtCookieProvider.ACCESS_TOKEN_COOKIE.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    /**
     * 에러 정보를 request attribute에 저장
     * AuthenticationEntryPoint에서 이 정보를 사용하여 응답 생성
     */
    private void setErrorAttributes(HttpServletRequest request, ErrorCode errorCode, String message) {
        request.setAttribute("errorCode", errorCode);
        request.setAttribute("errorMessage", message);
    }
}
