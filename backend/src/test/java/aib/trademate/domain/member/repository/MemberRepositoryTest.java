package aib.trademate.domain.member.repository;

import aib.trademate.domain.member.entity.Member;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * MemberRepository 통합 테스트
 * 
 * H2 인메모리 DB를 사용하여 쿼리 동작을 검증합니다.
 */
@DataJpaTest
@DisplayName("MemberRepository 테스트")
@SuppressWarnings("null")
class MemberRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private MemberRepository memberRepository;

    private Member testMember;

    @BeforeEach
    void setUp() {
        testMember = Member.builder()
                .email("test@test.com")
                .password("encodedPassword")
                .name("홍길동")
                .birthdate(LocalDate.of(1990, 1, 1))
                .phone("010-1234-5678")
                .build();
        entityManager.persistAndFlush(testMember);
        entityManager.clear();
    }

    @Nested
    @DisplayName("findByEmail 테스트")
    class FindByEmailTest {

        @Test
        @DisplayName("이메일로 회원을 찾는다")
        void findByEmailSuccess() {
            // when
            Optional<Member> result = memberRepository.findByEmail("test@test.com");

            // then
            assertThat(result).isPresent();
            assertThat(result.get().getEmail()).isEqualTo("test@test.com");
            assertThat(result.get().getName()).isEqualTo("홍길동");
        }

        @Test
        @DisplayName("존재하지 않는 이메일은 빈 Optional을 반환한다")
        void findByEmailReturnsEmpty() {
            // when
            Optional<Member> result = memberRepository.findByEmail("notfound@test.com");

            // then
            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("existsByEmail 테스트")
    class ExistsByEmailTest {

        @Test
        @DisplayName("존재하는 이메일은 true를 반환한다")
        void existsByEmailReturnsTrue() {
            // when
            boolean exists = memberRepository.existsByEmail("test@test.com");

            // then
            assertThat(exists).isTrue();
        }

        @Test
        @DisplayName("존재하지 않는 이메일은 false를 반환한다")
        void existsByEmailReturnsFalse() {
            // when
            boolean exists = memberRepository.existsByEmail("notfound@test.com");

            // then
            assertThat(exists).isFalse();
        }
    }

    @Nested
    @DisplayName("CRUD 테스트")
    class CrudTest {

        @Test
        @DisplayName("회원을 저장하고 조회한다")
        void saveAndFind() {
            // given
            Member newMember = Member.builder()
                    .email("new@test.com")
                    .password("password")
                    .name("김철수")
                    .birthdate(LocalDate.of(1995, 5, 5))
                    .phone("010-9999-8888")
                    .build();

            // when
            Member saved = memberRepository.save(newMember);
            entityManager.flush();
            entityManager.clear();

            Optional<Member> found = memberRepository.findById(saved.getId());

            // then
            assertThat(found).isPresent();
            assertThat(found.get().getEmail()).isEqualTo("new@test.com");
            assertThat(found.get().getName()).isEqualTo("김철수");
        }

        @Test
        @DisplayName("회원을 삭제한다")
        void delete() {
            // given
            Long memberId = testMember.getId();

            // when
            memberRepository.deleteById(memberId);
            entityManager.flush();
            entityManager.clear();

            // then
            assertThat(memberRepository.findById(memberId)).isEmpty();
        }
    }
}
