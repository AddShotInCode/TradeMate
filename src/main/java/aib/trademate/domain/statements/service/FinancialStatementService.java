package aib.trademate.domain.statements.service;

import aib.trademate.domain.statements.client.FinancialStatementApiClient;
import aib.trademate.domain.statements.dto.FinancialStatementApiDto;
import aib.trademate.domain.statements.entity.FinancialStatement;
import aib.trademate.domain.statements.repository.FinancialStatementRepository;
import aib.trademate.global.exception.NotFoundEntityException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FinancialStatementService {

    private final FinancialStatementApiClient financialStatementApiClient;
    private final FinancialStatementRepository financialStatementRepository;

    // Hard-coded mapping for company names to corporate registration numbers
    private static final Map<String, String> COMPANY_TO_CRNO_MAP = new HashMap<>();
    static {
        // Example mappings (User needs to provide actual data for this)
        COMPANY_TO_CRNO_MAP.put("삼성전자", "1746110000741"); // Example CRNO
        COMPANY_TO_CRNO_MAP.put("카카오", "1348110007788"); // Example CRNO
        COMPANY_TO_CRNO_MAP.put("네이버", "1101110034685"); // Example CRNO
    }

    /**
     * Fetches financial statements for a given company name and business year from the external API,
     * saves them to the database, and returns the saved statements.
     *
     * @param companyName The name of the company (e.g., "삼성전자").
     * @param bizYear The business year for which to fetch data (e.g., "2019").
     * @return A list of FinancialStatement entities that were saved.
     */
    @Transactional
    public List<FinancialStatement> getAndSaveFinancialStatements(String companyName, String bizYear) {
        String crno = COMPANY_TO_CRNO_MAP.get(companyName);
        if (crno == null) {
            throw new NotFoundEntityException("Corporate registration number not found for company: " + companyName);
        }

        // Check if data for the given crno and bizYear already exists to avoid redundant API calls or data duplication
        // For simplicity, we are fetching and saving. A more robust solution might check existence first.

        FinancialStatementApiDto apiResponse = financialStatementApiClient.getFinancialStatements(crno, bizYear);

        if (apiResponse == null || apiResponse.getResponse() == null || apiResponse.getResponse().getBody() == null ||
            apiResponse.getResponse().getBody().getItems() == null || apiResponse.getResponse().getBody().getItems().getItem() == null ||
            apiResponse.getResponse().getBody().getItems().getItem().isEmpty()) {
            log.warn("No financial statement data received from API for company: {}, bizYear: {}", companyName, bizYear);
            return List.of(); // Return an empty list if no data is found
        }

        List<FinancialStatementApiDto.Item> apiItems = apiResponse.getResponse().getBody().getItems().getItem();

        List<FinancialStatement> financialStatements = apiItems.stream()
                .map(item -> FinancialStatement.builder()
                        .basDt(item.getBasDt())
                        .bizYear(item.getBizYear())
                        .crno(item.getCrno())
                        .curCd(item.getCurCd())
                        .fnclDcd(item.getFnclDcd())
                        .fnclDcdNm(item.getFnclDcdNm())
                        .enpSaleAmt(item.getEnpSaleAmt())
                        .enpBzopPft(item.getEnpBzopPft())
                        .enpCrtmNpf(item.getEnpCrtmNpf())
                        .enpTastAmt(item.getEnpTastAmt())
                        .enpTdbtAmt(item.getEnpTdbtAmt())
                        .enpTcptAmt(item.getEnpTcptAmt())
                        .fnclDebtRto(item.getFnclDebtRto())
                        .build())
                .collect(Collectors.toList());

        // Save all fetched financial statements
        return financialStatementRepository.saveAll(financialStatements);
    }

    /**
     * Retrieves financial statements for a given company name.
     * This method assumes data is already in the database.
     *
     * @param companyName The name of the company.
     * @return A list of FinancialStatement entities.
     */
    @Transactional(readOnly = true)
    public List<FinancialStatement> getFinancialStatementsFromDb(String companyName) {
        String crno = COMPANY_TO_CRNO_MAP.get(companyName);
        if (crno == null) {
            throw new NotFoundEntityException("Corporate registration number not found for company: " + companyName);
        }
        return financialStatementRepository.findByCrno(crno);
    }

    /**
     * Retrieves financial statements for a specific company and business year from the database.
     *
     * @param companyName The name of the company.
     * @param bizYear The business year.
     * @return An Optional containing the FinancialStatement entity, or empty if not found.
     */
    @Transactional(readOnly = true)
    public Optional<FinancialStatement> getFinancialStatementFromDbByYear(String companyName, String bizYear) {
        String crno = COMPANY_TO_CRNO_MAP.get(companyName);
        if (crno == null) {
            throw new NotFoundEntityException("Corporate registration number not found for company: " + companyName);
        }
        return financialStatementRepository.findByCrnoAndBizYear(crno, bizYear);
    }
}
