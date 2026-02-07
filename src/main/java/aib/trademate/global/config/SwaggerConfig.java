package aib.trademate.global.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * Swagger (SpringDoc OpenAPI) 설정
 * Swagger UI: http://localhost:8080/swagger-ui.html
 * OpenAPI JSON: http://localhost:8080/v3/api-docs
 */
@Configuration
public class SwaggerConfig {

    private static final String SECURITY_SCHEME_NAME = "JWT Cookie Authentication";

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development")
                ))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, securityScheme()))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME));
    }

    private Info apiInfo() {
        return new Info()
                .title("TradeMate API")
                .description("주식 거래 시뮬레이션 플랫폼 API 문서\n\n"
                        + "## 인증 방식\n"
                        + "- 로그인 시 **HttpOnly 쿠키**로 JWT 토큰이 자동 설정됩니다.\n"
                        + "- `accessToken`, `refreshToken` 쿠키가 요청에 자동 포함됩니다.\n"
                        + "- Swagger UI에서 테스트 시 **Authorize** 버튼으로 Bearer 토큰을 직접 입력할 수 있습니다.\n\n"
                        + "## 에러 응답\n"
                        + "모든 에러는 `ErrorResponse` 형식으로 반환됩니다.")
                .version("1.0.0")
                .contact(new Contact()
                        .name("AddShotInCode - TradeMate")
                        .url("https://github.com/orgs/AddShotInCode/repositories"));
    }

    private SecurityScheme securityScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .scheme("bearer")
                .bearerFormat("JWT")
                .description("JWT Access Token을 입력하세요. (쿠키 인증 시에는 별도 입력 불필요)");
    }
}
