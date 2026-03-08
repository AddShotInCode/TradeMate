package aib.trademate.domain.simulation.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Gemini API 설정 프로퍼티
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "gemini-api")
public class GeminiProperties {

    /**
     * Gemini API 기본 URL
     */
    private String url;

    /**
     * Gemini API 인증키
     */
    private String apiKey;

    /**
     * 사용할 Gemini 모델명
     */
    private String model;
}
