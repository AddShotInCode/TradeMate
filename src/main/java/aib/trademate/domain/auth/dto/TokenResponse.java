package aib.trademate.domain.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 토큰 응답 DTO
 */
@Schema(description = "토큰 응답 (내부 사용, 쿠키로 전달)")
public record TokenResponse(
        @Schema(description = "Access Token", hidden = true)
        String accessToken,

        @Schema(description = "Refresh Token", hidden = true)
        String refreshToken,

        @Schema(description = "토큰 타입", example = "Bearer")
        String tokenType,

        @Schema(description = "토큰 만료 시간 (ms)", example = "1800000")
        long expiresIn
) {
    public TokenResponse(String accessToken, String refreshToken, long expiresIn) {
        this(accessToken, refreshToken, "Bearer", expiresIn);
    }
}
