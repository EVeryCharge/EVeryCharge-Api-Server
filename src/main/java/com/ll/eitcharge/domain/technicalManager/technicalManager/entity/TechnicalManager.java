package com.ll.eitcharge.domain.technicalManager.technicalManager.entity;

import static jakarta.persistence.FetchType.*;
import static lombok.AccessLevel.*;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import com.ll.eitcharge.domain.member.member.entity.Member;
import com.ll.eitcharge.global.jpa.entity.BaseTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
@Getter
@Setter
public class TechnicalManager extends BaseTime {
    @OneToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToOne(fetch = LAZY)
    @JoinColumn(name = "charging_station_id")
    private ChargingStation chargingStation;

    // Member 엔티티의 name (username, id) == TechnicalManager의 name은 동일함으로 상정
    @Column(unique = true)
    private String name;
    private String field;
}
