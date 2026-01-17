package aib.trademate.domain.statements.controller;

import aib.trademate.domain.statements.dto.FinancialStatementResponseDto;
import aib.trademate.domain.statements.entity.FinancialStatement;
import aib.trademate.domain.statements.service.FinancialStatementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statements")
@RequiredArgsConstructor
public class FinancialStatementController {

    private final FinancialStatementService financialStatementService;

    /**
     * Fetches financial statements for a given company and business year from the external API
     * and saves them to the database.
     *
     * @param companyName The name of the company (e.g., "삼성전자").
     * @param bizYear The business year for which to fetch data (e.g., "2019").
     * @return A list of FinancialStatementResponseDto representing the saved statements.
     */
    @GetMapping("/fetch-and-save/{companyName}")
    public ResponseEntity<List<FinancialStatementResponseDto>> fetchAndSaveFinancialStatements(
            @PathVariable String companyName,
            @RequestParam String bizYear) {
        List<FinancialStatement> statements = financialStatementService.getAndSaveFinancialStatements(companyName, bizYear);
        List<FinancialStatementResponseDto> responseDtos = statements.stream()
                .map(FinancialStatementResponseDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDtos);
    }

    /**
     * Retrieves all financial statements for a given company from the database.
     *
     * @param companyName The name of the company.
     * @return A list of FinancialStatementResponseDto for the company.
     */
    @GetMapping("/{companyName}")
    public ResponseEntity<List<FinancialStatementResponseDto>> getFinancialStatementsByCompany(
            @PathVariable String companyName) {
        List<FinancialStatement> statements = financialStatementService.getFinancialStatementsFromDb(companyName);
        List<FinancialStatementResponseDto> responseDtos = statements.stream()
                .map(FinancialStatementResponseDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responseDtos);
    }

    /**
     * Retrieves a specific financial statement for a given company and business year from the database.
     *
     * @param companyName The name of the company.
     * @param bizYear The business year.
     * @return A FinancialStatementResponseDto for the specific statement.
     */
    @GetMapping("/{companyName}/{bizYear}")
    public ResponseEntity<FinancialStatementResponseDto> getFinancialStatementByCompanyAndYear(
            @PathVariable String companyName,
            @PathVariable String bizYear) {
        return financialStatementService.getFinancialStatementFromDbByYear(companyName, bizYear)
                .map(FinancialStatementResponseDto::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
