package aib.trademate.domain.statement.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    public static class Response {
        private int totalElements;  // 총 보고서 수
        private List<ViewerLink> items;  // 보고서 목록
    }

    /**
     * 개별 보고서 뷰어 링크
     */
    @Getter
    @Builder
    public static class ViewerLink {
        @JsonProperty("rcept_link")
        private String rceptLink;  // 보고서 뷰어 링크

        @JsonProperty("rcept_dt")
        private String rceptDt;    // 보고서 업로드일 (yyyyMMdd)
    }
}
