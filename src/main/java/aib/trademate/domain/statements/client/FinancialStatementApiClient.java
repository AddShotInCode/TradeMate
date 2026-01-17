package aib.trademate.domain.statements.client;

import aib.trademate.domain.statements.dto.FinancialStatementApiDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@Slf4j
@Component
@RequiredArgsConstructor
public class FinancialStatementApiClient {

    private final RestTemplate restTemplate;

    @Value("${financial-statement-api.base-url}")
    private String baseUrl;

    @Value("${financial-statement-api.service-key}")
    private String serviceKey;

    public FinancialStatementApiDto getFinancialStatements(String crno, String bizYear) {
        // Build the URI for the external API call
        URI uri = UriComponentsBuilder.fromUriString(baseUrl)
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", 1) // Assuming we only need one result per company per year
                .queryParam("pageNo", 1)
                .queryParam("resultType", "json")
                .queryParam("crno", crno)
                .queryParam("bizYear", bizYear)
                .build(true) // build(true) to encode parameters
                .toUri();

        log.info("Requesting financial statements from API: {}", uri);

        try {
            // Make the GET request and directly map the JSON response to FinancialStatementApiDto
            FinancialStatementApiDto response = restTemplate.getForObject(uri, FinancialStatementApiDto.class);
            if (response == null || response.getResponse() == null || response.getResponse().getBody() == null ||
                response.getResponse().getBody().getItems() == null || response.getResponse().getBody().getItems().getItem() == null ||
                response.getResponse().getBody().getItems().getItem().isEmpty()) {
                log.warn("No financial statement data found for crno: {}, bizYear: {}", crno, bizYear);
                return null; // Or throw a specific exception if no data is considered an error
            }
            return response;
        } catch (Exception e) {
            log.error("Error fetching financial statements for crno: {}, bizYear: {}. Error: {}", crno, bizYear, e.getMessage());
            // Depending on policy, rethrow a custom exception, return null, or a default object
            throw new RuntimeException("Failed to fetch financial statements from external API", e);
        }
    }
}
