package com.ll.eitcharge.domain.mypage.car.entity;

import com.ll.eitcharge.global.jpa.entity.BaseTime;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PROTECTED;

@Entity
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder(toBuilder = true)
@Getter
public class Car extends BaseTime {
    // 제조사
    private String manufacturer;
    // 모델명
    private String carModel;
    // 배터리용량
    private String battery;
    // 충전시간(급속)
    private String chargeTimeFast;
    // 충전시간(완속)
    private String chargeTimeSlow;
    // 승차인원
    private String maxBoard;
    //충전방식(급속)
    private String chargeWayFast;
    //충전방식(완속)
    private String chargeWaySlow;

}
