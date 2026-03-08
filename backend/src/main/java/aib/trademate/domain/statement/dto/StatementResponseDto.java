package aib.trademate.domain.statement.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

/**
 * 재무제표 조회 API 응답 DTO
 */
public class StatementResponseDto {

    /**
     * 재무제표 목록 응답 (같은 분기의 모든 버전 포함)
     */
    @Getter
    @Builder
    @Schema(description = "재무제표 목록 응답")
    public static class Response {
        @Schema(description = "총 보고서 수", example = "2")
        private int totalElements;

        @Schema(description = "보고서 목록")
        private List<ViewerLink> items;
    }

    /**
     * 개별 보고서 뷰어 링크
     */
    @Getter
    @Builder
    @Schema(description = "재무제표 뷰어 링크")
    public static class ViewerLink {
        @JsonProperty("rcept_link")
        @Schema(description = "보고서 뷰어 링크", example = "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20240515000123")
        private String rceptLink;

        @JsonProperty("rcept_dt")
        @Schema(description = "보고서 업로드일 (yyyyMMdd)", example = "20240515")
        private String rceptDt;
    }
}
