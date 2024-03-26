package com.ll.everycharge.domain.review.review.entity;

import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.everycharge.domain.member.member.entity.Member;
import com.ll.everycharge.global.jpa.entity.BaseTime;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
public class Review extends BaseTime {
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "stat_id")
    private ChargingStation chargingStation;

    @ManyToOne(fetch = LAZY)
    private Member member;

    @Setter
    private String content;

    private LocalDateTime deletedDate;
    private boolean isDeleted;

    @Setter
    @Builder.Default
    private int rating = 0; // 평점 속성 추가
}
