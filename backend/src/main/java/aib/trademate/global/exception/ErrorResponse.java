package aib.trademate.global.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * API 에러 응답 DTO
 * 모든 에러 응답은 이 형식을 따릅니다.
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "에러 응답")
public class ErrorResponse {

    @Schema(description = "에러 발생 시간", example = "2024-06-15T10:30:00")
    private final LocalDateTime timestamp;

    @Schema(description = "HTTP 상태 코드", example = "400")
    private final int status;

    @Schema(description = "HTTP 에러 메시지", example = "Bad Request")
    private final String error;

    @Schema(description = "에러 코드", example = "COMMON-001")
    private final String code;

    @Schema(description = "에러 상세 메시지", example = "Invalid input value")
    private final String message;

    @Schema(description = "요청 경로", example = "/api/auth/signup")
    private final String path;

    @Schema(description = "필드별 유효성 검증 에러 목록")
    private final List<FieldError> fieldErrors;

    /**
     * ErrorCode로부터 ErrorResponse 생성
     */
    public static ErrorResponse of(ErrorCode errorCode, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .error(errorCode.getStatus().getReasonPhrase())
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .path(path)
                .build();
    }

    /**
     * ErrorCode와 커스텀 메시지로 ErrorResponse 생성
     */
    public static ErrorResponse of(ErrorCode errorCode, String message, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .error(errorCode.getStatus().getReasonPhrase())
                .code(errorCode.getCode())
                .message(message)
                .path(path)
                .build();
    }

    /**
     * ErrorCode와 필드 에러 목록으로 ErrorResponse 생성
     */
    public static ErrorResponse of(ErrorCode errorCode, List<FieldError> fieldErrors, String path) {
        return ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(errorCode.getStatus().value())
                .error(errorCode.getStatus().getReasonPhrase())
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .path(path)
                .fieldErrors(fieldErrors)
                .build();
    }

    /**
     * 필드별 에러 정보
     */
    @Getter
    @Builder
    public static class FieldError {
        private final String field;
        private final String value;
        private final String reason;

        public static FieldError of(String field, String value, String reason) {
            return FieldError.builder()
                    .field(field)
                    .value(value)
                    .reason(reason)
                    .build();
        }
    }
}
