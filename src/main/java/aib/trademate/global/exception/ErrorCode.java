package aib.trademate.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * 에러 코드 중앙 관리
 * 모든 에러 응답은 이 enum을 통해 일관된 코드와 메시지를 사용합니다.
 */
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 400 Bad Request
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "COMMON-001", "Invalid input value"),
    INVALID_DATE_FORMAT(HttpStatus.BAD_REQUEST, "COMMON-002", "Invalid date format. Expected format: yyyyMMdd (e.g., 20250112)"),
    INVALID_DATE_VALUE(HttpStatus.BAD_REQUEST, "COMMON-003", "Invalid date value. The date does not exist"),
    MISSING_REQUIRED_PARAMETER(HttpStatus.BAD_REQUEST, "COMMON-004", "Required parameter is missing"),
    INVALID_PARAMETER_TYPE(HttpStatus.BAD_REQUEST, "COMMON-005", "Invalid parameter type"),
    INVALID_QUARTER_VALUE(HttpStatus.BAD_REQUEST, "COMMON-006", "Invalid quarter value. Must be between 1 and 4"),
    INVALID_YEAR_VALUE(HttpStatus.BAD_REQUEST, "COMMON-007", "Invalid year value"),

    // 404 Not Found
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON-010", "Resource not found"),
    STOCK_NOT_FOUND(HttpStatus.NOT_FOUND, "STOCK-001", "Stock not found"),
    STATEMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "STATEMENT-001", "Financial statement not found"),
    API_ENDPOINT_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON-011", "API endpoint not found"),

    // 405 Method Not Allowed
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "COMMON-020", "HTTP method not allowed"),

    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON-100", "An unexpected error occurred"),
    EXTERNAL_API_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON-101", "External API call failed");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
