package com.trademate.backend.order.repository;

import com.trademate.backend.order.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // [추가] 특정 세션의 모든 주문 조회
    List<Order> findByTrainingSessionId(Long sessionId);
}