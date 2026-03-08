package aib.trademate.domain.statement.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "dart-api")
public class DartProperties {

    /**
     * DART OpenAPI 기본 URL
     */
    private String url;

    /**
     * DART OpenAPI 인증키
     */
    private String apiKey;
}
