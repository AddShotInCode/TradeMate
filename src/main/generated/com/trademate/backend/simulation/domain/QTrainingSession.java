package com.trademate.backend.simulation.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTrainingSession is a Querydsl query type for TrainingSession
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTrainingSession extends EntityPathBase<TrainingSession> {

    private static final long serialVersionUID = -619698995L;

    public static final QTrainingSession trainingSession = new QTrainingSession("trainingSession");

    public final com.trademate.backend.global.common.QBaseTimeEntity _super = new com.trademate.backend.global.common.QBaseTimeEntity(this);

    public final NumberPath<java.math.BigDecimal> averagePrice = createNumber("averagePrice", java.math.BigDecimal.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final NumberPath<java.math.BigDecimal> currentBalance = createNumber("currentBalance", java.math.BigDecimal.class);

    public final DateTimePath<java.time.LocalDateTime> currentVirtualTime = createDateTime("currentVirtualTime", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> endDate = createDateTime("endDate", java.time.LocalDateTime.class);

    public final NumberPath<Integer> holdingQuantity = createNumber("holdingQuantity", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<java.math.BigDecimal> initialBalance = createNumber("initialBalance", java.math.BigDecimal.class);

    public final BooleanPath isFinished = createBoolean("isFinished");

    public final StringPath rulesConfig = createString("rulesConfig");

    public final DateTimePath<java.time.LocalDateTime> startDate = createDateTime("startDate", java.time.LocalDateTime.class);

    public final StringPath stockCode = createString("stockCode");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QTrainingSession(String variable) {
        super(TrainingSession.class, forVariable(variable));
    }

    public QTrainingSession(Path<? extends TrainingSession> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTrainingSession(PathMetadata metadata) {
        super(TrainingSession.class, metadata);
    }

}

