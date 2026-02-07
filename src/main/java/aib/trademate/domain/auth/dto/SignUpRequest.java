package aib.trademate.domain.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * 회원가입 요청 DTO
 */
@Schema(description = "회원가입 요청")
public record SignUpRequest(
        @Schema(description = "이메일 주소", example = "user@example.com")
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @Schema(description = "비밀번호 (8~20자)", example = "password123")
        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 20, message = "Password must be between 8 and 20 characters")
        String password,

        @Schema(description = "이름 (2~50자)", example = "홍길동")
        @NotBlank(message = "Name is required")
        @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
        String name,

        @Schema(description = "생년월일", example = "1990-01-15")
        @NotNull(message = "Birthdate is required")
        LocalDate birthdate,

        @Schema(description = "휴대폰 번호", example = "010-1234-5678")
        @Pattern(regexp = "^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$", message = "Invalid phone number format")
        String phone
) {
}
