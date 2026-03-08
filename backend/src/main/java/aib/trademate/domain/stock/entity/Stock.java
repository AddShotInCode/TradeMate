package aib.trademate.domain.stock.entity;

import aib.trademate.global.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "stock") // DB 테이블명 명시
public class Stock extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code; // 종목 단축코드 (예: 005930)

    @Column(nullable = false)
    private String name; // 종목명

    private String marketType; // KOSPI, KOSDAQ

    @Builder
    public Stock(String code, String name, String marketType) {
        this.code = code;
        this.name = name;
        this.marketType = marketType;
    }

    // 종목 정보 업데이트 메서드
    public void updateInfo(String name, String marketType) {
        if (name != null && !name.isBlank()) {
            this.name = name;
        }
        if (marketType != null && !marketType.isBlank()) {
            this.marketType = marketType;
        }
    }
}