package aib.trademate.domain.simulation.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

/**
 * Gemini API 전용 RestTemplate 설정
 *
 * LLM 응답 특성상 기본 RestTemplate보다 긴 타임아웃을 적용합니다.
 */
@Configuration
public class GeminiRestTemplateConfig {

    @Bean("geminiRestTemplate")
    public RestTemplate geminiRestTemplate(RestTemplateBuilder builder) {
        return builder
                .connectTimeout(Duration.ofSeconds(5))
                .readTimeout(Duration.ofSeconds(60))
                .build();
    }
}
