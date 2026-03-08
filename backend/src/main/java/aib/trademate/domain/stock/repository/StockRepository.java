package aib.trademate.domain.stock.repository;

import aib.trademate.domain.stock.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {
    // 코드로 종목 찾기 (Optional 반환 준수)
    Optional<Stock> findByCode(String code);
}