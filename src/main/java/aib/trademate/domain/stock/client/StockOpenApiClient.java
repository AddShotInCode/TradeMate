package aib.trademate.domain.stock.client;

import aib.trademate.domain.stock.dto.StockApiDto;
import com.fasterxml.jackson.databind.ObjectMapper; // JSON 변환기
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Slf4j
@Component
@RequiredArgsConstructor
public class StockOpenApiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper; // Spring이 자동으로 주입해줍니다.

    // application.yml에서 값을 가져옴
    @Value("${stock-api.service-key}")
    private String serviceKey;

    @Value("${stock-api.url}")
    private String apiUrl;

    /**
     * 특정 종목의 기간별 시세 데이터 조회
     * @param stockCode 종목코드 (예: 005930)
     * @param startDate 시작일 (예: 20240101)
     * @param endDate 종료일 (예: 20250101)
     * @return 시세 데이터 리스트
     */
    public List<StockApiDto.Item> getStockHistory(String stockCode, String startDate, String endDate) {
        try {
            // URL 생성 (인코딩 주의: serviceKey는 이미 인코딩된 상태로 yml에 넣을 예정)
            URI uri = UriComponentsBuilder.fromUriString(Objects.requireNonNull(apiUrl))
                    .queryParam("serviceKey", serviceKey)
                    .queryParam("numOfRows", 1000) // 넉넉하게 1년치(약 250~365일) 조회
                    .queryParam("pageNo", 1)
                    .queryParam("resultType", "json") // JSON 형식 요청 
                    .queryParam("likeSrtnCd", stockCode) // 종목코드 검색 
                    .queryParam("beginBasDt", startDate) // 시작일 
                    .queryParam("endBasDt", endDate)     // 종료일 
                    .build(true) // true: 인코딩 된 serviceKey를 그대로 사용하기 위함
                    .toUri();

            // [변경점 1] 응답을 일단 String(문자열)으로 받습니다.
            String responseString = restTemplate.getForObject(uri, String.class);

            // [변경점 2] 로그에 응답 내용을 그대로 찍습니다. (TRACE 레벨 - 필요시 확인)
            log.trace("[OpenAPI] Request: stock={}, period={}~{}", stockCode, startDate, endDate);
            log.trace("[OpenAPI] Raw response: {}", responseString);

            // [변경점 3] 문자열을 DTO로 수동 변환 (파싱 실패 시 catch로 이동)
            if (responseString != null) {
                StockApiDto.Response response = objectMapper.readValue(responseString, StockApiDto.Response.class);
                
                if (response != null 
                        && response.getResponse() != null 
                        && response.getResponse().getBody() != null 
                        && response.getResponse().getBody().getItems() != null
                        && response.getResponse().getBody().getItems().getItem() != null) {
                    List<StockApiDto.Item> items = response.getResponse().getBody().getItems().getItem();
                    log.trace("[OpenAPI] Response: stock={}, {} items received", stockCode, items.size());
                    return items;
                }
            }

            log.trace("[OpenAPI] Response: stock={}, no data", stockCode);

        } catch (Exception e) {
            log.error("[OpenAPI] Request failed: stock={}, error={}", stockCode, e.getMessage());
        }

        return Collections.emptyList();
    }
}