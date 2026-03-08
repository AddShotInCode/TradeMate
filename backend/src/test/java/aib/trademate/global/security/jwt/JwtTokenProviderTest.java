package aib.trademate.global.security.jwt;

import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

/**
 * JwtTokenProvider 단위 테스트
 * 
 * JWT 토큰 생성, 검증, 파싱 로직을 테스트합니다.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("JwtTokenProvider 테스트")
@SuppressWarnings("null")
class JwtTokenProviderTest {

    @Mock
    private UserDetailsService userDetailsService;

    private JwtTokenProvider jwtTokenProvider;

    // 테스트용 시크릿 키 (32바이트 이상)
    private static final String TEST_SECRET = "test-secret-key-for-jwt-token-generation-must-be-at-least-256-bits";
    private static final long ACCESS_TOKEN_VALIDITY = 1800000L;   // 30분
    private static final long REFRESH_TOKEN_VALIDITY = 604800000L; // 7일

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(userDetailsService);
        ReflectionTestUtils.setField(jwtTokenProvider, "secretKey", TEST_SECRET);
        ReflectionTestUtils.setField(jwtTokenProvider, "accessTokenValidity", ACCESS_TOKEN_VALIDITY);
        ReflectionTestUtils.setField(jwtTokenProvider, "refreshTokenValidity", REFRESH_TOKEN_VALIDITY);
        
        // @PostConstruct 수동 호출
        jwtTokenProvider.init();
    }

    @Nested
    @DisplayName("토큰 생성 테스트")
    class CreateTokenTest {

        @Test
        @DisplayName("Access Token을 정상적으로 생성한다")
        void createAccessTokenSuccess() {
            // given
            String email = "test@test.com";

            // when
            String token = jwtTokenProvider.createAccessToken(email);

            // then
            assertThat(token).isNotNull().isNotEmpty();
            assertThat(jwtTokenProvider.validateToken(token)).isTrue();
        }

        @Test
        @DisplayName("Refresh Token을 정상적으로 생성한다")
        void createRefreshTokenSuccess() {
            // given
            String email = "test@test.com";

            // when
            String token = jwtTokenProvider.createRefreshToken(email);

            // then
            assertThat(token).isNotNull().isNotEmpty();
            assertThat(jwtTokenProvider.validateToken(token)).isTrue();
        }

        @Test
        @DisplayName("동일한 이메일로 생성한 토큰에서 이메일을 추출할 수 있다")
        void extractEmailFromCreatedToken() {
            // given
            String email = "test@test.com";

            // when
            String token = jwtTokenProvider.createAccessToken(email);
            String extractedEmail = jwtTokenProvider.getEmailFromToken(token);

            // then
            assertThat(extractedEmail).isEqualTo(email);
        }
    }

    @Nested
    @DisplayName("토큰 검증 테스트")
    class ValidateTokenTest {

        @Test
        @DisplayName("유효한 토큰 검증이 성공한다")
        void validateTokenSuccess() {
            // given
            String token = jwtTokenProvider.createAccessToken("test@test.com");

            // when
            boolean isValid = jwtTokenProvider.validateToken(token);

            // then
            assertThat(isValid).isTrue();
        }

        @Test
        @DisplayName("만료된 토큰 검증이 실패한다")
        void validateExpiredTokenFails() {
            // given - 만료된 토큰 직접 생성
            String expiredToken = createExpiredToken("test@test.com");

            // when
            boolean isValid = jwtTokenProvider.validateToken(expiredToken);

            // then
            assertThat(isValid).isFalse();
        }

        @Test
        @DisplayName("잘못된 형식의 토큰 검증이 실패한다")
        void validateMalformedTokenFails() {
            // given
            String malformedToken = "invalid.token.format";

            // when
            boolean isValid = jwtTokenProvider.validateToken(malformedToken);

            // then
            assertThat(isValid).isFalse();
        }

        @Test
        @DisplayName("빈 토큰 검증이 실패한다")
        void validateEmptyTokenFails() {
            // given
            String emptyToken = "";

            // when
            boolean isValid = jwtTokenProvider.validateToken(emptyToken);

            // then
            assertThat(isValid).isFalse();
        }

        @Test
        @DisplayName("null 토큰 검증이 실패한다")
        void validateNullTokenFails() {
            // when
            boolean isValid = jwtTokenProvider.validateToken(null);

            // then
            assertThat(isValid).isFalse();
        }
    }

    @Nested
    @DisplayName("토큰 검증 (예외 발생 버전) 테스트")
    class ValidateTokenOrThrowTest {

        @Test
        @DisplayName("유효한 토큰은 예외가 발생하지 않는다")
        void validateTokenOrThrowSuccess() {
            // given
            String token = jwtTokenProvider.createAccessToken("test@test.com");

            // when & then - 예외 없이 통과
            jwtTokenProvider.validateTokenOrThrow(token);
        }

        @Test
        @DisplayName("만료된 토큰은 TOKEN_EXPIRED 예외가 발생한다")
        void validateTokenOrThrowExpired() {
            // given
            String expiredToken = createExpiredToken("test@test.com");

            // when & then
            assertThatThrownBy(() -> jwtTokenProvider.validateTokenOrThrow(expiredToken))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.TOKEN_EXPIRED);
                    });
        }

        @Test
        @DisplayName("잘못된 형식의 토큰은 MALFORMED_TOKEN 예외가 발생한다")
        void validateTokenOrThrowMalformed() {
            // given
            String malformedToken = "invalid.token.format";

            // when & then
            assertThatThrownBy(() -> jwtTokenProvider.validateTokenOrThrow(malformedToken))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.MALFORMED_TOKEN);
                    });
        }

        @Test
        @DisplayName("빈 토큰은 INVALID_TOKEN 예외가 발생한다")
        void validateTokenOrThrowEmpty() {
            // given
            String emptyToken = "";

            // when & then
            assertThatThrownBy(() -> jwtTokenProvider.validateTokenOrThrow(emptyToken))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INVALID_TOKEN);
                    });
        }
    }

    @Nested
    @DisplayName("토큰에서 이메일 추출 테스트")
    class GetEmailFromTokenTest {

        @Test
        @DisplayName("유효한 토큰에서 이메일을 추출한다")
        void getEmailFromTokenSuccess() {
            // given
            String email = "test@test.com";
            String token = jwtTokenProvider.createAccessToken(email);

            // when
            String extractedEmail = jwtTokenProvider.getEmailFromToken(token);

            // then
            assertThat(extractedEmail).isEqualTo(email);
        }

        @Test
        @DisplayName("만료된 토큰에서 이메일 추출 시 TOKEN_EXPIRED 예외가 발생한다")
        void getEmailFromExpiredTokenFails() {
            // given
            String expiredToken = createExpiredToken("test@test.com");

            // when & then
            assertThatThrownBy(() -> jwtTokenProvider.getEmailFromToken(expiredToken))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.TOKEN_EXPIRED);
                    });
        }

        @Test
        @DisplayName("잘못된 형식의 토큰에서 이메일 추출 시 MALFORMED_TOKEN 예외가 발생한다")
        void getEmailFromMalformedTokenFails() {
            // given
            String malformedToken = "invalid.token.format";

            // when & then
            assertThatThrownBy(() -> jwtTokenProvider.getEmailFromToken(malformedToken))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.MALFORMED_TOKEN);
                    });
        }
    }

    @Nested
    @DisplayName("Authentication 객체 생성 테스트")
    class GetAuthenticationTest {

        @Test
        @DisplayName("토큰에서 Authentication 객체를 생성한다")
        void getAuthenticationSuccess() {
            // given
            String email = "test@test.com";
            String token = jwtTokenProvider.createAccessToken(email);
            
            UserDetails userDetails = User.builder()
                    .username(email)
                    .password("password")
                    .authorities(Collections.emptyList())
                    .build();
            
            given(userDetailsService.loadUserByUsername(email)).willReturn(userDetails);

            // when
            Authentication authentication = jwtTokenProvider.getAuthentication(token);

            // then
            assertThat(authentication).isNotNull();
            assertThat(authentication.getName()).isEqualTo(email);
            assertThat(authentication.isAuthenticated()).isTrue();
        }
    }

    @Nested
    @DisplayName("토큰 유효기간 조회 테스트")
    class TokenValidityTest {

        @Test
        @DisplayName("Refresh Token 유효기간을 반환한다")
        void getRefreshTokenValiditySuccess() {
            // when
            long validity = jwtTokenProvider.getRefreshTokenValidity();

            // then
            assertThat(validity).isEqualTo(REFRESH_TOKEN_VALIDITY);
        }
    }

    // ========== Helper Methods ==========

    /**
     * 만료된 토큰 생성 (테스트용)
     */
    private String createExpiredToken(String email) {
        SecretKey key = Keys.hmacShaKeyFor(TEST_SECRET.getBytes(StandardCharsets.UTF_8));
        Date now = new Date();
        Date expiredDate = new Date(now.getTime() - 1000); // 1초 전에 만료

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(now.getTime() - 10000))
                .expiration(expiredDate)
                .signWith(key)
                .compact();
    }
}
