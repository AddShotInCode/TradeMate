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
    INVALID_REQUEST_BODY(HttpStatus.BAD_REQUEST, "COMMON-008", "Request body is missing or invalid"),
    INVALID_JSON_FORMAT(HttpStatus.BAD_REQUEST, "COMMON-009", "Invalid JSON format"),
    SIMULATION_NOT_ENDED(HttpStatus.BAD_REQUEST, "SIMULATION-002", "Simulation is not ended yet. Set end date first"),

    // 401 Unauthorized
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "AUTH-001", "Invalid email or password"),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH-002", "Invalid or expired token"),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "AUTH-003", "Token has expired"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "AUTH-004", "Authentication required"),
    MALFORMED_TOKEN(HttpStatus.UNAUTHORIZED, "AUTH-005", "Malformed JWT token"),

    // 403 Forbidden
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "AUTH-020", "Access denied"),

    // 404 Not Found
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON-010", "Resource not found"),
    STOCK_NOT_FOUND(HttpStatus.NOT_FOUND, "STOCK-001", "Stock not found"),
    STATEMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "STATEMENT-001", "Financial statement not found"),
    SIMULATION_NOT_FOUND(HttpStatus.NOT_FOUND, "SIMULATION-001", "Simulation not found"),
    REPORT_NOT_FOUND(HttpStatus.NOT_FOUND, "REPORT-001", "Report not found for this simulation"),
    API_ENDPOINT_NOT_FOUND(HttpStatus.NOT_FOUND, "COMMON-011", "API endpoint not found"),

    // 405 Method Not Allowed
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "COMMON-020", "HTTP method not allowed"),

    // 409 Conflict
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "AUTH-010", "Email already exists"),
    REPORT_ALREADY_EXISTS(HttpStatus.CONFLICT, "REPORT-002", "Report already exists for this simulation"),

    // 500 Internal Server Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON-100", "An unexpected error occurred"),
    EXTERNAL_API_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON-101", "External API call failed");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
