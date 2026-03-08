package aib.trademate.domain.auth.service;

import aib.trademate.domain.auth.dto.LoginRequest;
import aib.trademate.domain.auth.dto.SignUpRequest;
import aib.trademate.domain.auth.dto.TokenResponse;
import aib.trademate.domain.member.entity.Member;
import aib.trademate.domain.member.entity.RefreshToken;
import aib.trademate.domain.member.repository.MemberRepository;
import aib.trademate.domain.member.repository.RefreshTokenRepository;
import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
import aib.trademate.global.security.jwt.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

/**
 * AuthService 단위 테스트
 * 
 * 인증 관련 비즈니스 로직을 검증합니다.
 * Mockito를 사용하여 외부 의존성을 모킹합니다.
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService 테스트")
@SuppressWarnings("null")
class AuthServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        // accessTokenValidity 주입 (30분 = 1800000ms)
        ReflectionTestUtils.setField(authService, "accessTokenValidity", 1800000L);
    }

    @Nested
    @DisplayName("회원가입 테스트")
    class SignUpTest {

        @Test
        @DisplayName("정상적인 회원가입 요청이 성공한다")
        void signUpSuccess() {
            // given
            SignUpRequest request = createSignUpRequest();
            given(memberRepository.existsByEmail(request.email())).willReturn(false);
            given(passwordEncoder.encode(request.password())).willReturn("encodedPassword");
            given(memberRepository.save(any(Member.class))).willReturn(createMember());

            // when
            authService.signUp(request);

            // then
            verify(memberRepository).existsByEmail(request.email());
            verify(passwordEncoder).encode(request.password());
            verify(memberRepository).save(any(Member.class));
        }

        @Test
        @DisplayName("이미 존재하는 이메일로 회원가입 시 예외가 발생한다")
        void signUpFailsWhenEmailExists() {
            // given
            SignUpRequest request = createSignUpRequest();
            given(memberRepository.existsByEmail(request.email())).willReturn(true);

            // when & then
            assertThatThrownBy(() -> authService.signUp(request))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.EMAIL_ALREADY_EXISTS);
                    });

            verify(memberRepository, never()).save(any(Member.class));
        }
    }

    @Nested
    @DisplayName("로그인 테스트")
    class LoginTest {

        @Test
        @DisplayName("정상적인 로그인 요청이 성공한다")
        void loginSuccess() {
            // given
            LoginRequest request = new LoginRequest("test@test.com", "password123");
            Member member = createMember();

            given(memberRepository.findByEmail(request.email())).willReturn(Optional.of(member));
            given(passwordEncoder.matches(request.password(), member.getPassword())).willReturn(true);
            given(jwtTokenProvider.createAccessToken(member.getEmail())).willReturn("accessToken");
            given(jwtTokenProvider.createRefreshToken(member.getEmail())).willReturn("refreshToken");
            given(jwtTokenProvider.getRefreshTokenValidity()).willReturn(604800000L);  // 7일
            given(refreshTokenRepository.findByMemberId(member.getId())).willReturn(Optional.empty());

            // when
            TokenResponse response = authService.login(request);

            // then
            assertThat(response.accessToken()).isEqualTo("accessToken");
            assertThat(response.refreshToken()).isEqualTo("refreshToken");
            assertThat(response.expiresIn()).isEqualTo(1800L);  // 30분 (초 단위)

            verify(memberRepository).findByEmail(request.email());
            verify(passwordEncoder).matches(request.password(), member.getPassword());
            verify(jwtTokenProvider).createAccessToken(member.getEmail());
            verify(jwtTokenProvider).createRefreshToken(member.getEmail());
        }

        @Test
        @DisplayName("존재하지 않는 이메일로 로그인 시 예외가 발생한다")
        void loginFailsWhenEmailNotFound() {
            // given
            LoginRequest request = new LoginRequest("notfound@test.com", "password123");
            given(memberRepository.findByEmail(request.email())).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> authService.login(request))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INVALID_CREDENTIALS);
                    });
        }

        @Test
        @DisplayName("잘못된 비밀번호로 로그인 시 예외가 발생한다")
        void loginFailsWhenPasswordMismatch() {
            // given
            LoginRequest request = new LoginRequest("test@test.com", "wrongpassword");
            Member member = createMember();

            given(memberRepository.findByEmail(request.email())).willReturn(Optional.of(member));
            given(passwordEncoder.matches(request.password(), member.getPassword())).willReturn(false);

            // when & then
            assertThatThrownBy(() -> authService.login(request))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INVALID_CREDENTIALS);
                    });

            verify(jwtTokenProvider, never()).createAccessToken(anyString());
        }

        @Test
        @DisplayName("로그인 시 기존 refresh token이 있으면 갱신한다")
        void loginUpdatesExistingRefreshToken() {
            // given
            LoginRequest request = new LoginRequest("test@test.com", "password123");
            Member member = createMember();
            RefreshToken existingToken = createRefreshToken(member.getId());

            given(memberRepository.findByEmail(request.email())).willReturn(Optional.of(member));
            given(passwordEncoder.matches(request.password(), member.getPassword())).willReturn(true);
            given(jwtTokenProvider.createAccessToken(member.getEmail())).willReturn("newAccessToken");
            given(jwtTokenProvider.createRefreshToken(member.getEmail())).willReturn("newRefreshToken");
            given(jwtTokenProvider.getRefreshTokenValidity()).willReturn(604800000L);
            given(refreshTokenRepository.findByMemberId(member.getId())).willReturn(Optional.of(existingToken));

            // when
            TokenResponse response = authService.login(request);

            // then
            assertThat(response.refreshToken()).isEqualTo("newRefreshToken");
            verify(refreshTokenRepository).save(existingToken);
        }
    }

    @Nested
    @DisplayName("토큰 갱신 테스트")
    class RefreshTokenTest {

        @Test
        @DisplayName("유효한 refresh token으로 토큰 갱신이 성공한다")
        void refreshSuccess() {
            // given
            String refreshToken = "validRefreshToken";
            Member member = createMember();
            RefreshToken storedToken = createRefreshToken(member.getId());
            storedToken.updateToken(refreshToken, LocalDateTime.now().plusDays(7));

            given(refreshTokenRepository.findByToken(refreshToken)).willReturn(Optional.of(storedToken));
            given(jwtTokenProvider.getEmailFromToken(refreshToken)).willReturn(member.getEmail());
            given(jwtTokenProvider.createAccessToken(member.getEmail())).willReturn("newAccessToken");
            given(jwtTokenProvider.createRefreshToken(member.getEmail())).willReturn("newRefreshToken");
            given(jwtTokenProvider.getRefreshTokenValidity()).willReturn(604800000L);

            // when
            TokenResponse response = authService.refreshWithToken(refreshToken);

            // then
            assertThat(response.accessToken()).isEqualTo("newAccessToken");
            assertThat(response.refreshToken()).isEqualTo("newRefreshToken");
            verify(refreshTokenRepository).save(storedToken);
        }

        @Test
        @DisplayName("DB에 없는 refresh token으로 갱신 시 예외가 발생한다")
        void refreshFailsWhenTokenNotFound() {
            // given
            String refreshToken = "unknownToken";
            given(refreshTokenRepository.findByToken(refreshToken)).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> authService.refreshWithToken(refreshToken))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INVALID_TOKEN);
                    });
        }

        @Test
        @DisplayName("만료된 refresh token으로 갱신 시 예외가 발생한다")
        void refreshFailsWhenTokenExpired() {
            // given
            String refreshToken = "expiredToken";
            RefreshToken expiredToken = RefreshToken.builder()
                    .memberId(1L)
                    .token(refreshToken)
                    .expiryDate(LocalDateTime.now().minusDays(1))  // 만료됨
                    .build();

            given(refreshTokenRepository.findByToken(refreshToken)).willReturn(Optional.of(expiredToken));

            // when & then
            assertThatThrownBy(() -> authService.refreshWithToken(refreshToken))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.TOKEN_EXPIRED);
                    });

            verify(refreshTokenRepository).delete(expiredToken);
        }
    }

    @Nested
    @DisplayName("로그아웃 테스트")
    class LogoutTest {

        @Test
        @DisplayName("로그아웃 시 refresh token이 삭제된다")
        void logoutSuccess() {
            // given
            String email = "test@test.com";
            Member member = createMember();
            given(memberRepository.findByEmail(email)).willReturn(Optional.of(member));

            // when
            authService.logout(email);

            // then
            verify(refreshTokenRepository).deleteByMemberId(member.getId());
        }

        @Test
        @DisplayName("존재하지 않는 회원의 로그아웃 시 예외가 발생한다")
        void logoutFailsWhenMemberNotFound() {
            // given
            String email = "notfound@test.com";
            given(memberRepository.findByEmail(email)).willReturn(Optional.empty());

            // when & then
            assertThatThrownBy(() -> authService.logout(email))
                    .isInstanceOf(BusinessException.class)
                    .satisfies(ex -> {
                        BusinessException be = (BusinessException) ex;
                        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
                    });

            verify(refreshTokenRepository, never()).deleteByMemberId(anyLong());
        }
    }

    // ========== Helper Methods ==========

    private SignUpRequest createSignUpRequest() {
        return new SignUpRequest(
                "test@test.com",
                "password123",
                "홍길동",
                LocalDate.of(1990, 1, 1),
                "010-1234-5678"
        );
    }

    private Member createMember() {
        Member member = Member.builder()
                .email("test@test.com")
                .password("encodedPassword")
                .name("홍길동")
                .birthdate(LocalDate.of(1990, 1, 1))
                .phone("010-1234-5678")
                .build();
        ReflectionTestUtils.setField(member, "id", 1L);
        return member;
    }

    private RefreshToken createRefreshToken(Long memberId) {
        return RefreshToken.builder()
                .memberId(memberId)
                .token("oldRefreshToken")
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();
    }
}
