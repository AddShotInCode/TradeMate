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

@Slf4j
@Component
@RequiredArgsConstructor
public class StockOpenApiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper; // Spring이 자동으로 주입해줍니다.

    // application.yml에서 값을 가져옴
    @Value("${open-api.service-key}")
    private String serviceKey;

    @Value("${open-api.url}")
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
            URI uri = UriComponentsBuilder.fromHttpUrl(apiUrl)
                    .queryParam("serviceKey", serviceKey)
                    .queryParam("numOfRows", 1000) // 넉넉하게 1년치(약 250~365일) 조회
                    .queryParam("pageNo", 1)
                    .queryParam("resultType", "json") // JSON 형식 요청 
                    .queryParam("likeSrtnCd", stockCode) // 종목코드 검색 
                    .queryParam("beginBasDt", startDate) // 시작일 
                    .queryParam("endBasDt", endDate)     // 종료일 
                    .build(true) // true: 인코딩 된 serviceKey를 그대로 사용하기 위함
                    .toUri();

            log.info("Request OpenAPI: stockCode={}, period={}~{}", stockCode, startDate, endDate);
            log.info("요청 URL: {}", uri);

            // [변경점 1] 응답을 일단 String(문자열)으로 받습니다.
            String responseString = restTemplate.getForObject(uri, String.class);

            // [변경점 2] 로그에 응답 내용을 그대로 찍습니다. (여기를 확인하세요!)
            log.info("================ API 응답 시작 ================");
            log.info(responseString);
            log.info("================ API 응답 끝 ================");

            // [변경점 3] 문자열을 DTO로 수동 변환 (파싱 실패 시 catch로 이동)
            if (responseString != null) {
                StockApiDto.Response response = objectMapper.readValue(responseString, StockApiDto.Response.class);
                
                if (response != null 
                        && response.getResponse() != null 
                        && response.getResponse().getBody() != null 
                        && response.getResponse().getBody().getItems() != null
                        && response.getResponse().getBody().getItems().getItem() != null) {
                    List<StockApiDto.Item> items = response.getResponse().getBody().getItems().getItem();
                    log.info("Fetched {} items for stock {}", items.size(), stockCode);
                    return items;
                }
            }

            // // API 호출
            // StockApiDto.Response response = restTemplate.getForObject(uri, StockApiDto.Response.class);

            // // 결과 검증 및 반환
            // if (response != null && response.getBody() != null && response.getBody().getItems() != null) {
            //     List<StockApiDto.Item> items = response.getBody().getItems().getItem();
            //     log.info("Fetched {} items for stock {}", items.size(), stockCode);
            //     return items;
            // }

        } catch (Exception e) {
            log.error("OpenAPI 호출 실패: {}", e.getMessage(), e);
        }

        return Collections.emptyList();
    }
}