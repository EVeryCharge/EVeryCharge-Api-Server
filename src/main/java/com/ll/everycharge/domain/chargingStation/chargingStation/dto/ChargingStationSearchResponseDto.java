package com.ll.everycharge.domain.chargingStation.chargingStation.dto;

import com.ll.everycharge.domain.chargingStation.chargingStation.entity.ChargingStation;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChargingStationSearchResponseDto {
    private String statId; // 충전소 ID
    private String bnm; // 기관명
    private String totalChger;
    private String availableChger;
    private double lat; // 위도
    private double lng; // 경도


    public ChargingStationSearchResponseDto(ChargingStation chargingStation) {
        this.statId = chargingStation.getStatId();
        this.bnm = chargingStation.getOperatingCompany().getBnm();
        this.totalChger = String.valueOf(chargingStation.getChargers().size());
        this.availableChger = String.valueOf(chargingStation.getChargers().stream()
             .filter(charger -> charger.getStat().contentEquals("2"))
             .count());
        this.lat = chargingStation.getLat();
        this.lng = chargingStation.getLng();
    }
}
