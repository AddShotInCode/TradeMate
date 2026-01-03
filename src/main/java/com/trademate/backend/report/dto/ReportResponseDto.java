package com.trademate.backend.report.dto;

import com.trademate.backend.candle.dto.CandleResponseDto;
import com.trademate.backend.order.domain.Order;
import com.trademate.backend.order.domain.OrderType;
import com.trademate.backend.review.domain.TradeReview;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReportResponseDto {
    private ReviewSummaryDto summary;       // 1. 성적표
    private List<TradeMarkerDto> trades;    // 2. 매매 마킹 (차트 위 B/S 표시용)
    private List<CandleResponseDto> chart;  // 3. 전체 차트 데이터

    // 내부 DTO: 성적표 요약
    @Getter
    @Builder
    public static class ReviewSummaryDto {
        private int finalScore;
        private double profitRate;
        private int complianceRate;
        private String feedbackMessage;

        public static ReviewSummaryDto from(TradeReview review) {
            return ReviewSummaryDto.builder()
                    .finalScore(review.getFinalScore())
                    .profitRate(review.getProfitRate())
                    .complianceRate(review.getComplianceRate())
                    .feedbackMessage(review.getFeedbackMessage())
                    .build();
        }
    }

    // 내부 DTO: 매매 마킹
    @Getter
    @Builder
    public static class TradeMarkerDto {
        private Long orderId;
        private OrderType type;
        private LocalDateTime orderDate; // 가상 체결 시간 (X축 좌표)
        private BigDecimal price;        // 체결 가격 (Y축 좌표)
        private Integer quantity;
        private String reason;           // 진입/청산 근거

        public static TradeMarkerDto from(Order order) {
            return TradeMarkerDto.builder()
                    .orderId(order.getId())
                    .type(order.getType())
                    .orderDate(order.getOrderDate())
                    .price(order.getPrice())
                    .quantity(order.getQuantity())
                    .reason(order.getReason())
                    .build();
        }
    }
}