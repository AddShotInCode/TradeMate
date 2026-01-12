package aib.trademate.domain.stock.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

public class StockPriceResponseDto {

    @Getter
    @Builder
    public static class Response {
        private StockInfo stock;
        private Pagination pagination;
        private List<PriceItem> items;
    }

    @Getter
    @Builder
    public static class StockInfo {
        private String code;
        private String name;
        private String market;
    }

    @Getter
    @Builder
    public static class Pagination {
        private int page;
        private int pageSize;
        private long totalElements;
        private int totalPages;
    }

    @Getter
    @Builder
    public static class PriceItem {
        private LocalDate date;
        private Long open;
        private Long high;
        private Long low;
        private Long close;
        private Long volume;
        private Long changeAmount;
        private Double changeRate;
    }
}
