package com.trademate.backend.report.service;

import com.trademate.backend.candle.domain.Candle;
import com.trademate.backend.candle.dto.CandleResponseDto;
import com.trademate.backend.candle.repository.CandleRepository;
import com.trademate.backend.order.repository.OrderRepository;
import com.trademate.backend.report.dto.ReportResponseDto;
import com.trademate.backend.report.dto.ReportResponseDto.ReviewSummaryDto;
import com.trademate.backend.report.dto.ReportResponseDto.TradeMarkerDto;
import com.trademate.backend.review.domain.TradeReview;
import com.trademate.backend.review.repository.TradeReviewRepository;
import com.trademate.backend.simulation.domain.TrainingSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final TradeReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final CandleRepository candleRepository; // CandleLowService 대신 Repository 직접 사용

    public ReportResponseDto getReport(Long sessionId) {
        // 1. 리뷰 데이터 조회 (채점이 완료되지 않았으면 예외 발생)
        TradeReview review = reviewRepository.findByTrainingSessionId(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("아직 결과 리포트가 생성되지 않았습니다. 먼저 훈련을 종료해주세요."));

        TrainingSession session = review.getTrainingSession();

        // 2. 주문 내역 조회 (매매 마킹용)
        List<TradeMarkerDto> trades = orderRepository.findByTrainingSessionId(sessionId).stream()
                .map(TradeMarkerDto::from)
                .toList();

        // 3. 차트 데이터 조회 (시뮬레이션 전체 기간)
        List<Candle> candles = candleRepository.findAllByStockCodeAndDateTimeBetweenOrderByDateTimeAsc(
                session.getStockCode(),
                session.getStartDate(),
                session.getEndDate()
        );

        List<CandleResponseDto> chartData = candles.stream()
                .map(CandleResponseDto::from)
                .toList();

        // 4. DTO 조립 및 반환
        return ReportResponseDto.builder()
                .summary(ReviewSummaryDto.from(review))
                .trades(trades)
                .chart(chartData)
                .build();
    }
}