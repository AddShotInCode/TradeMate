package com.trademate.backend.simulation.domain;

import com.trademate.backend.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "training_sessions")
public class TrainingSession extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "stock_code", nullable = false)
    private String stockCode;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    // ★ 핵심: 현재 가상 시간 (이 시간 이후의 데이터는 블라인드 처리)
    @Column(name = "current_virtual_time", nullable = false)
    private LocalDateTime currentVirtualTime;

    @Column(name = "initial_balance", nullable = false)
    private BigDecimal initialBalance;

    @Column(name = "current_balance", nullable = false)
    private BigDecimal currentBalance;

    // [Step 8 추가] 현재 보유 수량 (기본값 0)
    @Column(name = "holding_quantity", nullable = false)
    private Integer holdingQuantity = 0;

    // [Step 8 추가] 평균 매수가 (수익률 계산용, 기본값 0)
    @Column(name = "average_price")
    private BigDecimal averagePrice = BigDecimal.ZERO;

    // 매매 원칙/설정 (JSON 호환 문자열로 저장)
    @Column(name = "rules_config", columnDefinition = "TEXT")
    private String rulesConfig;

    @Column(name = "is_finished", nullable = false)
    private boolean isFinished;

    @Builder
    public TrainingSession(Long userId, String stockCode, LocalDateTime startDate, LocalDateTime endDate, BigDecimal initialBalance, String rulesConfig) {
        this.userId = userId;
        this.stockCode = stockCode;
        this.startDate = startDate;
        this.endDate = endDate;
        this.initialBalance = initialBalance;
        this.currentBalance = initialBalance; // 시작 잔고 = 초기 자본금
        this.currentVirtualTime = startDate;  // 가상 시간 초기화 = 시작일
        this.rulesConfig = rulesConfig;
        this.isFinished = false;
        this.holdingQuantity = 0;
        this.averagePrice = BigDecimal.ZERO;
    }

    // --- [Step 7] 타임머신 로직 ---

    // 시간 흐름 (다음 캔들로 이동)
    public void advanceTime(LocalDateTime nextTime) {
        // 종료일보다 더 미래로 가려하면 종료 처리
        if (nextTime.isAfter(this.endDate)) {
            this.isFinished = true;
        }
        this.currentVirtualTime = nextTime;
    }

    // 강제 종료 메서드
    public void finishSimulation() {
        this.isFinished = true;
    }

    // --- [Step 8] 주문 체결 비즈니스 로직 ---

    // 1. 매수 처리
    public void buy(BigDecimal price, int quantity, BigDecimal totalCost) {
        if (this.currentBalance.compareTo(totalCost) < 0) {
            throw new IllegalStateException("예수금이 부족합니다.");
        }

        // 평단가 갱신 로직: ((기존수량 * 기존평단) + (신규수량 * 신규단가)) / 전체수량
        BigDecimal currentTotalValue = this.averagePrice.multiply(BigDecimal.valueOf(this.holdingQuantity));
        BigDecimal newTotalValue = price.multiply(BigDecimal.valueOf(quantity));

        int newQuantity = this.holdingQuantity + quantity;

        // 평단가 계산 (소수점 4자리 반올림)
        if (newQuantity > 0) {
            this.averagePrice = currentTotalValue.add(newTotalValue)
                    .divide(BigDecimal.valueOf(newQuantity), 4, java.math.RoundingMode.HALF_UP);
        }

        this.holdingQuantity = newQuantity;
        this.currentBalance = this.currentBalance.subtract(totalCost);
    }

    // 2. 매도 처리
    public void sell(BigDecimal price, int quantity, BigDecimal totalRevenue) {
        if (this.holdingQuantity < quantity) {
            throw new IllegalStateException("매도 가능한 수량이 부족합니다.");
        }

        this.holdingQuantity -= quantity;
        this.currentBalance = this.currentBalance.add(totalRevenue);

        // 전량 매도 시 평단가 0으로 초기화
        if (this.holdingQuantity == 0) {
            this.averagePrice = BigDecimal.ZERO;
        }
    }
}