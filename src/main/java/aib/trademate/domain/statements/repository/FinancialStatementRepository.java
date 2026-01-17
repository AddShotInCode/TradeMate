package aib.trademate.domain.statements.repository;

import aib.trademate.domain.statements.entity.FinancialStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FinancialStatementRepository extends JpaRepository<FinancialStatement, Long> {
    // Optional: Find financial statements by corporate registration number and business year
    Optional<FinancialStatement> findByCrnoAndBizYear(String crno, String bizYear);

    // Optional: Find all financial statements for a given corporate registration number
    List<FinancialStatement> findByCrno(String crno);
}
