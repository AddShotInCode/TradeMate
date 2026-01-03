package com.trademate.backend.simulation.dto;

import java.math.BigDecimal;

public record SimulationStatusResponseDto(
        Long sessionId,
        BigDecimal initialBalance,  // 초기 자본
        BigDecimal currentBalance,  // 현재 예수금
        Integer holdingQuantity,    // 보유 수량
        BigDecimal averagePrice,    // 평단가
        BigDecimal currentPrice,    // 현재가 (현재 시점 종가)
        BigDecimal valuationAmount, // 평가금 (수량 * 현재가)
        BigDecimal totalAsset,      // 총 자산 (예수금 + 평가금)
        BigDecimal totalProfit,     // 총 손익
        BigDecimal returnRate       // 수익률 (%)
) {}