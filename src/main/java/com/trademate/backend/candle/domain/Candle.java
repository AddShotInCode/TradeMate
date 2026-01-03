package com.trademate.backend.candle.domain;

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
@Table(
        name = "candles",
        indexes = {
                // 명세 2.2: 조회 성능 최적화를 위한 복합 인덱스 (종목코드 + 시간)
                @Index(name = "idx_stock_time", columnList = "stock_code, date_time")
        },
        uniqueConstraints = {
                // 데이터 무결성 보장: 같은 종목의 같은 시간 데이터는 중복될 수 없음
                @UniqueConstraint(name = "uk_stock_time", columnNames = {"stock_code", "date_time"})
        }
)
public class Candle extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stock_code", nullable = false, length = 20)
    private String stockCode;

    @Column(name = "date_time", nullable = false)
    private LocalDateTime dateTime;

    // 가격 정보: 소수점 처리를 위해 BigDecimal 사용 (전체 19자리, 소수점 4자리)
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal open;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal high;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal low;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal close;

    @Column(nullable = false)
    private Long volume;

    @Builder
    public Candle(String stockCode, LocalDateTime dateTime, BigDecimal open, BigDecimal high, BigDecimal low, BigDecimal close, Long volume) {
        this.stockCode = stockCode;
        this.dateTime = dateTime;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
    }
}