package com.trademate.backend.candle.infrastructure;

import com.trademate.backend.candle.dto.kis.KisAccessTokenResponseDto;
import com.trademate.backend.candle.dto.kis.KisDailyPriceResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class KisApiClient {

    private final WebClient.Builder webClientBuilder;

    @Value("${api.kis.base-url}")
    private String baseUrl;

    @Value("${api.kis.app-key}")
    private String appKey;

    @Value("${api.kis.app-secret}")
    private String appSecret;

    // 1. 토큰 발급 메서드
    public String getAccessToken() {
        Map<String, String> body = new HashMap<>();
        body.put("grant_type", "client_credentials");
        body.put("appkey", appKey);
        body.put("appsecret", appSecret);

        try {
            KisAccessTokenResponseDto response = webClientBuilder.baseUrl(baseUrl)
                    .build()
                    .post()
                    .uri("/oauth2/tokenP")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(KisAccessTokenResponseDto.class)
                    .block(); // 동기식 처리 (토큰 없으면 진행 불가하므로)

            if (response == null || response.accessToken() == null) {
                throw new RuntimeException("KIS Access Token 발급 실패");
            }
            log.info("KIS Access Token 발급 성공");
            return "Bearer " + response.accessToken();

        } catch (Exception e) {
            log.error("토큰 발급 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    // 2. 기간별 시세 데이터 조회 메서드
    public KisDailyPriceResponseDto getDailyPrices(String stockCode, String startDate, String endDate, String token) {
        // API 문서: 국내주식기간별시세(일/주/월/년)
        return webClientBuilder.baseUrl(baseUrl)
                .build()
                .get()
                .uri(uriBuilder -> uriBuilder
                        .path("/uapi/domestic-stock/v1/quotations/inquire-daily-itemchartprice")
                        .queryParam("FID_COND_MRKT_DIV_CODE", "J") // J: 주식
                        .queryParam("FID_INPUT_ISCD", stockCode)   // 종목코드
                        .queryParam("FID_INPUT_DATE_1", startDate) // 시작일 (YYYYMMDD)
                        .queryParam("FID_INPUT_DATE_2", endDate)   // 종료일
                        .queryParam("FID_PERIOD_DIV_CODE", "D")    // D: 일봉
                        .queryParam("FID_ORG_ADJ_PRC", "1")        // 1: 수정주가 반영
                        .build())
                .header("content-type", "application/json; charset=utf-8")
                .header("authorization", token)
                .header("appkey", appKey)
                .header("appsecret", appSecret)
                .header("tr_id", "FHKST03010100") // 거래 ID (모의투자/실전 다를 수 있음. FHKST03010100은 주식기간별시세 공통)
                .retrieve()
                .bodyToMono(KisDailyPriceResponseDto.class)
                .block();
    }
}