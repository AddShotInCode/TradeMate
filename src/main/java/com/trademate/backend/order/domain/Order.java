package com.trademate.backend.order.domain;

import com.trademate.backend.global.common.BaseTimeEntity;
import com.trademate.backend.simulation.domain.TrainingSession;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime; // Import 필수

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "orders")
public class Order extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private TrainingSession trainingSession;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderType type;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "target_price")
    private BigDecimal targetPrice;

    @Column(name = "stop_loss_price")
    private BigDecimal stopLossPrice;

    // ★ [신규 추가] 시뮬레이션 상의 체결 시간 (NOT NULL)
    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @Builder
    public Order(TrainingSession trainingSession, OrderType type, BigDecimal price, Integer quantity, String reason, BigDecimal targetPrice, BigDecimal stopLossPrice, LocalDateTime orderDate) {
        this.trainingSession = trainingSession;
        this.type = type;
        this.price = price;
        this.quantity = quantity;
        this.reason = reason;
        this.targetPrice = targetPrice;
        this.stopLossPrice = stopLossPrice;
        this.orderDate = orderDate; // Builder에도 추가
    }
}