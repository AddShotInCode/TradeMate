package com.trademate.backend.order.service;

import com.trademate.backend.order.domain.Order;
import com.trademate.backend.order.dto.OrderRequestDto;
import com.trademate.backend.order.repository.OrderRepository;
import com.trademate.backend.simulation.domain.TrainingSession;
import com.trademate.backend.simulation.repository.TrainingSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final TrainingSessionRepository sessionRepository;

    @Transactional
    public Long placeOrder(OrderRequestDto request) {
        // 1. 세션 조회
        TrainingSession session = sessionRepository.findById(request.sessionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Session ID"));

        // 2. 가격 및 수량 계산
        BigDecimal totalAmount = request.price().multiply(BigDecimal.valueOf(request.quantity()));

        // 3. 매수/매도 로직 분기 (Session 엔티티의 상태 변경)
        switch (request.type()) {
            case BUY -> session.buy(request.price(), request.quantity(), totalAmount);
            case SELL -> session.sell(request.price(), request.quantity(), totalAmount);
        }

        // 4. 주문 기록 저장
        Order order = Order.builder()
                .trainingSession(session)
                .type(request.type())
                .price(request.price())
                .quantity(request.quantity())
                .reason(request.reason())
                .targetPrice(request.targetPrice())
                .stopLossPrice(request.stopLossPrice())
                .orderDate(session.getCurrentVirtualTime())
                .build();

        return orderRepository.save(order).getId();
    }
}