package aib.trademate.domain.simulation.client;

import aib.trademate.domain.simulation.config.GeminiProperties;
import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Objects;

/**
 * Gemini API 클라이언트
 *
 * Gemini REST API를 호출하여 AI 분석 결과를 받아옵니다.
 * 호출 실패 시 null을 반환하여 보고서 생성에 영향을 주지 않습니다.
 */
@Slf4j
@Component
public class GeminiApiClient {

    private final RestTemplate geminiRestTemplate;
    private final ObjectMapper objectMapper;
    private final GeminiProperties geminiProperties;

    public GeminiApiClient(
            @Qualifier("geminiRestTemplate") RestTemplate geminiRestTemplate,
            ObjectMapper objectMapper,
            GeminiProperties geminiProperties
    ) {
        this.geminiRestTemplate = geminiRestTemplate;
        this.objectMapper = objectMapper;
        this.geminiProperties = geminiProperties;
    }

    /**
     * Gemini API를 호출하여 AI 분석 결과를 반환합니다.
     *
     * @param prompt 분석용 프롬프트 전체 문자열
     * @return 분석 결과 (score, comment). 실패 시 null 반환
     */
    public GeminiAnalysisResult analyze(String prompt) {
        if (geminiProperties.getApiKey() == null || geminiProperties.getApiKey().isBlank()) {
            log.warn("[Gemini API] API key is not configured. Skipping AI analysis.");
            return null;
        }

        String url = geminiProperties.getUrl();
        if (url == null || url.isBlank()) {
            log.warn("[Gemini API] URL is not configured. Skipping AI analysis.");
            return null;
        }

        try {
            URI uri = UriComponentsBuilder
                    .fromUriString(url)
                    .path("/v1beta/models/{model}:generateContent")
                    .buildAndExpand(geminiProperties.getModel())
                    .toUri();

            // 요청 바디 구성
            String requestBody = objectMapper.writeValueAsString(
                    new GeminiRequest(new GeminiRequest.Content[]{
                            new GeminiRequest.Content(new GeminiRequest.Part[]{
                                    new GeminiRequest.Part(prompt)
                            })
                    })
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiProperties.getApiKey());
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            log.debug("[Gemini API] Sending request to: {}", uri);
            log.debug("[Gemini API] Prompt:\n{}", prompt);

            ResponseEntity<String> response = geminiRestTemplate.exchange(
                    uri, Objects.requireNonNull(HttpMethod.POST), entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                log.debug("[Gemini API] Response body:\n{}", response.getBody());
                return parseResponse(response.getBody());
            }

            log.warn("[Gemini API] Unexpected response status: {}", response.getStatusCode());
            return null;

        } catch (Exception e) {
            log.error("[Gemini API] Request failed: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Gemini 응답에서 AI 분석 결과를 파싱합니다.
     * 응답 구조: candidates[0].content.parts[0].text → JSON 문자열
     */
    private GeminiAnalysisResult parseResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");

            if (candidates.isEmpty() || candidates.isMissingNode()) {
                log.warn("[Gemini API] No candidates in response");
                return null;
            }

            String text = candidates.get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            if (text == null || text.isBlank()) {
                log.warn("[Gemini API] Empty text in response");
                return null;
            }

            // LLM 응답에서 JSON 부분만 추출 (```json ... ``` 래핑 제거)
            String jsonText = extractJson(text);

            // LLM 응답 JSON에는 줄바꿈 등 제어 문자가 포함될 수 있으므로 허용 설정으로 파싱
            JsonNode analysisNode = objectMapper.reader()
                    .with(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS)
                    .readTree(jsonText);
            int score = analysisNode.path("score").asInt();
            String comment = analysisNode.path("comment").asText();

            // 점수 범위 검증
            if (score < 0 || score > 100) {
                log.warn("[Gemini API] Invalid score value: {}. Clamping to 0-100 range.", score);
                score = Math.max(0, Math.min(100, score));
            }

            log.info("[Gemini API] Analysis completed: score={}", score);
            return new GeminiAnalysisResult(score, comment);

        } catch (Exception e) {
            log.error("[Gemini API] Failed to parse response: {}", e.getMessage());
            return null;
        }
    }

    /**
     * LLM 응답 텍스트에서 JSON 문자열을 추출합니다.
     * ```json ... ``` 래핑이나 앞뒤 공백을 제거합니다.
     */
    private String extractJson(String text) {
        String trimmed = text.trim();
        // ```json ... ``` 또는 ``` ... ``` 래핑 제거
        if (trimmed.startsWith("```")) {
            int firstNewline = trimmed.indexOf('\n');
            int lastBacktick = trimmed.lastIndexOf("```");
            if (firstNewline != -1 && lastBacktick > firstNewline) {
                trimmed = trimmed.substring(firstNewline + 1, lastBacktick).trim();
            }
        }
        return trimmed;
    }

    // ========== 내부 DTO ==========

    /**
     * Gemini API 분석 결과
     */
    public record GeminiAnalysisResult(
            int score,
            String comment
    ) {}

    /**
     * Gemini API 요청 바디
     */
    private record GeminiRequest(Content[] contents) {
        record Content(Part[] parts) {}
        record Part(String text) {}
    }
}
