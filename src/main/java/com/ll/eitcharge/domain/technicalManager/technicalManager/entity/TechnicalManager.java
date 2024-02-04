package com.ll.eitcharge.domain.technicalManager.technicalManager.entity;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.global.jpa.entity.BaseTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.*;

import static jakarta.persistence.FetchType.LAZY;
import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
public class TechnicalManager extends BaseTime {
    @OneToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToOne(fetch = LAZY)
    @JoinColumn(name = "stat_id")
    private ChargingStation chargingStation;

    // Member 엔티티의 name (username, id) == TechnicalManager의 name은 동일함으로 상정
    @Column(unique = true)
    private String name;
    private String field;
}
