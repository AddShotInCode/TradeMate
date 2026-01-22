package aib.trademate.domain.statement.client;

import aib.trademate.domain.statement.config.DartProperties;
import aib.trademate.domain.statement.dto.DartApiDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Slf4j
@Component
@RequiredArgsConstructor
public class DartOpenApiClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final DartProperties dartProperties;

    private static final int PAGE_COUNT = 100;  // 페이지당 조회 건수 (최대 100)

    /**
     * 특정 기업의 정기보고서 목록 조회
     * 
     * @param corpCode  기업 고유번호 (8자리)
     * @param startDate 검색 시작일 (yyyyMMdd)
     * @param endDate   검색 종료일 (yyyyMMdd)
     * @return 공시 목록
     */
    public List<DartApiDto.DisclosureItem> getDisclosureList(String corpCode, String startDate, String endDate) {
        List<DartApiDto.DisclosureItem> allItems = new ArrayList<>();

        try {
            int pageNo = 1;
            int totalPage = 1;

            do {
                URI uri = UriComponentsBuilder.fromUriString(Objects.requireNonNull(dartProperties.getUrl()))
                        .path("/list.json")
                        .queryParam("crtfc_key", dartProperties.getApiKey())
                        .queryParam("corp_code", corpCode)
                        .queryParam("bgn_de", startDate)
                        .queryParam("end_de", endDate)
                        .queryParam("pblntf_ty", "A")  // 정기공시
                        .queryParam("page_no", pageNo)
                        .queryParam("page_count", PAGE_COUNT)
                        .build()
                        .toUri();

                log.trace("[DART API] Request: corpCode={}, period={}~{}, page={}", 
                        corpCode, startDate, endDate, pageNo);

                String responseString = restTemplate.getForObject(uri, String.class);
                log.trace("[DART API] Raw response: {}", responseString);

                if (responseString != null) {
                    DartApiDto.DisclosureResponse response = objectMapper.readValue(
                            responseString, DartApiDto.DisclosureResponse.class);

                    // 상태 체크 (000: 정상, 013: 조회된 데이터 없음)
                    if (!"000".equals(response.getStatus())) {
                        if ("013".equals(response.getStatus())) {
                            log.debug("[DART API] No data for corpCode={}", corpCode);
                        } else {
                            log.warn("[DART API] Error response: status={}, message={}", 
                                    response.getStatus(), response.getMessage());
                        }
                        break;
                    }

                    if (response.getList() != null) {
                        allItems.addAll(response.getList());
                    }

                    totalPage = response.getTotalPage() != null ? response.getTotalPage() : 1;
                    pageNo++;
                }
            } while (pageNo <= totalPage);

            log.debug("[DART API] Response: corpCode={}, {} items received", corpCode, allItems.size());

        } catch (Exception e) {
            log.error("[DART API] Request failed: corpCode={}, error={}", corpCode, e.getMessage());
        }

        return allItems.isEmpty() ? Collections.emptyList() : allItems;
    }

    /**
     * 특정 월의 정기보고서 목록 조회 (월별 업데이트용)
     * 
     * @param corpCode 기업 고유번호
     * @param year     연도
     * @param month    월 (1~12)
     * @return 해당 월의 공시 목록
     */
    public List<DartApiDto.DisclosureItem> getDisclosureListByMonth(String corpCode, int year, int month) {
        // 해당 월의 시작일과 종료일 계산
        String startDate = String.format("%04d%02d01", year, month);
        String endDate;
        
        // 월의 마지막 날 계산
        int lastDay = switch (month) {
            case 2 -> (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) ? 29 : 28;
            case 4, 6, 9, 11 -> 30;
            default -> 31;
        };
        endDate = String.format("%04d%02d%02d", year, month, lastDay);

        return getDisclosureList(corpCode, startDate, endDate);
    }
}
