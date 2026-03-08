package aib.trademate.global.security;

import aib.trademate.global.exception.ErrorCode;
import aib.trademate.global.exception.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 인증되지 않은 사용자가 보호된 리소스에 접근할 때 401 응답 처리
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException, ServletException {
        log.warn("Unauthorized access attempt to '{}': {}", request.getRequestURI(), authException.getMessage());

        // 필터에서 설정한 에러 코드가 있으면 사용
        ErrorCode errorCode = (ErrorCode) request.getAttribute("errorCode");
        String errorMessage = (String) request.getAttribute("errorMessage");

        if (errorCode == null) {
            errorCode = ErrorCode.UNAUTHORIZED;
            errorMessage = "Authentication is required to access this resource";
        }

        ErrorResponse errorResponse = ErrorResponse.of(errorCode, errorMessage, request.getRequestURI());

        response.setStatus(errorCode.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
