package com.trademate.backend.candle.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.trademate.backend.candle.domain.Candle;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import com.querydsl.core.types.Projections; // 추가
import com.trademate.backend.candle.dto.PriceRangeDto; // 추가

import static com.trademate.backend.candle.domain.QCandle.candle;

@RequiredArgsConstructor
public class CandleRepositoryImpl implements CandleRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Candle> getCandles(String stockCode, LocalDateTime startDate, LocalDateTime endDate) {
        return queryFactory
                .selectFrom(candle)
                .where(
                        stockCodeEq(stockCode),
                        dateTimeBetween(startDate, endDate)
                )
                .orderBy(candle.dateTime.asc())
                .fetch();
    }

    // [추가 구현] 타임머신 로직
    @Override
    public List<Candle> findNextCandles(String stockCode, LocalDateTime startTime, int count) {
        return queryFactory
                .selectFrom(candle)
                .where(
                        stockCodeEq(stockCode),
                        candle.dateTime.gt(startTime) // gt: greater than (현재 시간 '초과' 데이터)
                )
                .orderBy(candle.dateTime.asc()) // 과거 -> 미래 순서
                .limit(count) // 요청한 개수만큼만 가져옴 (1개, 10개 등)
                .fetch();
    }

    private BooleanExpression stockCodeEq(String stockCode) {
        return stockCode != null ? candle.stockCode.eq(stockCode) : null;
    }

    private BooleanExpression dateTimeBetween(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate == null || endDate == null) {
            return null;
        }
        return candle.dateTime.between(startDate, endDate);
    }

    @Override
    public PriceRangeDto findMinMaxPrice(String stockCode, LocalDateTime startTime, LocalDateTime endTime) {
        return queryFactory
                .select(Projections.constructor(PriceRangeDto.class,
                        candle.low.min(),  // 기간 내 최저가
                        candle.high.max()  // 기간 내 최고가
                ))
                .from(candle)
                .where(
                        stockCodeEq(stockCode),
                        candle.dateTime.between(startTime, endTime) // dateTimeBetween 메서드 재사용 가능하면 사용
                )
                .fetchOne();
    }
}