package aib.trademate.domain.auth.service;

import aib.trademate.domain.auth.dto.LoginRequest;
import aib.trademate.domain.auth.dto.RefreshTokenRequest;
import aib.trademate.domain.auth.dto.SignUpRequest;
import aib.trademate.domain.auth.dto.TokenResponse;
import aib.trademate.domain.member.entity.Member;
import aib.trademate.domain.member.entity.RefreshToken;
import aib.trademate.domain.member.repository.MemberRepository;
import aib.trademate.domain.member.repository.RefreshTokenRepository;
import aib.trademate.global.exception.BusinessException;
import aib.trademate.global.exception.ErrorCode;
import aib.trademate.global.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 인증 관련 비즈니스 로직을 처리하는 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
@SuppressWarnings("null") // Builder 패턴으로 생성된 객체는 null이 아님
public class AuthService {

    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.access-token-validity}")
    private long accessTokenValidity;

    /**
     * 회원가입
     */
    @Transactional
    public void signUp(SignUpRequest request) {
        // 이메일 중복 확인
        if (memberRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS, request.email());
        }

        // 회원 저장
        Member member = Member.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .phone(request.phone())
                .build();

        memberRepository.save(member);
        log.info("New member registered: {}", request.email());
    }

    /**
     * 로그인
     */
    @Transactional
    public TokenResponse login(LoginRequest request) {
        // 이메일로 회원 조회
        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }

        // 토큰 생성
        String accessToken = jwtTokenProvider.createAccessToken(member.getEmail());
        String refreshToken = jwtTokenProvider.createRefreshToken(member.getEmail());

        // Refresh Token 저장/갱신
        saveOrUpdateRefreshToken(member.getId(), refreshToken);

        log.info("Member logged in: {}", request.email());
        return new TokenResponse(accessToken, refreshToken, accessTokenValidity / 1000);
    }

    /**
     * 토큰 갱신
     */
    @Transactional
    public TokenResponse refresh(RefreshTokenRequest request) {
        String requestRefreshToken = request.refreshToken();

        // Refresh Token 유효성 검증 (예외 발생 버전 사용)
        jwtTokenProvider.validateTokenOrThrow(requestRefreshToken);

        // DB에서 Refresh Token 조회
        RefreshToken storedToken = refreshTokenRepository.findByToken(requestRefreshToken)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_TOKEN, "Token not found in database"));

        // 만료 확인
        if (storedToken.isExpired()) {
            refreshTokenRepository.delete(storedToken);
            throw new BusinessException(ErrorCode.TOKEN_EXPIRED, "Refresh token has expired");
        }

        // 이메일 추출 및 새 토큰 발급
        String email = jwtTokenProvider.getEmailFromToken(requestRefreshToken);
        String newAccessToken = jwtTokenProvider.createAccessToken(email);
        String newRefreshToken = jwtTokenProvider.createRefreshToken(email);

        // Refresh Token 갱신
        storedToken.updateToken(newRefreshToken,
                LocalDateTime.now().plusSeconds(jwtTokenProvider.getRefreshTokenValidity() / 1000));
        refreshTokenRepository.save(storedToken);

        log.info("Token refreshed for: {}", email);
        return new TokenResponse(newAccessToken, newRefreshToken, accessTokenValidity / 1000);
    }

    /**
     * 로그아웃
     */
    @Transactional
    public void logout(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Member not found"));

        refreshTokenRepository.deleteByMemberId(member.getId());
        log.info("Member logged out: {}", email);
    }

    /**
     * Refresh Token 저장 또는 갱신
     */
    private void saveOrUpdateRefreshToken(Long memberId, String token) {
        LocalDateTime expiryDate = LocalDateTime.now()
                .plusSeconds(jwtTokenProvider.getRefreshTokenValidity() / 1000);

        refreshTokenRepository.findByMemberId(memberId)
                .ifPresentOrElse(
                        refreshToken -> {
                            refreshToken.updateToken(token, expiryDate);
                            refreshTokenRepository.save(refreshToken);
                        },
                        () -> refreshTokenRepository.save(
                                RefreshToken.builder()
                                        .memberId(memberId)
                                        .token(token)
                                        .expiryDate(expiryDate)
                                        .build()
                        )
                );
    }
}
