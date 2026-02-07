package aib.trademate.domain.stock.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

public class StockPriceResponseDto {

    @Getter
    @Builder
    @Schema(description = "주가 조회 응답")
    public static class Response {
        @Schema(description = "종목 정보")
        private StockInfo stock;

        @Schema(description = "페이지네이션 정보")
        private Pagination pagination;

        @Schema(description = "주가 데이터 목록")
        private List<PriceItem> items;
    }

    @Getter
    @Builder
    @Schema(description = "종목 정보")
    public static class StockInfo {
        @Schema(description = "종목코드", example = "005930")
        private String code;

        @Schema(description = "종목명", example = "삼성전자")
        private String name;

        @Schema(description = "시장 구분", example = "KOSPI")
        private String market;
    }

    @Getter
    @Builder
    @Schema(description = "페이지네이션 정보")
    public static class Pagination {
        @Schema(description = "현재 페이지", example = "1")
        private int page;

        @Schema(description = "페이지 크기", example = "10")
        private int pageSize;

        @Schema(description = "총 데이터 건수", example = "250")
        private long totalElements;

        @Schema(description = "총 페이지 수", example = "25")
        private int totalPages;
    }

    @Getter
    @Builder
    @Schema(description = "일별 주가 데이터")
    public static class PriceItem {
        @Schema(description = "날짜", example = "2024-01-15")
        private LocalDate date;

        @Schema(description = "시가", example = "72000")
        private Long open;

        @Schema(description = "고가", example = "74500")
        private Long high;

        @Schema(description = "저가", example = "71000")
        private Long low;

        @Schema(description = "종가", example = "73500")
        private Long close;

        @Schema(description = "거래량", example = "15234567")
        private Long volume;

        @Schema(description = "전일 대비 등락액", example = "1500")
        private Long changeAmount;

        @Schema(description = "전일 대비 등락률 (%)", example = "2.08")
        private Double changeRate;
    }
}
