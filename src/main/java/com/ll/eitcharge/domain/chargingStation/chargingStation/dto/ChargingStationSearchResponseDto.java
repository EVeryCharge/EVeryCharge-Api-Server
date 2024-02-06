package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import com.ll.eitcharge.domain.charger.charger.entity.Charger;
import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@NoArgsConstructor
public class ChargingStationSearchResponseDto {
    private String statId; // 충전소 ID
    private String statNm; // 충전소 이름
    private String addr; // 주소
    private String useTime; // 이용 가능 시간 등
    private double lat; // 위도
    private double lng; // 경도
    private List<String> chargerTypes; // 보유 충전기 타입
    private String busiId; // 기관 ID
    private String bnm; // 기관명
    private String busiNm; // 운영기관명
    private String parkingFree; // 무료주차 여부
    private String limitYn; // 개방 여부

    // API TEST 용 필드(백업)
    //    private String regionName;
    //    private String regionDetailName;
    //    private String zcode;
    //    private String zscode;
    //    private String isPrimary;

    public ChargingStationSearchResponseDto(ChargingStation chargingStation) {
        this.statId = chargingStation.getStatId();
        this.statNm = chargingStation.getStatNm();
        this.addr = chargingStation.getAddr();
        this.useTime = chargingStation.getUseTime();
        this.lat = chargingStation.getLat();
        this.lng = chargingStation.getLng();
        this.chargerTypes = chargingStation.getChargers().stream()
                .map(Charger::getChgerType)
                .distinct()
                .collect(Collectors.toList());
        this.busiId = chargingStation.getOperatingCompany().getBusiId();
        this.bnm = chargingStation.getOperatingCompany().getBnm();
        this.busiNm = chargingStation.getBusiNm();
        this.parkingFree = chargingStation.getParkingFree();
        this.limitYn = chargingStation.getLimitYn();

        // API TEST 용 필드(백업)
        //        this.isPrimary = chargingStation.getOperatingCompany().getIsPrimary();
        //        this.zscode = chargingStation.getRegionDetail().getZscode();
        //        this.regionDetailName = chargingStation.getRegionDetail().getRegionDetailName();
        //        this.zcode = chargingStation.getRegionDetail().getZcode().getZcode();
        //        this.regionName = chargingStation.getRegionDetail().getZcode().getRegionName();
    }
}
