package com.trademate.backend.candle.repository;

import com.trademate.backend.candle.domain.Candle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional; // 추가
import java.util.List;

public interface CandleRepository extends JpaRepository<Candle, Long>, CandleRepositoryCustom {
    boolean existsByStockCodeAndDateTime(String stockCode, LocalDateTime dateTime);

    // [추가] 특정 날짜의 캔들 조회 (현재가 확인용)
    Optional<Candle> findByStockCodeAndDateTime(String stockCode, LocalDateTime dateTime);
    List<Candle> findAllByStockCodeAndDateTimeBetweenOrderByDateTimeAsc(String stockCode, LocalDateTime startDate, LocalDateTime endDate);
}