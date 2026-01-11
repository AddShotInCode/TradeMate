package aib.trademate.domain.stock.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "daily_price", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = {"stock_id", "date"}) // 중복 데이터 방지
       })
public class DailyPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // [코딩 전략] LAZY 로딩 필수, N:1 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Column(nullable = false)
    private LocalDate date; // 기준일자

    private Long openPrice;   // 시가
    private Long highPrice;   // 고가
    private Long lowPrice;    // 저가
    private Long closePrice;  // 종가
    private Long volume;      // 거래량
    private Long changeAmount;// 대비
    private Double changeRate;// 등락률

    @Builder
    public DailyPrice(Stock stock, LocalDate date, Long openPrice, Long highPrice, 
                      Long lowPrice, Long closePrice, Long volume, 
                      Long changeAmount, Double changeRate) {
        this.stock = stock;
        this.date = date;
        this.openPrice = openPrice;
        this.highPrice = highPrice;
        this.lowPrice = lowPrice;
        this.closePrice = closePrice;
        this.volume = volume;
        this.changeAmount = changeAmount;
        this.changeRate = changeRate;
    }
}