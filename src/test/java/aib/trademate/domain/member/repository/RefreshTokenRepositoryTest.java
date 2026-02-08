package aib.trademate.domain.member.repository;

import aib.trademate.domain.member.entity.Member;
import aib.trademate.domain.member.entity.RefreshToken;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * RefreshTokenRepository 통합 테스트
 * 
 * H2 인메모리 DB를 사용하여 쿼리 동작을 검증합니다.
 */
@DataJpaTest
@DisplayName("RefreshTokenRepository 테스트")
class RefreshTokenRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    private Member testMember;

    @BeforeEach
    void setUp() {
        testMember = Member.builder()
                .email("test@test.com")
                .password("password")
                .name("테스터")
                .birthdate(LocalDate.of(1990, 1, 1))
                .phone("010-1234-5678")
                .build();
        entityManager.persistAndFlush(testMember);
        entityManager.clear();
    }

    @Nested
    @DisplayName("findByMemberId 테스트")
    class FindByMemberIdTest {

        @Test
        @DisplayName("회원 ID로 RefreshToken을 찾는다")
        void findByMemberIdSuccess() {
            // given
            RefreshToken token = createRefreshToken(testMember.getId(), "refreshToken123");
            entityManager.persistAndFlush(token);
            entityManager.clear();

            // when
            Optional<RefreshToken> result = refreshTokenRepository.findByMemberId(testMember.getId());

            // then
            assertThat(result).isPresent();
            assertThat(result.get().getToken()).isEqualTo("refreshToken123");
        }

        @Test
        @DisplayName("RefreshToken이 없으면 빈 Optional을 반환한다")
        void findByMemberIdReturnsEmpty() {
            // when
            Optional<RefreshToken> result = refreshTokenRepository.findByMemberId(testMember.getId());

            // then
            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("findByToken 테스트")
    class FindByTokenTest {

        @Test
        @DisplayName("토큰 값으로 RefreshToken을 찾는다")
        void findByTokenSuccess() {
            // given
            String tokenValue = "uniqueRefreshToken123";
            RefreshToken token = createRefreshToken(testMember.getId(), tokenValue);
            entityManager.persistAndFlush(token);
            entityManager.clear();

            // when
            Optional<RefreshToken> result = refreshTokenRepository.findByToken(tokenValue);

            // then
            assertThat(result).isPresent();
            assertThat(result.get().getMemberId()).isEqualTo(testMember.getId());
        }

        @Test
        @DisplayName("존재하지 않는 토큰은 빈 Optional을 반환한다")
        void findByTokenReturnsEmpty() {
            // when
            Optional<RefreshToken> result = refreshTokenRepository.findByToken("nonExistentToken");

            // then
            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("deleteByMemberId 테스트")
    class DeleteByMemberIdTest {

        @Test
        @DisplayName("회원 ID로 RefreshToken을 삭제한다")
        void deleteByMemberIdSuccess() {
            // given
            RefreshToken token = createRefreshToken(testMember.getId(), "toBeDeleted");
            entityManager.persistAndFlush(token);
            entityManager.clear();

            // when
            refreshTokenRepository.deleteByMemberId(testMember.getId());
            entityManager.flush();
            entityManager.clear();

            // then
            assertThat(refreshTokenRepository.findByMemberId(testMember.getId())).isEmpty();
        }

        @Test
        @DisplayName("RefreshToken이 없어도 삭제 시 예외가 발생하지 않는다")
        void deleteByMemberIdNoException() {
            // when & then - 예외 없이 실행
            refreshTokenRepository.deleteByMemberId(testMember.getId());
            entityManager.flush();
        }
    }

    @Nested
    @DisplayName("토큰 업데이트 테스트")
    class UpdateTokenTest {

        @Test
        @DisplayName("토큰 값을 업데이트한다")
        void updateTokenSuccess() {
            // given
            RefreshToken token = createRefreshToken(testMember.getId(), "oldToken");
            entityManager.persistAndFlush(token);
            entityManager.clear();

            // when
            RefreshToken found = refreshTokenRepository.findByMemberId(testMember.getId()).orElseThrow();
            LocalDateTime newExpiry = LocalDateTime.now().plusDays(7);
            found.updateToken("newToken", newExpiry);
            entityManager.flush();
            entityManager.clear();

            // then
            RefreshToken updated = refreshTokenRepository.findByMemberId(testMember.getId()).orElseThrow();
            assertThat(updated.getToken()).isEqualTo("newToken");
        }
    }

    // ========== Helper Methods ==========

    private RefreshToken createRefreshToken(Long memberId, String token) {
        return RefreshToken.builder()
                .memberId(memberId)
                .token(token)
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();
    }
}
