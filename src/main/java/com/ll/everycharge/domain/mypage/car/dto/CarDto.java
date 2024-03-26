package com.ll.everycharge.domain.mypage.car.dto;

import com.ll.everycharge.domain.mypage.car.entity.Car;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static lombok.AccessLevel.PROTECTED;

@NoArgsConstructor(access = PROTECTED)
@Getter
public class CarDto {
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
    //차량 이미지
    private String imgUrl;

    public CarDto(Car car) {
        this.manufacturer = car.getManufacturer();
        this.carModel = car.getCarModel();
        this.battery =  car.getBattery();
        this.chargeTimeFast =  car.getChargeTimeFast();
        this.chargeTimeSlow =  car.getChargeTimeSlow();
        this.maxBoard =  car.getMaxBoard();
        this.chargeWayFast =  car.getChargeWayFast();
        this.chargeWaySlow =  car.getChargeWaySlow();
        this.imgUrl = car.getImgUrl();
    }
}
