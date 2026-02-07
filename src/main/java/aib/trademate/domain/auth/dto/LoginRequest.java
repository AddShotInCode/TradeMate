package aib.trademate.domain.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * 로그인 요청 DTO
 */
@Schema(description = "로그인 요청")
public record LoginRequest(
        @Schema(description = "이메일 주소", example = "user@example.com")
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @Schema(description = "비밀번호", example = "password123")
        @NotBlank(message = "Password is required")
        String password
) {
}
