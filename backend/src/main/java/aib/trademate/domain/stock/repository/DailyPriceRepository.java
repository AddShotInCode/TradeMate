package aib.trademate.domain.stock.repository;

import aib.trademate.domain.stock.entity.DailyPrice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface DailyPriceRepository extends JpaRepository<DailyPrice, Long> {
    
    // 1년 지난 데이터 삭제 (벌크 연산)
    @Modifying(clearAutomatically = true)
    @Query("DELETE FROM DailyPrice d WHERE d.date < :date")
    void deleteByDateBefore(@Param("date") LocalDate date);

    // 특정 종목의 기간별 가격 데이터 조회 (페이징, 날짜 오름차순)
    Page<DailyPrice> findByStockCodeAndDateBetweenOrderByDateAsc(
            String stockCode,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    );
}