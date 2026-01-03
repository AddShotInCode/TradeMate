package com.trademate.backend.review.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTradeReview is a Querydsl query type for TradeReview
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTradeReview extends EntityPathBase<TradeReview> {

    private static final long serialVersionUID = -1199475748L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTradeReview tradeReview = new QTradeReview("tradeReview");

    public final com.trademate.backend.global.common.QBaseTimeEntity _super = new com.trademate.backend.global.common.QBaseTimeEntity(this);

    public final NumberPath<Integer> complianceRate = createNumber("complianceRate", Integer.class);

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt = _super.createdAt;

    public final StringPath feedbackMessage = createString("feedbackMessage");

    public final NumberPath<Integer> finalScore = createNumber("finalScore", Integer.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Double> profitRate = createNumber("profitRate", Double.class);

    public final com.trademate.backend.simulation.domain.QTrainingSession trainingSession;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> updatedAt = _super.updatedAt;

    public QTradeReview(String variable) {
        this(TradeReview.class, forVariable(variable), INITS);
    }

    public QTradeReview(Path<? extends TradeReview> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTradeReview(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTradeReview(PathMetadata metadata, PathInits inits) {
        this(TradeReview.class, metadata, inits);
    }

    public QTradeReview(Class<? extends TradeReview> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.trainingSession = inits.isInitialized("trainingSession") ? new com.trademate.backend.simulation.domain.QTrainingSession(forProperty("trainingSession")) : null;
    }

}

