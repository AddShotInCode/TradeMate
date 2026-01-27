package aib.trademate.global.exception;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.DateTimeException;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice
@SuppressWarnings("null") // HttpStatus enum은 null이 될 수 없으므로 경고 억제
public class GlobalExceptionHandler {

    /**
     * BusinessException 처리 (StockNotFoundException, StatementNotFoundException 등)
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException e, HttpServletRequest request) {
        log.warn("Business exception: {}", e.getMessage());

        ErrorResponse response = ErrorResponse.of(
                e.getErrorCode(),
                e.getMessage(),
                request.getRequestURI());

        return ResponseEntity.status(e.getErrorCode().getStatus()).body(response);
    }

    /**
     * 존재하지 않는 API 엔드포인트 요청 시 404 반환
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(
            NoHandlerFoundException e, HttpServletRequest request) {
        log.warn("API endpoint not found: {} {}", e.getHttpMethod(), e.getRequestURL());

        String message = String.format("API endpoint not found: %s %s", 
                e.getHttpMethod(), e.getRequestURL());

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.API_ENDPOINT_NOT_FOUND,
                message,
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.API_ENDPOINT_NOT_FOUND.getStatus()).body(response);
    }

    /**
     * 필수 파라미터 누락 시 400 반환
     * (예: start, end, year, quarter 등)
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingServletRequestParameter(
            MissingServletRequestParameterException e, HttpServletRequest request) {
        log.warn("Missing required parameter: {}", e.getParameterName());

        String message = String.format("Required parameter '%s' is missing", e.getParameterName());

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.MISSING_REQUIRED_PARAMETER,
                message,
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.MISSING_REQUIRED_PARAMETER.getStatus()).body(response);
    }

    /**
     * 파라미터 타입 불일치 시 400 반환
     * (예: year에 문자열, quarter에 문자열 등)
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException e, HttpServletRequest request) {
        log.warn("Invalid parameter type: {} = {}", e.getName(), e.getValue());

        Class<?> requiredType = e.getRequiredType();
        String expectedType = requiredType != null 
                ? requiredType.getSimpleName() 
                : "unknown";
        String message = String.format("Parameter '%s' should be of type %s, but received: '%s'",
                e.getName(), expectedType, e.getValue());

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.INVALID_PARAMETER_TYPE,
                message,
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.INVALID_PARAMETER_TYPE.getStatus()).body(response);
    }

    /**
     * 날짜 형식 또는 존재하지 않는 날짜 오류 시 400 반환
     * (예: 20250631 - 6월은 30일까지)
     */
    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<ErrorResponse> handleDateTimeParseException(
            DateTimeParseException e, HttpServletRequest request) {
        log.warn("Invalid date: {}", e.getParsedString());

        String message = String.format(
                "Invalid date: '%s'. The date format is wrong or the date does not exist. " +
                "Expected format: yyyyMMdd (e.g., 20250112)",
                e.getParsedString());

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.INVALID_DATE_FORMAT,
                message,
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.INVALID_DATE_FORMAT.getStatus()).body(response);
    }

    /**
     * DateTimeException 처리 (날짜 계산 오류 등)
     */
    @ExceptionHandler(DateTimeException.class)
    public ResponseEntity<ErrorResponse> handleDateTimeException(
            DateTimeException e, HttpServletRequest request) {
        log.warn("Date time exception: {}", e.getMessage());

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.INVALID_DATE_VALUE,
                e.getMessage(),
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.INVALID_DATE_VALUE.getStatus()).body(response);
    }

    /**
     * Bean Validation 실패 시 400 반환
     * (@Min, @Max, @NotNull 등)
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(
            ConstraintViolationException e, HttpServletRequest request) {
        log.warn("Validation failed: {}", e.getMessage());

        List<ErrorResponse.FieldError> fieldErrors = e.getConstraintViolations().stream()
                .map(violation -> ErrorResponse.FieldError.of(
                        getFieldName(violation.getPropertyPath().toString()),
                        violation.getInvalidValue() != null ? violation.getInvalidValue().toString() : "null",
                        violation.getMessage()))
                .toList();

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.INVALID_INPUT_VALUE,
                fieldErrors,
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.INVALID_INPUT_VALUE.getStatus()).body(response);
    }

    /**
     * HTTP 메서드 불일치 시 405 반환
     * (예: GET 전용 API에 POST 요청)
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupported(
            HttpRequestMethodNotSupportedException e, HttpServletRequest request) {
        log.warn("Method not allowed: {} for {}", e.getMethod(), request.getRequestURI());

        String message = String.format("HTTP method '%s' is not supported for this endpoint. " +
                "Supported methods: %s",
                e.getMethod(),
                e.getSupportedHttpMethods() != null ? e.getSupportedHttpMethods() : "N/A");

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.METHOD_NOT_ALLOWED,
                message,
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.METHOD_NOT_ALLOWED.getStatus()).body(response);
    }

    /**
     * @Valid 검증 실패 시 400 반환
     * (@RequestBody의 필드 검증 실패)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e, HttpServletRequest request) {
        log.warn("Validation failed: {}", e.getMessage());

        List<ErrorResponse.FieldError> fieldErrors = e.getBindingResult().getFieldErrors().stream()
                .map(error -> ErrorResponse.FieldError.of(
                        error.getField(),
                        error.getRejectedValue() != null ? error.getRejectedValue().toString() : "null",
                        error.getDefaultMessage()))
                .collect(Collectors.toList());

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.INVALID_INPUT_VALUE,
                fieldErrors,
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.INVALID_INPUT_VALUE.getStatus()).body(response);
    }

    /**
     * Request Body가 없거나 JSON 파싱 오류 시 400 반환
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException e, HttpServletRequest request) {
        log.warn("Message not readable: {}", e.getMessage());

        ErrorCode errorCode;
        String message;

        Throwable cause = e.getCause();
        if (cause instanceof JsonParseException) {
            errorCode = ErrorCode.INVALID_JSON_FORMAT;
            message = "Invalid JSON syntax: " + extractJsonErrorMessage(cause.getMessage());
        } else if (cause instanceof JsonMappingException) {
            errorCode = ErrorCode.INVALID_JSON_FORMAT;
            if (cause instanceof InvalidFormatException ife) {
                message = String.format("Invalid value '%s' for field '%s'. Expected type: %s",
                        ife.getValue(),
                        extractFieldName(ife),
                        ife.getTargetType().getSimpleName());
            } else {
                message = "Invalid JSON structure: " + extractJsonErrorMessage(cause.getMessage());
            }
        } else if (e.getMessage() != null && e.getMessage().contains("Required request body is missing")) {
            errorCode = ErrorCode.INVALID_REQUEST_BODY;
            message = "Request body is required but was not provided";
        } else {
            errorCode = ErrorCode.INVALID_REQUEST_BODY;
            message = "Request body is missing or malformed";
        }

        ErrorResponse response = ErrorResponse.of(errorCode, message, request.getRequestURI());
        return ResponseEntity.status(errorCode.getStatus()).body(response);
    }

    /**
     * 필수 헤더 누락 시 400 반환
     */
    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<ErrorResponse> handleMissingRequestHeaderException(
            MissingRequestHeaderException e, HttpServletRequest request) {
        log.warn("Missing required header: {}", e.getHeaderName());

        String message = String.format("Required header '%s' is missing", e.getHeaderName());

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.MISSING_REQUIRED_PARAMETER,
                message,
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.MISSING_REQUIRED_PARAMETER.getStatus()).body(response);
    }

    /**
     * Spring Security 인증 예외 처리 (401)
     * (Filter에서 처리되지 않고 Controller까지 온 경우)
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(
            AuthenticationException e, HttpServletRequest request) {
        log.warn("Authentication failed: {}", e.getMessage());

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.UNAUTHORIZED,
                e.getMessage(),
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.UNAUTHORIZED.getStatus()).body(response);
    }

    /**
     * Spring Security 접근 거부 예외 처리 (403)
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(
            AccessDeniedException e, HttpServletRequest request) {
        log.warn("Access denied: {}", e.getMessage());

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.ACCESS_DENIED,
                "You don't have permission to access this resource",
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.ACCESS_DENIED.getStatus()).body(response);
    }

    /**
     * IllegalArgumentException 처리 (비즈니스 로직에서 던진 예외)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(
            IllegalArgumentException e, HttpServletRequest request) {
        log.warn("Bad request: {}", e.getMessage());

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.INVALID_INPUT_VALUE,
                e.getMessage(),
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.INVALID_INPUT_VALUE.getStatus()).body(response);
    }

    /**
     * 기타 모든 예외 처리 (500)
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(
            Exception e, HttpServletRequest request) {
        log.error("Internal server error: {}", e.getMessage(), e);

        ErrorResponse response = ErrorResponse.of(
                ErrorCode.INTERNAL_SERVER_ERROR,
                request.getRequestURI());

        return ResponseEntity.status(ErrorCode.INTERNAL_SERVER_ERROR.getStatus()).body(response);
    }

    /**
     * PropertyPath에서 필드명만 추출
     */
    private String getFieldName(String propertyPath) {
        String[] parts = propertyPath.split("\\.");
        return parts.length > 0 ? parts[parts.length - 1] : propertyPath;
    }

    /**
     * JSON 에러 메시지에서 핵심 내용만 추출
     */
    private String extractJsonErrorMessage(String message) {
        if (message == null) {
            return "Unknown JSON error";
        }
        // 첫 줄만 추출하여 너무 긴 메시지 방지
        int newlineIndex = message.indexOf('\n');
        if (newlineIndex > 0) {
            return message.substring(0, newlineIndex);
        }
        return message.length() > 100 ? message.substring(0, 100) + "..." : message;
    }

    /**
     * InvalidFormatException에서 필드명 추출
     */
    private String extractFieldName(InvalidFormatException e) {
        if (e.getPath() != null && !e.getPath().isEmpty()) {
            return e.getPath().stream()
                    .map(JsonMappingException.Reference::getFieldName)
                    .filter(name -> name != null)
                    .collect(Collectors.joining("."));
        }
        return "unknown";
    }
}
