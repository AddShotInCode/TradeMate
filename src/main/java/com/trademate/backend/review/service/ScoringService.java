package com.trademate.backend.review.service;

import com.trademate.backend.candle.dto.PriceRangeDto;
import com.trademate.backend.candle.service.CandleLowService;
import com.trademate.backend.global.error.NotFoundEntityException;
import com.trademate.backend.order.domain.Order;
import com.trademate.backend.order.domain.OrderType;
import com.trademate.backend.order.repository.OrderRepository;
import com.trademate.backend.review.domain.TradeReview;
import com.trademate.backend.review.repository.TradeReviewRepository;
import com.trademate.backend.simulation.domain.TrainingSession;
import com.trademate.backend.simulation.dto.SimulationStatusResponseDto;
import com.trademate.backend.simulation.repository.TrainingSessionRepository;
import com.trademate.backend.simulation.service.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScoringService {

    private final TrainingSessionRepository sessionRepository;
    private final OrderRepository orderRepository;
    private final TradeReviewRepository reviewRepository;
    private final SimulationService simulationService;
    private final CandleLowService candleLowService; // [주입]

    @Transactional
    public Long finishAndScore(Long sessionId) {
        // 1. 세션 조회
        TrainingSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new NotFoundEntityException("존재하지 않는 세션입니다. ID: " + sessionId));

        if (session.isFinished()) {
            throw new IllegalStateException("이미 종료된 훈련입니다.");
        }
        session.finishSimulation();

        // 2. 수익률 계산
        SimulationStatusResponseDto status = simulationService.getSessionStatus(sessionId);
        double profitRate = status.returnRate().doubleValue();

        // 3. 주문 내역 조회 및 원칙 점수 계산 (심화 로직 적용)
        List<Order> orders = orderRepository.findByTrainingSessionId(sessionId);
        int complianceScore = calculateCompliance(orders, session);

        // 4. 종합 점수 (수익률 40% + 원칙 60%)
        int profitScore = (int) Math.max(0, Math.min(100, 50 + profitRate));
        int finalScore = (int) (profitScore * 0.4 + complianceScore * 0.6);

        // 5. 저장
        TradeReview review = TradeReview.builder()
                .trainingSession(session)
                .profitRate(profitRate)
                .complianceRate(complianceScore)
                .finalScore(finalScore)
                .feedbackMessage(generateFeedback(finalScore))
                .build();

        return reviewRepository.save(review).getId();
    }

    // ★ 심화 검증 로직: Lucky Save(버티기) 감지
    private int calculateCompliance(List<Order> orders, TrainingSession session) {
        int totalBuyOrders = 0;
        int compliedOrders = 0;

        // 매수 주문만 필터링
        List<Order> buyOrders = orders.stream()
                .filter(o -> o.getType() == OrderType.BUY)
                .toList();

        for (Order buyOrder : buyOrders) {
            totalBuyOrders++;
            boolean isCompliant = true;

            // 1. 손절가 미설정 시 즉시 감점
            if (buyOrder.getStopLossPrice() == null) {
                continue;
            }

            // 2. 매도 시점 찾기 (가상 시간 orderDate 기준)
            LocalDateTime sellTime = findSellTimeForBuyOrder(buyOrder, orders, session.getCurrentVirtualTime());

            // 3. 보유 기간 최저가 조회 (DB Query)
            PriceRangeDto range = candleLowService.findMinMaxPrice(
                    session.getStockCode(),
                    buyOrder.getOrderDate(), // 진입 시점
                    sellTime                 // 청산 시점
            );

            // 데이터가 없으면 예외적으로 인정해주고 넘어감
            if (range == null || range.minLow() == null) {
                compliedOrders++;
                continue;
            }

            // 4. [검증] "버티기" 감지
            // "기간 내 최저가가 손절가를 뚫고 내려갔었는가?"
            if (range.minLow().compareTo(buyOrder.getStopLossPrice()) < 0) {
                // "그랬는데도 손절가보다 비싸게 팔았거나, 아직 안 팔았는가?"
                Order matchedSellOrder = findSellOrder(buyOrder, orders);

                if (matchedSellOrder == null || matchedSellOrder.getPrice().compareTo(buyOrder.getStopLossPrice()) > 0) {
                    isCompliant = false; // 걸렸다! 운으로 번 것임. (감점)
                }
            }

            if (isCompliant) {
                compliedOrders++;
            }
        }

        if (totalBuyOrders == 0) return 100; // 매매 없음 = 원칙 위반 없음
        return (int) ((double) compliedOrders / totalBuyOrders * 100);
    }

    // 헬퍼: 해당 매수 건 이후의 매도 시점 찾기
    private LocalDateTime findSellTimeForBuyOrder(Order buyOrder, List<Order> allOrders, LocalDateTime sessionEndTime) {
        return allOrders.stream()
                .filter(o -> o.getType() == OrderType.SELL)
                .filter(o -> o.getOrderDate().isAfter(buyOrder.getOrderDate()))
                .map(Order::getOrderDate)
                .findFirst()
                .orElse(sessionEndTime);
    }

    // 헬퍼: 매칭되는 매도 주문 객체 찾기
    private Order findSellOrder(Order buyOrder, List<Order> allOrders) {
        return allOrders.stream()
                .filter(o -> o.getType() == OrderType.SELL)
                .filter(o -> o.getOrderDate().isAfter(buyOrder.getOrderDate()))
                .findFirst()
                .orElse(null);
    }

    private String generateFeedback(int score) {
        if (score >= 90) return "전설적인 트레이더! 수익과 원칙 모두 완벽합니다.";
        if (score >= 70) return "훌륭합니다. 원칙을 잘 지키셨네요.";
        if (score >= 50) return "나쁘지 않습니다. 하지만 운에 기대지 마세요.";
        return "뇌동매매를 멈추고 원칙을 다시 세우세요. 깡통 찹니다.";
    }
}