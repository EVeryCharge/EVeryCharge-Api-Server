package com.ll.eitcharge.domain.review.review.entity;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.global.jpa.entity.BaseTime;
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
@Setter
public class Review extends BaseTime {
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "stat_id")
    private ChargingStation chargingStation;

    @ManyToOne(fetch = LAZY)
    private Member member;

    private String content;

    private LocalDateTime deletedDate;
    private boolean isDeleted;

    @Builder.Default
    private int rating = 0; // 평점 속성 추가
}
