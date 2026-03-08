package aib.trademate.domain.statement.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * DART OpenAPI 응답 DTO
 * API: https://opendart.fss.or.kr/api/list.json
 */
public class DartApiDto {

    /**
     * DART API 공시정보 조회 응답
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class DisclosureResponse {
        private String status;      // 응답 상태 ("000": 정상)
        private String message;     // 응답 메시지

        @JsonProperty("page_no")
        private Integer pageNo;     // 현재 페이지 번호

        @JsonProperty("page_count")
        private Integer pageCount;  // 페이지당 건수

        @JsonProperty("total_count")
        private Integer totalCount; // 총 건수

        @JsonProperty("total_page")
        private Integer totalPage;  // 총 페이지 수

        private List<DisclosureItem> list;  // 공시 목록
    }

    /**
     * 개별 공시 정보
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class DisclosureItem {
        @JsonProperty("corp_code")
        private String corpCode;    // 고유번호 (8자리)

        @JsonProperty("corp_name")
        private String corpName;    // 회사명

        @JsonProperty("stock_code")
        private String stockCode;   // 종목코드 (6자리)

        @JsonProperty("corp_cls")
        private String corpCls;     // 법인구분 (Y: 유가, K: 코스닥, N: 코넥스, E: 기타)

        @JsonProperty("report_nm")
        private String reportNm;    // 보고서명 (예: "분기보고서 (2025.03)")

        @JsonProperty("rcept_no")
        private String rceptNo;     // 접수번호 (14자리)

        @JsonProperty("flr_nm")
        private String flrNm;       // 공시 제출인명

        @JsonProperty("rcept_dt")
        private String rceptDt;     // 접수일자 (yyyyMMdd)

        private String rm;          // 비고 ("연": 연결, "": 개별 등)
    }
}
