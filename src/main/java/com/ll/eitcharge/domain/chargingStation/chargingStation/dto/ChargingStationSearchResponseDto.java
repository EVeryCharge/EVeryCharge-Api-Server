package com.ll.eitcharge.domain.chargingStation.chargingStation.dto;

import com.ll.eitcharge.domain.chargingStation.chargingStation.entity.ChargingStation;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChargingStationSearchResponseDto {
    private String statId;
    private String statNm;
    private String addr;
    private String location;
    private String useTime;
    private double lat;
    private double lng;
    private String busiId;
    private String bnm;
    private String busiNm;
    private String busiCall;
    private String isPrimaryYn;
    private String parkingFree;
    private String note;
    private String limitYn;
    private String limitDetail;
    private String delYn;
    private String delDetail;
    private String trafficYn;
    private String kind;
    private String kindDetail;
    private String zscode;
    private String zcode;
    private String regionDetailName;
    private String regionName;
    public ChargingStationSearchResponseDto(ChargingStation chargingStation) {
        this.statId = chargingStation.getStatId();
        this.statNm = chargingStation.getStatNm();
        this.addr = chargingStation.getAddr();
        this.location = chargingStation.getLocation();
        this.useTime = chargingStation.getUseTime();
        this.lat = chargingStation.getLat();
        this.lng = chargingStation.getLng();
        // 변경사항
        this.busiId = chargingStation.getOperatingCompany().getBusiId();
        this.bnm = chargingStation.getOperatingCompany().getBnm();
        this.busiNm = chargingStation.getBusiNm();
        this.busiCall = chargingStation.getBusiCall();
        this.isPrimaryYn = chargingStation.getOperatingCompany().getIsPrimary();
        //
        this.parkingFree = chargingStation.getParkingFree();
        this.note = chargingStation.getNote();
        this.limitYn = chargingStation.getLimitYn();
        this.limitDetail = chargingStation.getLimitDetail();
        this.delYn = chargingStation.getDelYn();
        this.delDetail = chargingStation.getDelDetail();
        this.trafficYn = chargingStation.getTrafficYn();
        this.kind = chargingStation.getKind();
        this.kindDetail = chargingStation.getKindDetail();
        this.zscode = chargingStation.getRegionDetail().getZscode();
        this.regionDetailName = chargingStation.getRegionDetail().getRegionDetailName();
        //
        this.zcode = chargingStation.getRegionDetail().getZcode().getZcode();
        this.regionName = chargingStation.getRegionDetail().getZcode().getRegionName();
    }
}
