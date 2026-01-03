package com.trademate.backend.candle.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QCandle is a Querydsl query type for Candle
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCandle extends EntityPathBase<Candle> {

    private static final long serialVersionUID = 556323842L;

    public static final QCandle candle = new QCandle("candle");

    public final com.trademate.backend.global.common.QBaseTimeEntity _super = new com.trademate.backend.global.common.QBaseTimeEntity(this);

    public final NumberPath<java.math.BigDecimal> close = createNumber("close", java.math.BigDecimal.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final DateTimePath<java.time.LocalDateTime> dateTime = createDateTime("dateTime", java.time.LocalDateTime.class);

    public final NumberPath<java.math.BigDecimal> high = createNumber("high", java.math.BigDecimal.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<java.math.BigDecimal> low = createNumber("low", java.math.BigDecimal.class);

    public final NumberPath<java.math.BigDecimal> open = createNumber("open", java.math.BigDecimal.class);

    public final StringPath stockCode = createString("stockCode");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final NumberPath<Long> volume = createNumber("volume", Long.class);

    public QCandle(String variable) {
        super(Candle.class, forVariable(variable));
    }

    public QCandle(Path<? extends Candle> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCandle(PathMetadata metadata) {
        super(Candle.class, metadata);
    }

}

